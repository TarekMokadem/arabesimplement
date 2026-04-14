import { prisma } from "@/lib/prisma";

/** Commandes enregistrées (payées ou remboursées) pour l’historique élève. */
export async function getLearnerPurchaseOrders(userId: string) {
  return prisma.order.findMany({
    where: {
      userId,
      statut: { in: ["PAID", "REFUNDED"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          formation: { select: { titre: true, slug: true } },
          creneau: { select: { nom: true } },
        },
      },
    },
  });
}

/** Abonnements cours à la carte résiliés (retirés du tableau de bord « en cours »). */
export async function getLearnerCanceledWeeklySubscriptions(userId: string) {
  return prisma.courseWeeklySubscription.findMany({
    where: { userId, status: "CANCELED" },
    orderBy: { updatedAt: "desc" },
    include: {
      formation: { select: { id: true, titre: true, slug: true } },
    },
  });
}

export function groupWeeklyRowsByFormationId<
  T extends { formationId: string },
>(rows: T[]): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const r of rows) {
    const list = m.get(r.formationId) ?? [];
    list.push(r);
    m.set(r.formationId, list);
  }
  return m;
}
