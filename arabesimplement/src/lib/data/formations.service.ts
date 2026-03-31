import type {
  Formation,
  Creneau,
  FormationBoutiqueCard,
  FormationCartInput,
} from "@/types/domain.types";
import type { Formation as PrismaFormation, Creneau as PrismaCreneau } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import {
  MOCK_FORMATIONS,
  MOCK_FORMATIONS_BY_SLUG,
  getBoutiqueCategoriesFromFormations,
} from "@/lib/data/formations.mock";
import { parseJourneeSlotsFromJson } from "@/lib/creneau-display";

export function toBoutiqueCard(f: Formation): FormationBoutiqueCard {
  return {
    id: f.id,
    titre: f.titre,
    slug: f.slug,
    descriptionCourte: f.descriptionCourte,
    prix: Number(f.prix),
    prixPromo: f.prixPromo !== undefined ? Number(f.prixPromo) : undefined,
    imageUrl: f.imageUrl,
    placesMax: f.placesMax,
    categorie: f.categorie,
    schedulingMode: f.schedulingMode,
    statut: f.statut,
    featured: f.featured,
  };
}

export function toFormationCartInput(
  f: Formation | (Formation & { creneaux: Creneau[] })
): FormationCartInput {
  return {
    id: f.id,
    titre: f.titre,
    slug: f.slug,
    prix: Number(f.prix),
    prixPromo: f.prixPromo !== undefined ? Number(f.prixPromo) : undefined,
    imageUrl: f.imageUrl,
    schedulingMode: f.schedulingMode,
  };
}

export type FeaturedSessionHome = {
  titre: string;
  description: string;
  badge: string;
  prix: number;
  prixPromo: number;
  slug: string;
  expiresAt: Date;
  schedulingMode?: import("@/types/domain.types").FormationSchedulingMode;
};

function mapCreneau(c: PrismaCreneau): Creneau {
  const journeeSlots = parseJourneeSlotsFromJson(c.journeeSlots);
  return {
    id: c.id,
    formationId: c.formationId,
    nom: c.nom,
    jours: c.jours,
    journeeSlots,
    heureDebut: c.heureDebut,
    dureeMinutes: c.dureeMinutes,
    placesMax: c.placesMax,
    whatsappLink: c.whatsappLink ?? undefined,
    statut: c.statut,
    createdAt: c.createdAt,
  };
}

function toFormationListItem(f: PrismaFormation): Formation {
  return {
    id: f.id,
    titre: f.titre,
    slug: f.slug,
    descriptionCourte: f.descriptionCourte,
    description: undefined,
    prix: Number(f.prix),
    prixPromo: f.prixPromo ? Number(f.prixPromo) : undefined,
    imageUrl: f.imageUrl ?? undefined,
    placesMax: f.placesMax ?? undefined,
    categorie: f.categorie,
    schedulingMode: f.schedulingMode,
    statut: f.statut,
    featured: f.featured,
    featuredContent: f.featuredContent ?? undefined,
    featuredTitre: f.featuredTitre ?? undefined,
    featuredBadge: f.featuredBadge ?? undefined,
    featuredExpiresAt: f.featuredExpiresAt ?? undefined,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

function toFormationDetail(
  f: PrismaFormation,
  creneaux: PrismaCreneau[]
): Formation & { creneaux: Creneau[] } {
  return {
    ...toFormationListItem(f),
    description: f.description ?? undefined,
    creneaux: creneaux.map(mapCreneau),
  };
}

export async function getFormationsForBoutique(): Promise<Formation[]> {
  if (!isDatabaseConfigured()) {
    return MOCK_FORMATIONS;
  }
  try {
    const rows = await prisma.formation.findMany({
      where: { statut: { in: ["ACTIVE", "COMING_SOON"] } },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(toFormationListItem);
  } catch (e) {
    console.error("[getFormationsForBoutique]", e);
    return [];
  }
}

export async function getFormationBySlug(
  slug: string
): Promise<(Formation & { creneaux: Creneau[] }) | null> {
  if (!isDatabaseConfigured()) {
    return MOCK_FORMATIONS_BY_SLUG[slug] ?? null;
  }
  try {
    const row = await prisma.formation.findFirst({
      where: { slug, statut: { in: ["ACTIVE", "COMING_SOON"] } },
      include: { creneaux: { orderBy: { createdAt: "asc" } } },
    });
    if (!row) return null;
    return toFormationDetail(row, row.creneaux);
  } catch (e) {
    console.error("[getFormationBySlug]", e);
    return null;
  }
}

export async function getFormationSlugsForStaticParams(): Promise<string[]> {
  if (!isDatabaseConfigured()) {
    return Object.keys(MOCK_FORMATIONS_BY_SLUG);
  }
  try {
    const rows = await prisma.formation.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (e) {
    console.error("[getFormationSlugsForStaticParams]", e);
    return [];
  }
}

export function getBoutiqueCategoryFilters(formations: Formation[]): string[] {
  return getBoutiqueCategoriesFromFormations(formations);
}

export async function getFeaturedSessionHome(): Promise<FeaturedSessionHome> {
  const fallbackExpires = new Date();
  fallbackExpires.setDate(fallbackExpires.getDate() + 7);

  const tajwid = MOCK_FORMATIONS_BY_SLUG["formation-tajwid"];
  const fallback: FeaturedSessionHome = {
    titre: tajwid?.featuredTitre ?? "Formation Tajwid — Offre spéciale",
    description:
      tajwid?.featuredContent ??
      "Formation Tajwid structurée : règles de récitation, supports et accompagnement. Détails et inscription sur la fiche formation.",
    badge: tajwid?.featuredBadge ?? "Offre limitée",
    prix: tajwid ? Number(tajwid.prix) : 0,
    prixPromo: tajwid?.prixPromo != null ? Number(tajwid.prixPromo) : 0,
    slug: tajwid?.slug ?? "formation-tajwid",
    expiresAt: fallbackExpires,
    schedulingMode: tajwid?.schedulingMode ?? "HOURLY_PURCHASE",
  };

  if (!isDatabaseConfigured()) {
    return { ...fallback, expiresAt: fallbackExpires };
  }

  try {
    const row = await prisma.formation.findFirst({
      where: { featured: true, statut: "ACTIVE" },
    });
    if (!row) {
      return { ...fallback, expiresAt: fallbackExpires };
    }

    const expiresAt = row.featuredExpiresAt ?? fallbackExpires;
    return {
      titre: row.featuredTitre ?? row.titre,
      description: row.featuredContent ?? row.descriptionCourte,
      badge: row.featuredBadge ?? "Offre",
      prix: Number(row.prix),
      prixPromo: row.prixPromo ? Number(row.prixPromo) : Number(row.prix),
      slug: row.slug,
      expiresAt,
      schedulingMode: row.schedulingMode,
    };
  } catch (e) {
    console.error("[getFeaturedSessionHome]", e);
    return { ...fallback, expiresAt: fallbackExpires };
  }
}
