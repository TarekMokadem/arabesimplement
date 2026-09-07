"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { prismaActionErrorMessage } from "@/lib/utils/prisma-action-error";
import { adminPromoCodeCreateSchema } from "@/lib/validations/promo-code.schema";
import { normalizePromoCode } from "@/lib/promo/normalize-code";

export type PromoCodeActionResult =
  | { success: true }
  | { success: false; error: string };

function zodFirstMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Données invalides";
}

export async function createPromoCode(
  data: unknown
): Promise<PromoCodeActionResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Base de données non configurée." };
  }

  const parsed = adminPromoCodeCreateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  const expiresAtRaw = parsed.data.expiresAt?.trim() ?? "";
  let expiresAt: Date | null = null;
  if (expiresAtRaw) {
    const d = new Date(expiresAtRaw);
    if (Number.isNaN(d.getTime())) {
      return { success: false, error: "Date d’expiration invalide." };
    }
    expiresAt = d;
  }

  try {
    await prisma.promoCode.create({
      data: {
        code: normalizePromoCode(parsed.data.code),
        amountOffEuros: new Prisma.Decimal(parsed.data.amountOffEuros.toFixed(2)),
        expiresAt,
        maxRedemptions: parsed.data.maxRedemptions ?? null,
        active: true,
      },
    });
    revalidatePath("/admin/codes-promo");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { success: false, error: "Ce code promo existe déjà." };
    }
    return {
      success: false,
      error: prismaActionErrorMessage(e, "Impossible de créer le code promo."),
    };
  }
}

export async function togglePromoCodeActive(
  id: string
): Promise<PromoCodeActionResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  try {
    const row = await prisma.promoCode.findUnique({
      where: { id },
      select: { active: true },
    });
    if (!row) return { success: false, error: "Code introuvable." };
    await prisma.promoCode.update({
      where: { id },
      data: { active: !row.active },
    });
    revalidatePath("/admin/codes-promo");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: prismaActionErrorMessage(e, "Mise à jour impossible."),
    };
  }
}

export async function deletePromoCode(
  id: string
): Promise<PromoCodeActionResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  try {
    await prisma.promoCode.delete({ where: { id } });
    revalidatePath("/admin/codes-promo");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: prismaActionErrorMessage(e, "Suppression impossible."),
    };
  }
}
