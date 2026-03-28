import { z } from "zod";

export const adminUserUpdateSchema = z.object({
  prenom: z.string().min(1, "Prénom requis"),
  nom: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  role: z.enum(["STUDENT", "ADMIN"]),
});

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
