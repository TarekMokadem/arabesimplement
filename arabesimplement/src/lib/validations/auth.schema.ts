import { z } from "zod";
import { studentSexSchema } from "@/lib/validations/order.schema";

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const whatsappDigitsMin = 8;

export const signupSchema = z
  .object({
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    sexe: studentSexSchema,
    email: z.string().email("Adresse email invalide"),
    whatsapp: z
      .string()
      .min(1, "Indiquez votre numéro WhatsApp")
      .refine(
        (s) => s.replace(/\D/g, "").length >= whatsappDigitsMin,
        "Numéro invalide : au moins 8 chiffres (indicatif inclus si besoin)"
      ),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
