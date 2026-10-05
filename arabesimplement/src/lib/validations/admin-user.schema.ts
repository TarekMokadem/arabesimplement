import { z } from "zod";

export const adminUserUpdateSchema = z.object({
  prenom: z.string().min(1, "Prénom requis"),
  nom: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  role: z.enum(["STUDENT", "ADMIN"]),
});

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;

export const adminUserCreateSchema = adminUserUpdateSchema.extend({
  sexe: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.enum(["FEMME", "HOMME"]).optional()
  ),
  sendCredentials: z.boolean().optional(),
});

export type AdminUserCreateInput = z.infer<typeof adminUserCreateSchema>;
