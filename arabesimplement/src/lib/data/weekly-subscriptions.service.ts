import { prisma } from "@/lib/prisma";

/** Abonnements cours à la carte (lignes Stripe) pour l’espace élève. */
export async function getWeeklySubscriptionsForLearner(userId: string) {
  return prisma.courseWeeklySubscription.findMany({
    where: { userId },
    include: {
      formation: { select: { id: true, titre: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
