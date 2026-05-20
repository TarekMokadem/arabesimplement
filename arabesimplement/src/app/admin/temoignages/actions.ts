"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  generatePasswordResetPlainToken,
  hashPasswordResetToken,
} from "@/lib/auth/password-reset-crypto";
import { toAbsoluteUrl } from "@/lib/site-url";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { prismaActionErrorMessage } from "@/lib/utils/prisma-action-error";
import { adminTestimonialWriteSchema } from "@/lib/validations/admin-testimonial.schema";

const INVITE_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type TestimonialActionResult =
  | { success: true }
  | { success: false; error: string };

function zodFirstMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Données invalides";
}

export type CreateTestimonialInviteLinkResult =
  | { success: true; url: string; expiresAt: string }
  | { success: false; error: string };

/** Génère un lien unique pour qu’un élève dépose un avis (modération ensuite). */
export async function createTestimonialInviteLink(): Promise<CreateTestimonialInviteLinkResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error: "Base de données non configurée (DATABASE_URL).",
    };
  }

  const plain = generatePasswordResetPlainToken();
  const tokenHash = hashPasswordResetToken(plain);
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

  try {
    await prisma.testimonialInvite.create({
      data: { tokenHash, expiresAt },
    });
    const url = toAbsoluteUrl(
      `/donner-son-avis?token=${encodeURIComponent(plain)}`
    );
    return { success: true, url, expiresAt: expiresAt.toISOString() };
  } catch (e) {
    return {
      success: false,
      error: prismaActionErrorMessage(e, "Impossible de créer le lien."),
    };
  }
}

export async function approveTestimonial(
  id: string
): Promise<TestimonialActionResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { approuve: true },
    });
    revalidatePath("/admin/temoignages");
    revalidatePath("/temoignages");
    return { success: true };
  } catch {
    return { success: false, error: "Mise à jour impossible." };
  }
}

export async function deleteTestimonial(
  id: string
): Promise<TestimonialActionResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/temoignages");
    revalidatePath("/temoignages");
    return { success: true };
  } catch {
    return { success: false, error: "Suppression impossible." };
  }
}

export async function createTestimonial(
  data: z.infer<typeof adminTestimonialWriteSchema>
): Promise<TestimonialActionResult & { id?: string }> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = adminTestimonialWriteSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  try {
    const row = await prisma.testimonial.create({
      data: {
        nom: parsed.data.nom.trim(),
        texte: parsed.data.texte.trim(),
        note: parsed.data.note,
        approuve: parsed.data.approuve,
      },
    });
    revalidatePath("/admin/temoignages");
    revalidatePath("/temoignages");
    return { success: true, id: row.id };
  } catch {
    return { success: false, error: "Création impossible." };
  }
}

export async function updateTestimonial(
  id: string,
  data: z.infer<typeof adminTestimonialWriteSchema>
): Promise<TestimonialActionResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = adminTestimonialWriteSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        nom: parsed.data.nom.trim(),
        texte: parsed.data.texte.trim(),
        note: parsed.data.note,
        approuve: parsed.data.approuve,
      },
    });
    revalidatePath("/admin/temoignages");
    revalidatePath("/temoignages");
    return { success: true };
  } catch {
    return { success: false, error: "Mise à jour impossible." };
  }
}
