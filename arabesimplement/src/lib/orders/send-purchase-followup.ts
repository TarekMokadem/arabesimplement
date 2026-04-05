import { prisma } from "@/lib/prisma";
import { sendPostPurchaseGuideEmail } from "@/lib/email/send-post-purchase-guide";

/**
 * Envoie le guide « prochaines étapes » si aucun e-mail de suivi n’a encore été associé à la commande
 * (l’e-mail identifiants invité marque la même date dès qu’il est envoyé avec succès).
 */
export async function sendPurchaseFollowupIfNeeded(
  orderId: string
): Promise<void> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, statut: "PAID" },
    select: {
      purchaseFollowupEmailSentAt: true,
      userId: true,
    },
  });
  if (!order?.userId || order.purchaseFollowupEmailSentAt) return;

  const full = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { email: true, prenom: true } },
      orderItems: {
        include: { formation: { select: { titre: true, slug: true } } },
      },
    },
  });
  if (!full?.user?.email) return;

  const formationsMap = new Map<string, { titre: string; slug: string }>();
  for (const item of full.orderItems) {
    formationsMap.set(item.formationId, {
      titre: item.formation.titre,
      slug: item.formation.slug,
    });
  }
  const formations = [...formationsMap.values()];

  const ok = await sendPostPurchaseGuideEmail({
    to: full.user.email,
    prenom: full.user.prenom,
    formations,
  });

  if (ok) {
    await prisma.order.update({
      where: { id: orderId },
      data: { purchaseFollowupEmailSentAt: new Date() },
    });
  }
}
