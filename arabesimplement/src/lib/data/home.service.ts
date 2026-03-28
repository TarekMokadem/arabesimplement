import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { getApprovedTestimonials } from "@/lib/data/testimonials.service";

export type HomeHeroTrust = {
  studentCountLabel: string;
  /** Moyenne des témoignages approuvés ; `null` si aucun avis en base. */
  ratingAverage: number | null;
  primaryCtaHref: string;
  /** Initiales pour les pastilles (max 4) ; complétées si besoin. */
  avatarInitials: string[];
};

const FALLBACK_STUDENTS = 500;
const FALLBACK_RATING = 4.9;
const HERO_FORMATION_SLUG = "lire-en-10-lecons";

function initialsFromName(nom: string): string {
  const parts = nom.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

function padAvatars(initials: string[]): string[] {
  const out = [...initials];
  const filler = ["1", "2", "3", "4"];
  for (let i = out.length; i < 4; i++) {
    out.push(filler[i] ?? "·");
  }
  return out.slice(0, 4);
}

export async function getHomeHeroTrust(): Promise<HomeHeroTrust> {
  if (!isDatabaseConfigured()) {
    return {
      studentCountLabel: `+${FALLBACK_STUDENTS} étudiants`,
      ratingAverage: FALLBACK_RATING,
      primaryCtaHref: `/boutique/${HERO_FORMATION_SLUG}`,
      avatarInitials: ["1", "2", "3", "4"],
    };
  }

  try {
    const [studentCount, testimonials, heroFormation] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      getApprovedTestimonials(),
      prisma.formation.findFirst({
        where: {
          slug: HERO_FORMATION_SLUG,
          statut: { in: ["ACTIVE", "COMING_SOON"] },
        },
        select: { slug: true },
      }),
    ]);

    const studentCountLabel =
      studentCount > 0
        ? `+${studentCount} étudiant${studentCount > 1 ? "s" : ""}`
        : "Rejoignez nos premiers étudiants";

    const ratingAverage =
      testimonials.length > 0
        ? testimonials.reduce((s, t) => s + t.note, 0) / testimonials.length
        : null;

    const avatarInitials = padAvatars(
      testimonials.slice(0, 4).map((t) => initialsFromName(t.nom))
    );

    const primaryCtaHref = heroFormation
      ? `/boutique/${heroFormation.slug}`
      : "/boutique";

    return {
      studentCountLabel,
      ratingAverage,
      primaryCtaHref,
      avatarInitials,
    };
  } catch (e) {
    console.error("[getHomeHeroTrust]", e);
    return {
      studentCountLabel: `+${FALLBACK_STUDENTS} étudiants`,
      ratingAverage: FALLBACK_RATING,
      primaryCtaHref: "/boutique",
      avatarInitials: ["1", "2", "3", "4"],
    };
  }
}
