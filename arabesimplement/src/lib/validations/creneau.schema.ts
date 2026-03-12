import { z } from "zod";

export const creneauSchema = z.object({
  formationId: z.string().uuid("ID de formation invalide"),
  nom: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  jours: z.array(z.string()).min(1, "Sélectionnez au moins un jour"),
  heureDebut: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)"),
  dureeMinutes: z.coerce.number().min(15, "Durée minimum de 15 minutes"),
  placesMax: z.coerce.number().min(1, "Au moins 1 place requise"),
  whatsappLink: z
    .string()
    .url("Lien WhatsApp invalide")
    .regex(/chat\.whatsapp\.com/, "Le lien doit être un lien WhatsApp")
    .optional()
    .nullable()
    .or(z.literal("")),
  statut: z.enum(["OPEN", "FULL", "CLOSED"]).default("OPEN"),
});

export type CreneauInput = z.infer<typeof creneauSchema>;
