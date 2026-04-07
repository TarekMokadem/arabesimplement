"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";

const updateSchema = z.object({
  userId: z.string().uuid(),
  formationId: z.string().uuid(),
  isHourlyGroup: z.boolean(),
  creneauId: z.string().uuid().nullable(),
  assignedProfessorName: z.string().max(200).nullable().optional(),
  assignedWhatsappUrl: z.string().max(2000).nullable().optional(),
});

export async function updateLearnerCourseAssignmentAction(
  raw: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await requireAdminSession();
  if (!session) return { ok: false, error: "Non autorisé." };

  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Données invalides." };
  }

  const {
    userId,
    formationId,
    isHourlyGroup,
    creneauId,
    assignedProfessorName,
    assignedWhatsappUrl,
  } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) return { ok: false, error: "Élève introuvable." };

  const formation = await prisma.formation.findUnique({
    where: { id: formationId },
    select: { schedulingMode: true },
  });
  if (!formation) return { ok: false, error: "Formation introuvable." };

  const prof =
    assignedProfessorName != null && assignedProfessorName.trim() !== ""
      ? assignedProfessorName.trim()
      : null;
  const wa =
    assignedWhatsappUrl != null && assignedWhatsappUrl.trim() !== ""
      ? assignedWhatsappUrl.trim()
      : null;

  if (isHourlyGroup && formation.schedulingMode === "HOURLY_PURCHASE") {
    await prisma.enrollment.updateMany({
      where: { userId, formationId },
      data: {
        assignedProfessorName: prof,
        assignedWhatsappUrl: wa,
      },
    });
  } else {
    await prisma.enrollment.updateMany({
      where: {
        userId,
        formationId,
        creneauId: creneauId ?? null,
      },
      data: {
        assignedProfessorName: prof,
        assignedWhatsappUrl: wa,
      },
    });
  }

  revalidatePath(`/admin/utilisateurs/${userId}`);
  revalidatePath("/tableau-de-bord");
  return { ok: true };
}
