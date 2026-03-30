"use server";

import { headers } from "next/headers";
import type { OrderFormInput } from "@/lib/validations/order.schema";
import type { CartItem } from "@/store/cart.store";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";
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
    return {
      success: true,
      orderId: `ORD-MOCK-${Date.now()}`,
      clientSecret: null,
      stripePublishableKey: null,
      paymentMode: "mock",
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

  const { orderId, totalEuros } = pending;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;

  if (!isStripeConfigured()) {
    return {
      success: true,
      orderId,
      clientSecret: null,
      stripePublishableKey: publishableKey,
      paymentMode: "mock",
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

  try {
    const stripe = getServerStripe();
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
    await prisma.order.updateMany({
      where: { id: orderId, statut: "PENDING" },
      data: { statut: "PAID" },
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
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      isLoggedIn: true,
      prenom: session.prenom,
      nom: session.nom,
      email: session.email,
      telephone: "",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { prenom: true, nom: true, email: true, telephone: true },
  });

  return {
    isLoggedIn: true,
    prenom: user?.prenom ?? session.prenom,
    nom: user?.nom ?? session.nom,
    email: user?.email ?? session.email,
    telephone: user?.telephone ?? "",
  };
}
