import type {
  Formation,
  Creneau,
  FormationBoutiqueCard,
  FormationCartInput,
} from "@/types/domain.types";
import type { Formation as PrismaFormation, Creneau as PrismaCreneau } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { MOCK_FORMATIONS, MOCK_FORMATIONS_BY_SLUG } from "@/lib/data/formations.mock";
import {
  isFormationPurchasable,
  shouldShowLimitedBadgeForFixedSlots,
} from "@/lib/availability";
import {
  getBoutiqueThemeFilterTabs,
  type BoutiqueThemeFilterTab,
} from "@/lib/content/formation-theme";
import { parseJourneeSlotsFromJson } from "@/lib/creneau-display";

export function toBoutiqueCard(
  f: Formation,
  creneaux: Creneau[],
  formationEnrollmentCount: number
): FormationBoutiqueCard {
  const boutiquePurchasable = isFormationPurchasable(
    f,
    creneaux,
    formationEnrollmentCount
  );
  return {
    id: f.id,
    titre: f.titre,
    slug: f.slug,
    descriptionCourte: f.descriptionCourte,
    prix: Number(f.prix),
    prixPromo: f.prixPromo !== undefined ? Number(f.prixPromo) : undefined,
    imageUrl: f.imageUrl,
    placesMax: f.placesMax,
    theme: f.theme,
    schedulingMode: f.schedulingMode,
    statut: f.statut,
    featured: f.featured,
    boutiquePurchasable,
    showLimitedBadge:
      boutiquePurchasable &&
      shouldShowLimitedBadgeForFixedSlots(f.schedulingMode, creneaux),
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
  /** Compte à rebours uniquement si une date limite est définie. */
  expiresAt: Date | null;
  schedulingMode?: import("@/types/domain.types").FormationSchedulingMode;
};

function mapCreneau(
  c: PrismaCreneau & { _count?: { enrollments: number } }
): Creneau {
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
    _count: c._count ? { enrollments: c._count.enrollments } : undefined,
  };
}

function toFormationListItem(
  f: PrismaFormation & { _count?: { enrollments: number } }
): Formation {
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
    theme: f.theme,
    schedulingMode: f.schedulingMode,
    statut: f.statut,
    featured: f.featured,
    featuredContent: f.featuredContent ?? undefined,
    featuredTitre: f.featuredTitre ?? undefined,
    featuredBadge: f.featuredBadge ?? undefined,
    featuredExpiresAt: f.featuredExpiresAt ?? undefined,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
    _count: f._count ? { enrollments: f._count.enrollments } : undefined,
  };
}

function toFormationDetail(
  f: PrismaFormation & { _count?: { enrollments: number } },
  creneaux: (PrismaCreneau & { _count?: { enrollments: number } })[]
): Formation & { creneaux: Creneau[] } {
  return {
    ...toFormationListItem(f),
    description: f.description ?? undefined,
    creneaux: creneaux.map(mapCreneau),
  };
}

export async function getFormationsForBoutique(): Promise<FormationBoutiqueCard[]> {
  if (!isDatabaseConfigured()) {
    return MOCK_FORMATIONS.map((f) => {
      const detail = MOCK_FORMATIONS_BY_SLUG[f.slug];
      const creneaux = detail?.creneaux ?? [];
      return toBoutiqueCard(f, creneaux, 0);
    });
  }
  try {
    const rows = await prisma.formation.findMany({
      where: { statut: { in: ["ACTIVE", "COMING_SOON"] } },
      orderBy: { createdAt: "asc" },
      include: {
        creneaux: {
          orderBy: { createdAt: "asc" },
          include: { _count: { select: { enrollments: true } } },
        },
        _count: { select: { enrollments: true } },
      },
    });
    return rows.map((row) => {
      const f = toFormationListItem(row);
      const creneaux = row.creneaux.map(mapCreneau);
      return toBoutiqueCard(f, creneaux, row._count.enrollments);
    });
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
      include: {
        creneaux: {
          orderBy: { createdAt: "asc" },
          include: { _count: { select: { enrollments: true } } },
        },
        _count: { select: { enrollments: true } },
      },
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

export function getBoutiqueThemeFilters(
  formations: Pick<Formation, "theme">[]
): BoutiqueThemeFilterTab[] {
  return getBoutiqueThemeFilterTabs(formations.map((f) => f.theme));
}

function formationListItemToFeaturedHome(f: Formation): FeaturedSessionHome {
  const expiresAt = f.featuredExpiresAt ?? null;
  return {
    titre: f.featuredTitre ?? f.titre,
    description: f.featuredContent ?? f.descriptionCourte,
    badge: f.featuredBadge ?? "Offre",
    prix: Number(f.prix),
    prixPromo:
      f.prixPromo != null ? Number(f.prixPromo) : Number(f.prix),
    slug: f.slug,
    expiresAt,
    schedulingMode: f.schedulingMode,
  };
}

/** Aucune section « mise en avant » si aucune formation eligible (featured + ACTIVE). */
export async function getFeaturedSessionHome(): Promise<FeaturedSessionHome | null> {
  if (!isDatabaseConfigured()) {
    const featured = MOCK_FORMATIONS.find(
      (x) => x.featured && x.statut === "ACTIVE"
    );
    return featured ? formationListItemToFeaturedHome(featured) : null;
  }

  try {
    const row = await prisma.formation.findFirst({
      where: { featured: true, statut: "ACTIVE" },
    });
    if (!row) return null;

    const expiresAt = row.featuredExpiresAt ?? null;
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
    return null;
  }
}
