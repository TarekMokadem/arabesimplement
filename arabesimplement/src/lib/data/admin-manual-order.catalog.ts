import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import type { FormationSchedulingMode } from "@prisma/client";

export type ManualOrderFormationOption = {
  id: string;
  titre: string;
  prix: number;
  prixPromo: number | null;
  schedulingMode: FormationSchedulingMode;
  creneaux: { id: string; nom: string }[];
};

export type ManualOrderUserOption = {
  id: string;
  label: string;
};

export async function getManualOrderCatalog(): Promise<{
  users: ManualOrderUserOption[];
  formations: ManualOrderFormationOption[];
}> {
  if (!isDatabaseConfigured()) {
    return { users: [], formations: [] };
  }

  const [users, formations] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
      select: { id: true, prenom: true, nom: true, email: true },
    }),
    prisma.formation.findMany({
      where: { statut: { not: "ARCHIVED" } },
      orderBy: { titre: "asc" },
      select: {
        id: true,
        titre: true,
        prix: true,
        prixPromo: true,
        schedulingMode: true,
        creneaux: {
          where: { statut: { not: "CLOSED" } },
          orderBy: { nom: "asc" },
          select: { id: true, nom: true },
        },
      },
    }),
  ]);

  return {
    users: users.map((u) => ({
      id: u.id,
      label: `${u.prenom} ${u.nom} — ${u.email}`,
    })),
    formations: formations.map((f) => ({
      id: f.id,
      titre: f.titre,
      prix: Number(f.prix),
      prixPromo: f.prixPromo != null ? Number(f.prixPromo) : null,
      schedulingMode: f.schedulingMode,
      creneaux: f.creneaux,
    })),
  };
}
