import { prisma } from "@/lib/prisma";
import { attachUserToPaidGuestOrder } from "@/lib/orders/provision-guest-after-payment";

const ENROLLMENT_DAYS_AFTER_PAYMENT = 30;

/**
 * Crée les inscriptions (Enrollment) pour chaque ligne de commande payée,
 * une seule inscription par couple (utilisateur, formation) si elle n'existe pas encore.
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

  const tokenExpiresAt = new Date();
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + ENROLLMENT_DAYS_AFTER_PAYMENT);

  for (const item of order.orderItems) {
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
