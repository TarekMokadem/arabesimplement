import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";
import {
  MANUAL_PAYPAL_ME_METHOD,
  stripePaymentMethodTypeFromExpandedPaymentIntent,
} from "@/lib/stripe/stripe-payment-method-type";
import { ensureEnrollmentsForPaidOrder } from "@/lib/orders/fulfill-order";

export type ConfirmManualPaymentResult =
  | { success: true }
  | { success: false; error: string };

function invoiceIsPaid(invoice: Stripe.Invoice | string | null): boolean {
  return (
    typeof invoice === "object" &&
    invoice !== null &&
    invoice.status === "paid"
  );
}

function subscriptionLooksPaid(sub: Stripe.Subscription): boolean {
  return (
    sub.status === "active" ||
    sub.status === "trialing" ||
    invoiceIsPaid(sub.latest_invoice)
  );
}

function canCancelPaymentIntent(status: Stripe.PaymentIntent.Status): boolean {
  return (
    status === "requires_payment_method" ||
    status === "requires_confirmation" ||
    status === "requires_action" ||
    status === "requires_capture"
  );
}

/**
 * L’admin confirme avoir reçu le règlement (souvent PayPal.me).
 * Stripe est consulté en best-effort : un échec API ne bloque pas le passage en payé.
 */
export async function confirmPendingOrderAsReceived(
  orderId: string
): Promise<ConfirmManualPaymentResult> {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) {
    return { success: false, error: "Commande introuvable." };
  }
  if (order.statut !== "PENDING") {
    return {
      success: false,
      error: "Seules les commandes en attente peuvent être validées ainsi.",
    };
  }

  const hasHourlyItems = order.orderItems.some((i) => i.hourlyMinutes != null);
  let paymentMethodType = order.stripePaymentMethodType;
  let stripeSubscriptionId = order.stripeSubscriptionId;
  let alreadyPaidOnStripe = false;

  if (isStripeConfigured()) {
    try {
      const stripe = getServerStripe();

      if (order.stripePaymentIntentId) {
        try {
          const pi = await stripe.paymentIntents.retrieve(
            order.stripePaymentIntentId,
            { expand: ["payment_method"] }
          );
          if (pi.status === "succeeded") {
            alreadyPaidOnStripe = true;
            paymentMethodType =
              stripePaymentMethodTypeFromExpandedPaymentIntent(pi) ??
              paymentMethodType;
          } else if (canCancelPaymentIntent(pi.status)) {
            await stripe.paymentIntents.cancel(pi.id);
          }
        } catch (e) {
          console.error("[confirmPendingOrderAsReceived] PaymentIntent", e);
        }
      }

      if (
        stripeSubscriptionId &&
        !stripeSubscriptionId.startsWith("mock_sub_")
      ) {
        try {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId, {
            expand: ["latest_invoice"],
          });
          if (subscriptionLooksPaid(sub)) {
            alreadyPaidOnStripe = true;
          } else {
            await stripe.subscriptions.cancel(stripeSubscriptionId);
            stripeSubscriptionId = hasHourlyItems
              ? `mock_sub_${orderId}`
              : null;
          }
        } catch (e) {
          console.error("[confirmPendingOrderAsReceived] Subscription", e);
          if (hasHourlyItems) {
            stripeSubscriptionId = `mock_sub_${orderId}`;
          }
        }
      }
    } catch (e) {
      console.error("[confirmPendingOrderAsReceived] Stripe", e);
    }
  }

  if (!alreadyPaidOnStripe) {
    paymentMethodType = paymentMethodType ?? MANUAL_PAYPAL_ME_METHOD;
    if (hasHourlyItems && !stripeSubscriptionId) {
      stripeSubscriptionId = `mock_sub_${orderId}`;
    }
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        statut: "PAID",
        stripePaymentMethodType: paymentMethodType,
        stripeSubscriptionId,
      },
    });
  } catch (e) {
    console.error("[confirmPendingOrderAsReceived] persist", e);
    return {
      success: false,
      error:
        "La commande n’a pas pu être marquée payée. Vérifiez les logs ou la base.",
    };
  }

  try {
    await ensureEnrollmentsForPaidOrder(orderId);
  } catch (e) {
    console.error("[confirmPendingOrderAsReceived] fulfill", e);
  }

  return { success: true };
}
