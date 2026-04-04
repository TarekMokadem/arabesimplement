import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { ensureEnrollmentsForPaidOrder } from "@/lib/orders/fulfill-order";
import {
  extendWeeklyAccessAfterRenewal,
  syncWeeklyRowsFromStripeSubscription,
} from "@/lib/orders/sync-course-weekly-subscriptions";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const p = invoice.parent;
  if (
    p?.type === "subscription_details" &&
    p.subscription_details?.subscription
  ) {
    const s = p.subscription_details.subscription;
    return typeof s === "string" ? s : s.id;
  }
  return null;
}

async function cancelStripeSubscriptionIfAny(
  stripeSubscriptionId: string | null | undefined
): Promise<void> {
  if (
    !isStripeConfigured() ||
    !stripeSubscriptionId ||
    stripeSubscriptionId.startsWith("mock_sub_")
  ) {
    return;
  }
  try {
    const stripe = getServerStripe();
    await stripe.subscriptions.cancel(stripeSubscriptionId);
  } catch (e) {
    console.error("[webhook stripe] Annulation abonnement", e);
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return NextResponse.json({ error: "Configuration webhook manquante" }, {
      status: 400,
    });
  }

  let event: Stripe.Event;
  try {
    const stripe = getServerStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[webhook stripe] Signature", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    if (pi.status !== "succeeded") {
      return NextResponse.json({ received: true });
    }
    const orderId = pi.metadata?.orderId;
    const pending = await prisma.order.findMany({
      where: {
        statut: "PENDING",
        stripePaymentIntentId: pi.id,
        ...(orderId ? { id: orderId } : {}),
      },
      select: { id: true },
    });
    if (pending.length > 0) {
      await prisma.order.updateMany({
        where: { id: { in: pending.map((o) => o.id) } },
        data: { statut: "PAID" },
      });
      for (const o of pending) {
        await ensureEnrollmentsForPaidOrder(o.id);
      }
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const subId = getSubscriptionIdFromInvoice(invoice);
    if (!subId || subId.startsWith("mock_sub_")) {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findFirst({
      where: { stripeSubscriptionId: subId },
      select: { id: true, statut: true },
    });

    if (invoice.billing_reason === "subscription_create") {
      if (order?.statut === "PENDING") {
        await prisma.order.update({
          where: { id: order.id },
          data: { statut: "PAID" },
        });
        await ensureEnrollmentsForPaidOrder(order.id);
      }
    } else if (invoice.billing_reason === "subscription_cycle") {
      const end = invoice.period_end;
      if (typeof end === "number") {
        await extendWeeklyAccessAfterRenewal(subId, end);
      }
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    if (!sub.id.startsWith("mock_sub_")) {
      await syncWeeklyRowsFromStripeSubscription(sub);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await prisma.courseWeeklySubscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { status: "CANCELED" },
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const orderId = pi.metadata?.orderId;
    const candidates = await prisma.order.findMany({
      where: {
        stripePaymentIntentId: pi.id,
        statut: "PENDING",
        ...(orderId ? { id: orderId } : {}),
      },
      select: { id: true, userId: true, stripeSubscriptionId: true },
    });
    for (const o of candidates) {
      await cancelStripeSubscriptionIfAny(o.stripeSubscriptionId);
      if (o.userId == null) {
        await prisma.order.delete({ where: { id: o.id } });
      } else {
        await prisma.order.update({
          where: { id: o.id },
          data: { statut: "FAILED" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
