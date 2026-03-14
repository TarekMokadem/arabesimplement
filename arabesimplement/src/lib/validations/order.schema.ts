import { z } from "zod";

export const orderFormSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  telephone: z
    .string()
    .min(10, "Le numéro doit contenir au moins 10 chiffres")
    .regex(
      /^[\d\s+.-]{10,20}$/,
      "Numéro de téléphone invalide (ex: 0612345678 ou +33612345678)"
    ),
  pays: z.string().min(2, "Veuillez sélectionner un pays"),
  acceptReglement: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter le règlement intérieur",
  }),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
