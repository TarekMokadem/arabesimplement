"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { PasswordResetPurpose } from "@prisma/client";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import {
  generatePasswordResetPlainToken,
  hashPasswordResetToken,
} from "@/lib/auth/password-reset-crypto";
import { hashPassword } from "@/lib/auth/password";
import { getSession } from "@/app/(auth)/actions";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { resetPasswordSchema } from "@/lib/validations/auth.schema";
import { completePasswordResetSchema } from "@/lib/validations/password-reset-completion.schema";
import { sendPasswordResetEmail } from "@/lib/email/send-password-reset-email";
import { toAbsoluteUrl } from "@/lib/site-url";

const RESET_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_RESET_EMAILS_PER_HOUR = 3;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function recentResetEmailCount(userId: string): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return prisma.passwordResetToken.count({
    where: {
      userId,
      createdAt: { gte: oneHourAgo },
    },
  });
}

async function createAndDispatchPasswordReset(params: {
  userId: string;
  email: string;
  prenom: string;
  purpose: PasswordResetPurpose;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const plain = generatePasswordResetPlainToken();
  const tokenHash = hashPasswordResetToken(plain);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  await prisma.passwordResetToken.deleteMany({
    where: { userId: params.userId, usedAt: null },
  });

  const row = await prisma.passwordResetToken.create({
    data: {
      userId: params.userId,
      tokenHash,
      purpose: params.purpose,
      expiresAt,
    },
  });

  const resetUrl = toAbsoluteUrl(
    `/reinitialiser-mot-de-passe?token=${encodeURIComponent(plain)}`
  );

  const sent = await sendPasswordResetEmail({
    to: params.email,
    prenom: params.prenom,
    resetUrl,
    purpose: params.purpose,
  });

  if (!sent) {
    await prisma.passwordResetToken.delete({ where: { id: row.id } });
    return {
      ok: false,
      error:
        "L’e-mail n’a pas pu être envoyé. Vérifiez la configuration (Resend) ou réessayez plus tard.",
    };
  }

  return { ok: true };
}

/**
 * Demande publique (mot de passe oublié). Réponse uniforme si le compte existe ou non.
 */
export async function requestForgotPasswordEmail(
  email: string
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = resetPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Adresse e-mail invalide",
    };
  }
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error:
        "Service indisponible : base de données non configurée sur cet environnement.",
    };
  }

  const normalized = normalizeEmail(parsed.data.email);
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: normalized },
      select: {
        id: true,
        prenom: true,
        email: true,
        passwordHash: true,
      },
    });
  } catch (e) {
    console.error("[requestForgotPasswordEmail]", e);
    return {
      success: true,
    };
  }

  if (!user?.passwordHash) {
    return { success: true };
  }

  const recent = await recentResetEmailCount(user.id);
  if (recent >= MAX_RESET_EMAILS_PER_HOUR) {
    return { success: true };
  }

  await createAndDispatchPasswordReset({
    userId: user.id,
    email: user.email,
    prenom: user.prenom,
    purpose: "FORGOT",
  });

  return { success: true };
}

/**
 * Élève connecté : envoie un lien sur l’e-mail du compte pour définir un nouveau mot de passe.
 */
export async function requestStudentPasswordChangeEmail(): Promise<
  { success: true } | { success: false; error: string }
> {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return { success: false, error: "Accès réservé aux élèves." };
  }
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error: "Service indisponible : base de données non configurée.",
    };
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        prenom: true,
        passwordHash: true,
      },
    });
  } catch (e) {
    console.error("[requestStudentPasswordChangeEmail]", e);
    return {
      success: false,
      error: "Impossible de traiter la demande. Réessayez plus tard.",
    };
  }

  if (!user?.passwordHash) {
    return {
      success: false,
      error:
        "Aucun mot de passe local n’est associé à ce compte. Utilisez « Mot de passe oublié » si besoin.",
    };
  }

  const recent = await recentResetEmailCount(user.id);
  if (recent >= MAX_RESET_EMAILS_PER_HOUR) {
    return {
      success: false,
      error:
        "Trop de demandes récentes. Réessayez dans une heure ou contactez le support.",
    };
  }

  const dispatched = await createAndDispatchPasswordReset({
    userId: user.id,
    email: user.email,
    prenom: user.prenom,
    purpose: "CHANGE",
  });

  if (!dispatched.ok) {
    return { success: false, error: dispatched.error };
  }

  return { success: true };
}

export type CompletePasswordResetResult =
  | { success: true }
  | { success: false; error: string };

export async function completePasswordReset(
  token: string,
  password: string,
  confirmPassword: string
): Promise<CompletePasswordResetResult> {
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error: "Service indisponible : base de données non configurée.",
    };
  }

  const parsed = completePasswordResetSchema.safeParse({
    token,
    password,
    confirmPassword,
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  const tokenHash = hashPasswordResetToken(parsed.data.token);
  const now = new Date();

  let row;
  try {
    row = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: now },
      },
      select: { id: true, userId: true },
    });
  } catch (e) {
    console.error("[completePasswordReset] lookup", e);
    return {
      success: false,
      error: "Une erreur est survenue. Réessayez plus tard.",
    };
  }

  if (!row) {
    return {
      success: false,
      error: "Ce lien est invalide ou a expiré. Demandez un nouveau lien.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: row.userId,
          usedAt: null,
          id: { not: row.id },
        },
      }),
    ]);
  } catch (e) {
    console.error("[completePasswordReset] transaction", e);
    return {
      success: false,
      error: "Impossible d’enregistrer le mot de passe. Réessayez plus tard.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return { success: true };
}
