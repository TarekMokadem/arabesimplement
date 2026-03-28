import { prisma } from "@/lib/prisma";

const ENROLLMENT_DAYS_AFTER_PAYMENT = 30;

/**
 * Crée les inscriptions (Enrollment) pour chaque ligne de commande payée,
 * une seule inscription par couple (utilisateur, formation) si elle n'existe pas encore.
 */
export async function ensureEnrollmentsForPaidOrder(
  orderId: string
): Promise<void> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, statut: "PAID" },
    include: { orderItems: true },
  });
  if (!order) return;

  const tokenExpiresAt = new Date();
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + ENROLLMENT_DAYS_AFTER_PAYMENT);

  for (const item of order.orderItems) {
    const exists = await prisma.enrollment.findFirst({
      where: {
        userId: order.userId,
        formationId: item.formationId,
      },
    });
    if (exists) continue;

    await prisma.enrollment.create({
      data: {
        userId: order.userId,
        formationId: item.formationId,
        tokenExpiresAt,
      },
    });
  }
}
