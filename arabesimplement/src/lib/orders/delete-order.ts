import type { CreneauStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";

export type DeleteOrderResult =
  | { success: true }
  | { success: false; error: string };

async function syncCreneauPlaces(creneauId: string): Promise<void> {
  const c = await prisma.creneau.findUnique({
    where: { id: creneauId },
    select: {
      placesMax: true,
      statut: true,
      _count: { select: { enrollments: true } },
    },
  });
  if (!c || c.statut === "CLOSED") return;
  const full = c._count.enrollments >= c.placesMax;
  const next: CreneauStatus = full ? "FULL" : "OPEN";
  if (c.statut !== next) {
    await prisma.creneau.update({
      where: { id: creneauId },
      data: { statut: next },
    });
  }
}

async function cancelStripeSideEffects(order: {
  stripePaymentIntentId: string | null;
  stripeSubscriptionId: string | null;
  weeklyStripeIds: string[];
}): Promise<void> {
  if (!isStripeConfigured()) return;
  const stripe = getServerStripe();
  const subIds = [
    ...new Set(
      [order.stripeSubscriptionId, ...order.weeklyStripeIds].filter(
        (id): id is string => !!id && !id.startsWith("mock_sub_")
      )
    ),
  ];
  for (const sid of subIds) {
    try {
      await stripe.subscriptions.cancel(sid);
    } catch (e) {
      console.error("[deleteOrderFromHistory] Stripe cancel sub", sid, e);
    }
  }
  if (!order.stripePaymentIntentId) return;
  try {
    const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    if (
      pi.status === "requires_payment_method" ||
      pi.status === "requires_confirmation" ||
      pi.status === "requires_action" ||
      pi.status === "requires_capture"
    ) {
      await stripe.paymentIntents.cancel(pi.id);
    }
  } catch (e) {
    console.error(
      "[deleteOrderFromHistory] Stripe cancel PI",
      order.stripePaymentIntentId,
      e
    );
  }
}

/**
 * Retire une commande de l’historique admin : lignes, abonnements liés,
 * inscriptions non couvertes par une autre commande payée.
 * N’effectue pas de remboursement Stripe automatique.
 */
export async function deleteOrderFromHistory(
  orderId: string
): Promise<DeleteOrderResult> {
  const id = orderId.trim();
  if (!id) {
    return { success: false, error: "Commande introuvable." };
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        select: { formationId: true, creneauId: true },
      },
      courseWeeklySubscriptions: {
        select: { stripeSubscriptionId: true },
      },
    },
  });
  if (!order) {
    return { success: false, error: "Commande introuvable." };
  }

  await cancelStripeSideEffects({
    stripePaymentIntentId: order.stripePaymentIntentId,
    stripeSubscriptionId: order.stripeSubscriptionId,
    weeklyStripeIds: order.courseWeeklySubscriptions.map(
      (s) => s.stripeSubscriptionId
    ),
  });

  const creneauIds = [
    ...new Set(
      order.orderItems
        .map((i) => i.creneauId)
        .filter((cid): cid is string => !!cid)
    ),
  ];

  try {
    await prisma.$transaction(async (tx) => {
      await tx.courseWeeklySubscription.deleteMany({
        where: {
          OR: [
            { orderId: id },
            ...(order.stripeSubscriptionId
              ? [{ stripeSubscriptionId: order.stripeSubscriptionId }]
              : []),
            ...order.courseWeeklySubscriptions.map((s) => ({
              stripeSubscriptionId: s.stripeSubscriptionId,
            })),
          ],
        },
      });

      if (order.userId && order.statut === "PAID") {
        for (const item of order.orderItems) {
          const coveredElsewhere = await tx.order.findFirst({
            where: {
              id: { not: id },
              userId: order.userId,
              statut: "PAID",
              orderItems: {
                some: {
                  formationId: item.formationId,
                  creneauId: item.creneauId,
                },
              },
            },
            select: { id: true },
          });
          if (coveredElsewhere) continue;
          await tx.enrollment.deleteMany({
            where: {
              userId: order.userId,
              formationId: item.formationId,
              creneauId: item.creneauId,
            },
          });
        }
      }

      if (order.promoRedeemedAt && order.promoCodeId) {
        await tx.promoCode.updateMany({
          where: { id: order.promoCodeId, redemptionCount: { gt: 0 } },
          data: { redemptionCount: { decrement: 1 } },
        });
      }

      await tx.order.delete({ where: { id } });
    });
  } catch (e) {
    console.error("[deleteOrderFromHistory]", e);
    return { success: false, error: "Suppression impossible." };
  }

  for (const cid of creneauIds) {
    await syncCreneauPlaces(cid).catch((e) => {
      console.error("[deleteOrderFromHistory] sync créneau", cid, e);
    });
  }

  return { success: true };
}
