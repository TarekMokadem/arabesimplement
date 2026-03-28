import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";

export type LearnerEnrollmentRow = {
  id: string;
  formation: { titre: string; slug: string };
  creneau: {
    nom: string;
    jours: string[];
    heureDebut: string;
  } | null;
  tokenUsed: boolean;
  tokenExpiresAt: Date;
};

export async function getEnrollmentsForLearner(
  userId: string
): Promise<LearnerEnrollmentRow[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    const rows = await prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        formation: { select: { titre: true, slug: true } },
        creneau: {
          select: { nom: true, jours: true, heureDebut: true },
        },
      },
    });
    return rows.map((e) => ({
      id: e.id,
      formation: e.formation,
      creneau: e.creneau,
      tokenUsed: e.tokenUsed,
      tokenExpiresAt: e.tokenExpiresAt,
    }));
  } catch (e) {
    console.error("[getEnrollmentsForLearner]", e);
    return [];
  }
}
