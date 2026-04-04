import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";
import type { OrderFormInput } from "@/lib/validations/order.schema";
import type { CartItem } from "@/store/cart.store";
import { REGLEMENT_VERSION } from "@/lib/content/reglement-interieur";
import { normalizeCartItemsForCheckout } from "@/lib/orders/normalize-cart-items";
import {
  HOURLY_BUNDLE_MINUTES,
  hourlyPriceForMinutes,
} from "@/lib/scheduling-mode";
import { orderFormToBillingSnapshot } from "@/lib/orders/billing-snapshot";
import {
  classifyCheckoutCart,
  MIXED_CART_CHECKOUT_ERROR,
} from "@/lib/orders/cart-hourly";

export type CheckoutOrderKind = "hourly_only" | "standard";

export type CreatePendingOrderResult =
  | { success: true; orderId: string; totalEuros: number; checkoutKind: CheckoutOrderKind }
  | { success: false; error: string };

export type CheckoutActor =
  | { kind: "guest" }
  | { kind: "authenticated"; userId: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function buildOrderItemCreateInputs(
  orderId: string,
  safeItems: CartItem[]
): Prisma.OrderItemCreateManyInput[] {
  const rows: Prisma.OrderItemCreateManyInput[] = [];
  for (const item of safeItems) {
    if (item.schedulingMode === "HOURLY_PURCHASE" && item.hourlyBundle) {
      for (const m of HOURLY_BUNDLE_MINUTES) {
        const q = Math.max(0, Math.floor(item.hourlyBundle[m] ?? 0));
        if (q <= 0) continue;
        const unit = hourlyPriceForMinutes(m);
        if (unit == null) continue;
        rows.push({
          orderId,
          formationId: item.formationId,
          creneauId: item.creneauId ?? null,
          hourlyMinutes: m,
          hourlyQuantity: q,
          cartLineId: `${item.lineId}__${m}`,
          prixUnitaire: new Prisma.Decimal(unit.toFixed(2)),
        });
      }
    } else {
      rows.push({
        orderId,
        formationId: item.formationId,
        creneauId: item.creneauId ?? null,
        hourlyMinutes: item.hourlyMinutes ?? null,
        hourlyQuantity: 1,
        cartLineId: item.lineId,
        prixUnitaire: new Prisma.Decimal(
          (item.prixPromo ?? item.prix).toFixed(2)
        ),
      });
    }
  }
  return rows;
}

export async function createPendingOrderWithItems(
  data: OrderFormInput,
  items: CartItem[],
  clientIp: string | null,
  actor: CheckoutActor
): Promise<CreatePendingOrderResult> {
  const normalized = await normalizeCartItemsForCheckout(items);
  if (!normalized.success) {
    return { success: false, error: normalized.error };
  }
  const { items: safeItems, totalEuros } = normalized;

  const classified = classifyCheckoutCart(safeItems);
  if (classified === "mixed") {
    return { success: false, error: MIXED_CART_CHECKOUT_ERROR };
  }
  const checkoutKind: CheckoutOrderKind =
    classified === "hourly_only" ? "hourly_only" : "standard";

  const email = normalizeEmail(data.email);
  const billingSnapshot = orderFormToBillingSnapshot(data);

  if (actor.kind === "guest") {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { passwordHash: true },
    });
    if (existing?.passwordHash) {
      return {
        success: false,
        error:
          "Un compte existe déjà avec cet e-mail. Connectez-vous pour finaliser votre achat.",
      };
    }
  }

  try {
    const orderId = await prisma.$transaction(async (tx) => {
      const userId =
        actor.kind === "authenticated" ? actor.userId : null;

      const order = await tx.order.create({
        data: {
          userId,
          billingSnapshot: billingSnapshot as unknown as Prisma.InputJsonValue,
          total: new Prisma.Decimal(totalEuros.toFixed(2)),
          statut: "PENDING",
          reglementSigneAt: new Date(),
          reglementIp: clientIp,
          reglementVersion: REGLEMENT_VERSION,
        },
      });

      await tx.orderItem.createMany({
        data: buildOrderItemCreateInputs(order.id, safeItems),
      });

      return order.id;
    });

    return { success: true, orderId, totalEuros, checkoutKind };
  } catch (e) {
    console.error("[createPendingOrderWithItems]", e);
    const msg = e instanceof Error ? e.message : "";
    const name = e instanceof Error ? e.name : "";
    if (
      name === "PrismaClientValidationError" &&
      msg.includes("Unknown argument") &&
      (msg.includes("creneauId") ||
        msg.includes("hourlyMinutes") ||
        msg.includes("hourlyQuantity"))
    ) {
      return {
        success: false,
        error:
          "Mise à jour requise : arrêtez le serveur de développement, exécutez « npx prisma generate », puis relancez « npm run dev ».",
      };
    }
    return {
      success: false,
      error: "Impossible d'enregistrer la commande. Réessayez plus tard.",
    };
  }
}

export async function attachPaymentIntentToOrder(
  orderId: string,
  paymentIntentId: string
): Promise<void> {
  await prisma.order.update({
    where: { id: orderId },
    data: { stripePaymentIntentId: paymentIntentId },
  });
}

export async function deletePendingOrder(orderId: string): Promise<void> {
  const row = await prisma.order.findFirst({
    where: { id: orderId, statut: "PENDING" },
    select: { stripeSubscriptionId: true },
  });
  if (
    isStripeConfigured() &&
    row?.stripeSubscriptionId &&
    !row.stripeSubscriptionId.startsWith("mock_sub_")
  ) {
    try {
      const stripe = getServerStripe();
      await stripe.subscriptions.cancel(row.stripeSubscriptionId);
    } catch (e) {
      console.error("[deletePendingOrder] Annulation abonnement Stripe", e);
    }
  }
  await prisma.order.deleteMany({
    where: { id: orderId, statut: "PENDING" },
  });
}
