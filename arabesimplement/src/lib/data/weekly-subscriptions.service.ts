import { prisma } from "@/lib/prisma";

export type GetWeeklySubscriptionsOptions = {
  /** Exclut les abonnements résiliés (affichage « en cours » uniquement). */
  excludeCanceled?: boolean;
};

/** Abonnements cours à la carte (lignes Stripe) pour l’espace élève. */
export async function getWeeklySubscriptionsForLearner(
  userId: string,
  options: GetWeeklySubscriptionsOptions = {}
) {
  const { excludeCanceled = false } = options;
  return prisma.courseWeeklySubscription.findMany({
    where: {
      userId,
      ...(excludeCanceled ? { status: { not: "CANCELED" } } : {}),
    },
    include: {
      formation: { select: { id: true, titre: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
