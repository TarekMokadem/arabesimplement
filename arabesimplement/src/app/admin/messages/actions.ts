"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";

export type MessageAdminResult = { success: true } | { success: false; error: string };

export async function setContactMessageLu(
  id: string,
  lu: boolean
): Promise<MessageAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { lu },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Mise à jour impossible." };
  }
}

export async function deleteContactMessage(id: string): Promise<MessageAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Suppression impossible." };
  }
}
