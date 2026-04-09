import { z } from "zod";

const telephoneDigitsMin = 8;

export const learnerProfileSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  telephone: z.string().refine(
    (s) => {
      const t = s.trim();
      return (
        t.length === 0 ||
        t.replace(/\D/g, "").length >= telephoneDigitsMin
      );
    },
    {
      message:
        "Téléphone : au moins 8 chiffres si renseigné (indicatif inclus si besoin)",
    }
  ),
});

export type LearnerProfileInput = z.infer<typeof learnerProfileSchema>;
