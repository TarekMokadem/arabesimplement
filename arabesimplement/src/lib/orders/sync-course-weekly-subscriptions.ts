import type Stripe from "stripe";
import type { WeeklySubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerStripe } from "@/lib/stripe/server";

function maxDate(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

/** Accès aux contenus : fin de période facturée + courte marge. */
const PERIOD_GRACE_MS = 7 * 24 * 60 * 60 * 1000;

export function accessUntilFromInvoicePeriodEnd(periodEndUnix: number): Date {
  return new Date(periodEndUnix * 1000 + PERIOD_GRACE_MS);
}

export function mapStripeSubscriptionToWeeklyStatus(
  sub: Pick<Stripe.Subscription, "status" | "pause_collection">
): WeeklySubscriptionStatus {
  if (sub.pause_collection != null) return "PAUSED";
  if (sub.status === "past_due") return "PAST_DUE";
  if (
    sub.status === "canceled" ||
    sub.status === "unpaid" ||
    sub.status === "incomplete_expired"
  ) {
    return "CANCELED";
  }
  return "ACTIVE";
}

/**
 * Crée ou met à jour les lignes `CourseWeeklySubscription` après premier paiement (Stripe ou mock).
 */
export async function ensureCourseWeeklySubscriptionsForPaidOrder(
  orderId: string
): Promise<void> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, statut: "PAID" },
    include: { orderItems: true },
  });
  if (!order?.userId) return;

  const subId = order.stripeSubscriptionId;
  if (!subId) return;

  if (subId.startsWith("mock_sub_")) {
    await upsertMockWeeklyRows(order);
    return;
  }

  const stripe = getServerStripe();
  const sub = await stripe.subscriptions.retrieve(subId, {
    expand: ["items.data"],
  });

  const status = mapStripeSubscriptionToWeeklyStatus(sub);
  const periodEndSec = sub.items.data[0]?.current_period_end;
  const periodEnd =
    typeof periodEndSec === "number"
      ? new Date(periodEndSec * 1000)
      : null;

  for (const si of sub.items.data) {
    const cartLineId = si.metadata?.cartLineId;
    if (!cartLineId) continue;
    const oi = order.orderItems.find((x) => x.cartLineId === cartLineId);
    if (!oi || oi.hourlyMinutes == null) continue;

    const bundleQty = Math.max(
      1,
      si.quantity ?? oi.hourlyQuantity ?? 1
    );

    await prisma.courseWeeklySubscription.upsert({
      where: { stripeSubscriptionItemId: si.id },
      create: {
        userId: order.userId,
        orderId: order.id,
        formationId: oi.formationId,
        creneauId: oi.creneauId,
        hourlyMinutes: oi.hourlyMinutes,
        bundleQuantity: bundleQty,
        stripeSubscriptionId: sub.id,
        stripeSubscriptionItemId: si.id,
        status,
        currentPeriodEnd: periodEnd,
      },
      update: {
        status,
        currentPeriodEnd: periodEnd,
        bundleQuantity: bundleQty,
      },
    });
  }
}

type OrderWithItems = {
  id: string;
  userId: string | null;
  stripeSubscriptionId: string | null;
  orderItems: Array<{
    id: string;
    formationId: string;
    creneauId: string | null;
    hourlyMinutes: number | null;
    hourlyQuantity: number;
  }>;
};

async function upsertMockWeeklyRows(order: OrderWithItems): Promise<void> {
  if (!order.userId || !order.stripeSubscriptionId) return;

  for (const oi of order.orderItems) {
    if (oi.hourlyMinutes == null) continue;
    const itemId = `mock_item_${oi.id}`;
    await prisma.courseWeeklySubscription.upsert({
      where: { stripeSubscriptionItemId: itemId },
      create: {
        userId: order.userId,
        orderId: order.id,
        formationId: oi.formationId,
        creneauId: oi.creneauId,
        hourlyMinutes: oi.hourlyMinutes,
        bundleQuantity: Math.max(1, oi.hourlyQuantity ?? 1),
        stripeSubscriptionId: order.stripeSubscriptionId,
        stripeSubscriptionItemId: itemId,
        status: "ACTIVE",
        currentPeriodEnd: null,
      },
      update: {
        status: "ACTIVE",
        bundleQuantity: Math.max(1, oi.hourlyQuantity ?? 1),
      },
    });
  }
}

/**
 * Renouvellement hebdomadaire : met à jour les lignes d’abonnement et prolonge l’accès (enrollment).
 */
export async function syncWeeklyRowsFromStripeSubscription(
  sub: Stripe.Subscription
): Promise<void> {
  const status = mapStripeSubscriptionToWeeklyStatus(sub);
  const periodEndSec = sub.items.data[0]?.current_period_end;
  const periodEnd =
    typeof periodEndSec === "number"
      ? new Date(periodEndSec * 1000)
      : null;
  await prisma.courseWeeklySubscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: {
      status,
      ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
    },
  });
}

export async function extendWeeklyAccessAfterRenewal(
  stripeSubscriptionId: string,
  invoicePeriodEndUnix: number
): Promise<void> {
  const periodEnd = new Date(invoicePeriodEndUnix * 1000);
  const accessUntil = accessUntilFromInvoicePeriodEnd(invoicePeriodEndUnix);

  await prisma.courseWeeklySubscription.updateMany({
    where: {
      stripeSubscriptionId,
      status: { in: ["ACTIVE", "PAST_DUE"] },
    },
    data: { currentPeriodEnd: periodEnd },
  });

  const rows = await prisma.courseWeeklySubscription.findMany({
    where: { stripeSubscriptionId },
  });

  for (const s of rows) {
    const enr = await prisma.enrollment.findFirst({
      where: {
        userId: s.userId,
        formationId: s.formationId,
        creneauId: s.creneauId,
      },
    });
    if (!enr) continue;
    await prisma.enrollment.update({
      where: { id: enr.id },
      data: {
        tokenExpiresAt: maxDate(enr.tokenExpiresAt, accessUntil),
      },
    });
  }
}
