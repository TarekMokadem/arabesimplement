"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { prismaActionErrorMessage } from "@/lib/utils/prisma-action-error";

export type DiscoveryLeadAdminResult =
  | { success: true }
  | { success: false; error: string };

const notesSchema = z.string().max(8000, "Notes trop longues.");

function revalidateInbox(id?: string): void {
  revalidatePath("/admin/cours-decouverte");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/cours-decouverte/${id}`);
}

export async function setDiscoveryLeadTraite(
  id: string,
  traite: boolean
): Promise<DiscoveryLeadAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Base de données non configurée." };
  }

  try {
    await prisma.discoveryLead.update({
      where: { id },
      data: { traite },
    });
    revalidateInbox(id);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: prismaActionErrorMessage(e, "Mise à jour impossible."),
    };
  }
}

export async function updateDiscoveryLeadNotes(
  id: string,
  notes: string
): Promise<DiscoveryLeadAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Base de données non configurée." };
  }

  const parsed = notesSchema.safeParse(notes);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Notes invalides.",
    };
  }

  try {
    await prisma.discoveryLead.update({
      where: { id },
      data: { notes: parsed.data.trim() || null },
    });
    revalidateInbox(id);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: prismaActionErrorMessage(e, "Enregistrement des notes impossible."),
    };
  }
}

export async function deleteDiscoveryLead(
  id: string
): Promise<DiscoveryLeadAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Base de données non configurée." };
  }

  try {
    await prisma.discoveryLead.delete({ where: { id } });
    revalidateInbox(id);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: prismaActionErrorMessage(e, "Suppression impossible."),
    };
  }
}
