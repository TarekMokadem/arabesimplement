"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  adminUserUpdateSchema,
  type AdminUserUpdateInput,
} from "@/lib/validations/admin-user.schema";

export type UserAdminResult = { success: true } | { success: false; error: string };

function zodFirstMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Données invalides";
}

export async function updateAdminUser(
  userId: string,
  data: AdminUserUpdateInput
): Promise<UserAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = adminUserUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  if (
    userId === admin.id &&
    parsed.data.role === "STUDENT"
  ) {
    return {
      success: false,
      error: "Vous ne pouvez pas retirer votre propre rôle administrateur.",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const other = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
  });
  if (other) {
    return { success: false, error: "Cet email est déjà utilisé." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        prenom: parsed.data.prenom.trim(),
        nom: parsed.data.nom.trim(),
        email,
        telephone: parsed.data.telephone?.trim() || null,
        role: parsed.data.role,
      },
    });
    revalidatePath("/admin/utilisateurs");
    revalidatePath(`/admin/utilisateurs/${userId}/modifier`);
    return { success: true };
  } catch (e) {
    console.error("[updateAdminUser]", e);
    return { success: false, error: "Mise à jour impossible." };
  }
}

export async function deleteAdminUser(userId: string): Promise<UserAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  if (userId === admin.id) {
    return { success: false, error: "Vous ne pouvez pas supprimer votre compte ici." };
  }

  const u = await prisma.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { orders: true, enrollments: true } } },
  });
  if (!u) return { success: false, error: "Utilisateur introuvable." };
  if (u._count.orders > 0 || u._count.enrollments > 0) {
    return {
      success: false,
      error:
        "Suppression impossible : commandes ou inscriptions liées à ce compte.",
    };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/utilisateurs");
    return { success: true };
  } catch (e) {
    console.error("[deleteAdminUser]", e);
    return { success: false, error: "Suppression impossible." };
  }
}
