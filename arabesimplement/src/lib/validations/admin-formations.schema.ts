import { z } from "zod";

const formationStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
  "COMING_SOON",
  "ARCHIVED",
]);

const emptyToUndef = <T extends z.ZodType>(
  schema: T
) =>
  z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    schema.optional()
  );

const optionalPositiveNumber = z.preprocess(
  (v) =>
    v === "" ||
    v === null ||
    v === undefined ||
    (typeof v === "number" && Number.isNaN(v))
      ? undefined
      : v,
  z.coerce.number().positive().optional()
);

const optionalPositiveInt = z.preprocess(
  (v) =>
    v === "" ||
    v === null ||
    v === undefined ||
    (typeof v === "number" && Number.isNaN(v))
      ? undefined
      : v,
  z.coerce.number().int().positive().optional()
);

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && !v.trim() ? undefined : v),
  z.string().url("URL invalide").optional()
);

export function joursDepuisTexte(texte: string): string[] {
  return texte
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const formationAdminSchema = z.object({
  titre: z.string().min(2, "Titre trop court"),
  slug: z
    .string()
    .min(2, "Slug trop court")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug : minuscules, chiffres et tirets uniquement"
    ),
  descriptionCourte: z.string().min(10, "Description courte (min. 10 car.)"),
  description: z.string().optional(),
  prix: z.coerce.number().positive("Prix invalide"),
  prixPromo: optionalPositiveNumber,
  imageUrl: optionalUrl,
  placesMax: optionalPositiveInt,
  categorie: z.string().min(1, "Catégorie requise"),
  statut: formationStatus,
  featured: z.boolean(),
  featuredTitre: z.string().optional(),
  featuredContent: z.string().optional(),
  featuredBadge: z.string().optional(),
  /** Accepte chaîne (input datetime-local), Date (état après parse RHF), ou vide. */
  featuredExpiresAt: z.preprocess((val) => {
    if (val == null || val === "") return undefined;
    if (val instanceof Date) {
      return Number.isNaN(val.getTime()) ? undefined : val;
    }
    if (typeof val === "string" && val.trim()) {
      const d = new Date(val.trim());
      return Number.isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
  }, z.date().optional()),
});

export type FormationAdminInput = z.infer<typeof formationAdminSchema>;

/** Valeurs du formulaire admin : `featuredExpiresAt` reste une chaîne (input datetime-local). */
export type FormationEditorDefaults = Omit<
  FormationAdminInput,
  "featuredExpiresAt"
> & {
  featuredExpiresAt?: string;
};

export const creneauAdminSchema = z.object({
  nom: z.string().min(1, "Nom du créneau requis"),
  joursTexte: z
    .string()
    .min(1, "Indiquez au moins un jour (ex. Lundi, Mercredi)")
    .refine((s) => joursDepuisTexte(s).length > 0, "Au moins un jour valide"),
  heureDebut: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/, "Format HH:MM"),
  dureeMinutes: z.coerce.number().int().positive("Durée invalide"),
  placesMax: z.coerce.number().int().positive("Places max. invalides"),
  whatsappLink: optionalUrl,
  statut: z.enum(["OPEN", "FULL", "CLOSED"]),
});

export type CreneauAdminInput = z.infer<typeof creneauAdminSchema>;
