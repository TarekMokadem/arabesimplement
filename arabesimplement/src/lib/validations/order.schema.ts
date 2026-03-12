import { z } from "zod";

export const orderFormSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  telephone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Numéro de téléphone invalide (format international attendu)"
    ),
  pays: z.string().min(2, "Veuillez sélectionner un pays"),
  acceptReglement: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter le règlement intérieur",
  }),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
