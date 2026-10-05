import { z } from "zod";

export const adminRecordedOrderSchema = z.object({
  userId: z.string().min(1, "Choisissez un client"),
  formationId: z.string().min(1, "Choisissez une formation"),
  creneauId: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().optional()
  ),
  hourlyMinutes: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number().int().optional()
  ),
  hourlyQuantity: z.preprocess(
    (v) => (v === "" || v == null ? 1 : v),
    z.coerce.number().int().min(1).max(40)
  ),
  montantEuros: z.coerce.number().positive("Le montant doit être supérieur à 0"),
  statut: z.enum(["PAID", "PENDING"]),
  channel: z.enum(["virement", "paypal_me", "especes", "admin_manual"], {
    message: "Choisissez un moyen de paiement",
  }),
  pays: z.string().min(2, "Veuillez indiquer un pays"),
});

export type AdminRecordedOrderInput = z.infer<typeof adminRecordedOrderSchema>;
