"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPasswordResetToken } from "@/lib/auth/password-reset-crypto";
import { isDatabaseConfigured } from "@/lib/utils/database";
import {
  studentTestimonialSchema,
  type StudentTestimonialInput,
} from "@/lib/validations/student-testimonial.schema";

export type SubmitStudentTestimonialResult =
  | { success: true }
  | { success: false; error: string };

function zodFirstMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Données invalides";
}

export async function submitStudentTestimonial(
  data: StudentTestimonialInput
): Promise<SubmitStudentTestimonialResult> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Service temporairement indisponible." };
  }

  const parsed = studentTestimonialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  const tokenHash = hashPasswordResetToken(parsed.data.token.trim());
  const invite = await prisma.testimonialInvite.findUnique({
    where: { tokenHash },
    select: { expiresAt: true },
  });

  if (!invite) {
    return { success: false, error: "Ce lien n’est pas valide." };
  }
  if (invite.expiresAt.getTime() < Date.now()) {
    return {
      success: false,
      error: "Ce lien a expiré (validité 7 jours). Demandez un nouveau lien à l’équipe.",
    };
  }

  try {
    await prisma.testimonial.create({
      data: {
        nom: parsed.data.nom,
        texte: parsed.data.texte,
        note: parsed.data.note,
        approuve: false,
      },
    });

    revalidatePath("/admin/temoignages");
    revalidatePath("/temoignages");
    return { success: true };
  } catch {
    return { success: false, error: "Envoi impossible. Réessayez dans un instant." };
  }
}
