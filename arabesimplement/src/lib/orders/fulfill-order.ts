import { prisma } from "@/lib/prisma";
import { attachUserToPaidGuestOrder } from "@/lib/orders/provision-guest-after-payment";
import { ensureCourseWeeklySubscriptionsForPaidOrder } from "@/lib/orders/sync-course-weekly-subscriptions";

const ENROLLMENT_DAYS_AFTER_PAYMENT = 30;

function initialEnrollmentExpiry(): Date {
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + ENROLLMENT_DAYS_AFTER_PAYMENT);
  return tokenExpiresAt;
}

/**
 * Crée ou met à jour les inscriptions pour chaque ligne de commande payée
 * (idempotent : évite les doublons si le webhook Stripe est reçu deux fois).
 */
export async function ensureEnrollmentsForPaidOrder(
  orderId: string
): Promise<void> {
  let order = await prisma.order.findFirst({
    where: { id: orderId, statut: "PAID" },
    include: { orderItems: true },
  });
  if (!order) return;

  if (!order.userId) {
    await attachUserToPaidGuestOrder(orderId);
    order = await prisma.order.findFirst({
      where: { id: orderId, statut: "PAID" },
      include: { orderItems: true },
    });
  }

  if (!order?.userId) {
    console.error(
      "[ensureEnrollmentsForPaidOrder] userId manquant après provision",
      orderId
    );
    return;
  }

  const tokenExpiresAt = initialEnrollmentExpiry();

  for (const item of order.orderItems) {
    const existing = await prisma.enrollment.findFirst({
      where: {
        userId: order.userId,
        formationId: item.formationId,
        creneauId: item.creneauId,
      },
    });

    if (existing) {
      await prisma.enrollment.update({
        where: { id: existing.id },
        data: {
          tokenExpiresAt:
            existing.tokenExpiresAt > tokenExpiresAt
              ? existing.tokenExpiresAt
              : tokenExpiresAt,
        },
      });
    } else {
      await prisma.enrollment.create({
        data: {
          userId: order.userId,
          formationId: item.formationId,
          creneauId: item.creneauId,
          tokenExpiresAt,
        },
      });
    }
  }

  await ensureCourseWeeklySubscriptionsForPaidOrder(orderId);
}
