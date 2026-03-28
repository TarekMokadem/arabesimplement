import type {
  FormationAdminInput,
  FormationEditorDefaults,
} from "@/lib/validations/admin-formations.schema";

function datetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Utilisable côté serveur (hors module `"use client"`). */
export function formationVersFormInput(f: {
  titre: string;
  slug: string;
  descriptionCourte: string;
  description: string | null;
  prix: unknown;
  prixPromo: unknown;
  imageUrl: string | null;
  placesMax: number | null;
  categorie: string;
  schedulingMode: FormationAdminInput["schedulingMode"];
  statut: FormationAdminInput["statut"];
  featured: boolean;
  featuredTitre: string | null;
  featuredContent: string | null;
  featuredBadge: string | null;
  featuredExpiresAt: Date | string | null;
}): FormationEditorDefaults {
  const exp = f.featuredExpiresAt
    ? datetimeLocal(
        f.featuredExpiresAt instanceof Date
          ? f.featuredExpiresAt
          : new Date(f.featuredExpiresAt)
      )
    : undefined;
  return {
    titre: f.titre,
    slug: f.slug,
    descriptionCourte: f.descriptionCourte,
    description: f.description ?? "",
    prix: Number(f.prix),
    prixPromo: f.prixPromo != null ? Number(f.prixPromo) : undefined,
    imageUrl: f.imageUrl ?? undefined,
    placesMax: f.placesMax ?? undefined,
    categorie: f.categorie,
    schedulingMode: f.schedulingMode,
    statut: f.statut,
    featured: f.featured,
    featuredTitre: f.featuredTitre ?? "",
    featuredContent: f.featuredContent ?? "",
    featuredBadge: f.featuredBadge ?? "",
    featuredExpiresAt: exp,
  };
}
