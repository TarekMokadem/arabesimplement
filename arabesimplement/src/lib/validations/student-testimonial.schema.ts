import { z } from "zod";

export const studentTestimonialSchema = z.object({
  token: z.string().min(20, "Lien invalide ou incomplet."),
  nom: z
    .string()
    .trim()
    .min(2, "Indiquez votre prénom ou un nom d’affichage (2 caractères min.).")
    .max(80, "Nom trop long."),
  texte: z
    .string()
    .trim()
    .min(10, "Votre avis doit contenir au moins 10 caractères.")
    .max(2000, "Votre avis est trop long (2000 caractères max.)."),
  note: z.coerce.number().int().min(1, "Choisissez une note.").max(5),
});

export type StudentTestimonialInput = z.infer<typeof studentTestimonialSchema>;
