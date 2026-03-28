import type { FormationEditorDefaults } from "@/lib/validations/admin-formations.schema";

export function getDefaultFormationValues(): FormationEditorDefaults {
  return {
    titre: "",
    slug: "",
    descriptionCourte: "",
    description: "",
    prix: 49,
    prixPromo: undefined,
    imageUrl: undefined,
    placesMax: undefined,
    categorie: "Lecture",
    statut: "ACTIVE",
    featured: false,
    featuredTitre: "",
    featuredContent: "",
    featuredBadge: "",
    featuredExpiresAt: undefined,
  };
}
