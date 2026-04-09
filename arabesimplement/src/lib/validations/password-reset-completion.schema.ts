import { z } from "zod";

/** Formulaire client uniquement — ne pas utiliser `.omit()` sur un schéma avec `.refine()` (pas supporté → crash au chargement). */
export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;

export const completePasswordResetSchema = z
  .object({
    token: z.string().min(20, "Lien invalide ou incomplet."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type CompletePasswordResetInput = z.infer<
  typeof completePasswordResetSchema
>;
