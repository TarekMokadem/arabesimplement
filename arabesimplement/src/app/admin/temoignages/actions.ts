"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { adminTestimonialWriteSchema } from "@/lib/validations/admin-testimonial.schema";

export type TestimonialActionResult =
  | { success: true }
  | { success: false; error: string };

function zodFirstMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Données invalides";
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
