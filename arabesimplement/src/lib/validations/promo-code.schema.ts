import { z } from "zod";
import { isValidPromoCodeFormat, normalizePromoCode } from "@/lib/promo/normalize-code";

export const adminPromoCodeCreateSchema = z.object({
  code: z
    .string()
    .min(3, "Code trop court (3 caractères min.)")
    .max(32, "Code trop long (32 caractères max.)")
    .transform(normalizePromoCode)
    .refine(isValidPromoCodeFormat, {
      message: "Lettres, chiffres, tirets et underscores uniquement",
    }),
  amountOffEuros: z.coerce
    .number()
    .positive("Le montant de réduction doit être supérieur à 0")
    .max(10_000, "Montant trop élevé"),
  expiresAt: z.string().optional(),
  maxRedemptions: z.preprocess((value) => {
    if (value === "" || value == null) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().int().positive("Le nombre d’utilisations doit être un entier positif").optional()),
});

export type AdminPromoCodeCreateInput = z.infer<typeof adminPromoCodeCreateSchema>;
