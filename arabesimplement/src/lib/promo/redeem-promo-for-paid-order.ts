import { prisma } from "@/lib/prisma";

/**
 * Incrémente le compteur d’un code promo une seule fois, au passage en payé.
 */
export async function redeemPromoForPaidOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { promoCodeId: true, promoRedeemedAt: true },
  });
  if (!order?.promoCodeId || order.promoRedeemedAt) return;

  const claimed = await prisma.order.updateMany({
    where: { id: orderId, promoRedeemedAt: null, promoCodeId: { not: null } },
    data: { promoRedeemedAt: new Date() },
  });
  if (claimed.count !== 1) return;

  await prisma.promoCode.update({
    where: { id: order.promoCodeId },
    data: { redemptionCount: { increment: 1 } },
  });
}
