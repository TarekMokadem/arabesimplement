import { z } from "zod";

const whatsappDigitsMin = 8;

export const discoveryLeadSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  whatsapp: z
    .string()
    .min(1, "Indiquez votre numéro WhatsApp")
    .refine(
      (s) => s.replace(/\D/g, "").length >= whatsappDigitsMin,
      "Numéro invalide : au moins 8 chiffres (indicatif inclus si besoin)"
    ),
  /** URI Calendly de l’événement réservé (optionnel). */
  calendlyEventUri: z.string().url().optional(),
  /** Honeypot anti-spam : doit rester vide. */
  website: z.string().optional(),
});

export type DiscoveryLeadInput = z.infer<typeof discoveryLeadSchema>;
