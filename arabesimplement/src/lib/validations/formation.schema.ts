import { z } from "zod";

export const formationSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  descriptionCourte: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(300, "La description ne doit pas dépasser 300 caractères"),
  description: z.string().optional(),
  prix: z.coerce.number().min(0, "Le prix doit être positif"),
  prixPromo: z.coerce.number().min(0).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  placesMax: z.coerce.number().min(1).optional().nullable(),
  theme: z.enum(["ARABE", "RELIGION", "MIX"]),
  statut: z.enum(["ACTIVE", "INACTIVE", "COMING_SOON", "ARCHIVED"]),
  featured: z.boolean().default(false),
  featuredContent: z.string().optional().nullable(),
  featuredTitre: z.string().optional().nullable(),
  featuredBadge: z.string().optional().nullable(),
  featuredExpiresAt: z.date().optional().nullable(),
});

export type FormationInput = z.infer<typeof formationSchema>;
