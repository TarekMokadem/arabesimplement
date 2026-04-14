"use server";

import { headers } from "next/headers";
import type Stripe from "stripe";
import type { OrderFormInput } from "@/lib/validations/order.schema";
import type { CartItem } from "@/store/cart.store";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";
import { resolveIncompleteSubscriptionInvoicePayment } from "@/lib/stripe/incomplete-subscription-payment";
import { ensureStripeCustomerForCheckout } from "@/lib/stripe/checkout-customer";
import {
  recurringCartStripePriceIdForMinutes,
  recurringCartStripePriceIdsConfigured,
} from "@/lib/stripe/recurring-cart-prices";
import {
  classifyCheckoutCart,
  MIXED_CART_CHECKOUT_ERROR,
} from "@/lib/orders/cart-hourly";
import {
  attachPaymentIntentToOrder,
  createPendingOrderWithItems,
  deletePendingOrder,
  type CheckoutActor,
} from "@/lib/orders/create-pending-order";
import { ensureEnrollmentsForPaidOrder } from "@/lib/orders/fulfill-order";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/(auth)/actions";

export type CreateOrderResult =
  | {
      success: true;
      orderId: string;
      clientSecret: string | null;
      stripePublishableKey: string | null;
      paymentMode: "stripe" | "mock";
      checkoutKind: "hourly_only" | "standard";
      totalEuros: number;
    }
  | { success: false; error: string };

async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null
  );
}

export async function createOrder(
  data: OrderFormInput,
  items: CartItem[]
): Promise<CreateOrderResult> {
  if (items.length === 0) {
    return { success: false, error: "Le panier est vide" };
  }

  if (!isDatabaseConfigured()) {
    const classified = classifyCheckoutCart(items);
    if (classified === "mixed") {
      return { success: false, error: MIXED_CART_CHECKOUT_ERROR };
    }
    const checkoutKind =
      classified === "hourly_only" ? "hourly_only" : "standard";
    const totalEuros = items.reduce(
      (s, i) => s + (i.prixPromo ?? i.prix),
      0
    );
    return {
      success: true,
      orderId: `ORD-MOCK-${Date.now()}`,
      clientSecret: null,
      stripePublishableKey: null,
      paymentMode: "mock",
      checkoutKind,
      totalEuros,
    };
  }

  const session = await getSession();
  const actor: CheckoutActor =
    session && (session.role === "STUDENT" || session.role === "ADMIN")
      ? { kind: "authenticated", userId: session.id }
      : { kind: "guest" };

  const clientIp = await getClientIp();
  const pending = await createPendingOrderWithItems(
    data,
    items,
    clientIp,
    actor
  );
  if (!pending.success) {
    return { success: false, error: pending.error };
  }

  const { orderId, totalEuros, checkoutKind } = pending;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;

  if (!isStripeConfigured()) {
    return {
      success: true,
      orderId,
      clientSecret: null,
      stripePublishableKey: publishableKey,
      paymentMode: "mock",
      checkoutKind,
      totalEuros,
    };
  }

  if (!publishableKey) {
    await deletePendingOrder(orderId).catch(() => {});
    return {
      success: false,
      error:
        "Configuration incomplète : ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
    };
  }

  const stripe = getServerStripe();

  if (checkoutKind === "hourly_only") {
    if (!recurringCartStripePriceIdsConfigured()) {
      await deletePendingOrder(orderId).catch(() => {});
      return {
        success: false,
        error:
          "Configuration Stripe : créez trois prix récurrents mensuels (60 / 40 / 30 min) " +
          "puis renseignez STRIPE_PRICE_MONTHLY_60, STRIPE_PRICE_MONTHLY_40 et STRIPE_PRICE_MONTHLY_30 dans .env " +
          "(ou les anciennes clés STRIPE_PRICE_WEEKLY_*).",
      };
    }

    let createdSubscriptionId: string | null = null;
    try {
      const customerId = await ensureStripeCustomerForCheckout({
        stripe,
        actor,
        billing: {
          email: data.email,
          prenom: data.prenom,
          nom: data.nom,
        },
        orderId,
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { stripeCustomerId: customerId },
      });

      const orderWithItems = await prisma.order.findUniqueOrThrow({
        where: { id: orderId },
        include: { orderItems: true },
      });

      const subItems: Stripe.SubscriptionCreateParams.Item[] = [];
      for (const oi of orderWithItems.orderItems) {
        if (oi.hourlyMinutes == null) continue;
        const priceId = recurringCartStripePriceIdForMinutes(oi.hourlyMinutes);
        if (!priceId) {
          throw new Error("Prix Stripe récurrent introuvable pour cette durée");
        }
        subItems.push({
          price: priceId,
          quantity: Math.max(1, oi.hourlyQuantity ?? 1),
          metadata: {
            cartLineId: oi.cartLineId ?? "",
            formationId: oi.formationId,
            orderId,
          },
        });
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: subItems,
        metadata: { orderId },
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice"],
      });
      createdSubscriptionId = subscription.id;

      const { clientSecret, paymentIntentId } =
        await resolveIncompleteSubscriptionInvoicePayment(stripe, subscription);

      await prisma.order.update({
        where: { id: orderId },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePaymentIntentId: paymentIntentId,
        },
      });

      return {
        success: true,
        orderId,
        clientSecret,
        stripePublishableKey: publishableKey,
        paymentMode: "stripe",
        checkoutKind,
        totalEuros,
      };
    } catch (e) {
      console.error("[createOrder] Stripe abonnement", e);
      if (createdSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(createdSubscriptionId);
        } catch (ce) {
          console.error("[createOrder] Annulation abonnement orphelin", ce);
        }
      }
      await deletePendingOrder(orderId).catch(() => {});
      return {
        success: false,
        error:
          "Paiement indisponible pour le moment. Réessayez plus tard ou contactez le support.",
      };
    }
  }

  try {
    const amountCents = Math.max(50, Math.round(totalEuros * 100));
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe : client_secret manquant");
    }

    await attachPaymentIntentToOrder(orderId, paymentIntent.id);

    return {
      success: true,
      orderId,
      clientSecret: paymentIntent.client_secret,
      stripePublishableKey: publishableKey,
      paymentMode: "stripe",
      checkoutKind,
      totalEuros,
    };
  } catch (e) {
    console.error("[createOrder] Stripe", e);
    await deletePendingOrder(orderId).catch(() => {});
    return {
      success: false,
      error:
        "Paiement indisponible pour le moment. Réessayez plus tard ou contactez le support.",
    };
  }
}

export type FinalizeMockPaymentResult =
  | { success: true }
  | { success: false; error: string };

/** Sans Stripe : marque la commande comme payée (BDD uniquement). */
export async function finalizeMockPayment(
  orderId: string
): Promise<FinalizeMockPaymentResult> {
  if (orderId.startsWith("ORD-MOCK-")) {
    return { success: true };
  }

  if (isStripeConfigured()) {
    return {
      success: false,
      error: "Utilisez le paiement sécurisé par carte.",
    };
  }

  if (!isDatabaseConfigured()) {
    return { success: true };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) {
      return { success: false, error: "Commande introuvable." };
    }
    const allHourly =
      order.orderItems.length > 0 &&
      order.orderItems.every((i) => i.hourlyMinutes != null);

    await prisma.order.updateMany({
      where: { id: orderId, statut: "PENDING" },
      data: {
        statut: "PAID",
        ...(allHourly ? { stripeSubscriptionId: `mock_sub_${orderId}` } : {}),
      },
    });
    await ensureEnrollmentsForPaidOrder(orderId);
    return { success: true };
  } catch {
    return { success: false, error: "Mise à jour de la commande impossible." };
  }
}

export type CheckoutPrefill = {
  isLoggedIn: boolean;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  sexe: "FEMME" | "HOMME" | "";
};

export async function getCheckoutPrefill(): Promise<CheckoutPrefill> {
  const session = await getSession();
  if (!session) {
    return {
      isLoggedIn: false,
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      sexe: "",
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      isLoggedIn: true,
      prenom: session.prenom,
      nom: session.nom,
      email: session.email,
      telephone: "",
      sexe: "",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { prenom: true, nom: true, email: true, telephone: true, sexe: true },
  });

  const sexe =
    user?.sexe === "FEMME" || user?.sexe === "HOMME" ? user.sexe : "";

  return {
    isLoggedIn: true,
    prenom: user?.prenom ?? session.prenom,
    nom: user?.nom ?? session.nom,
    email: user?.email ?? session.email,
    telephone: user?.telephone ?? "",
    sexe,
  };
}
