"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/(auth)/actions";
import { setSessionCookie } from "@/lib/auth/set-session-cookie";
import { isDatabaseConfigured } from "@/lib/utils/database";
import {
  learnerProfileSchema,
  type LearnerProfileInput,
} from "@/lib/validations/learner-profile.schema";

export type LearnerProfileResult =
  | { ok: true }
  | { ok: false; error: string };

function dbUnavailableMessage(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  if (code === "ETIMEDOUT" || code === "P1008") {
    return (
      "La base de données met trop de temps à répondre. Réessayez dans un instant."
    );
  }
  return "Impossible de mettre à jour le profil pour le moment.";
}

export async function updateLearnerProfile(
  data: LearnerProfileInput
): Promise<LearnerProfileResult> {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return { ok: false, error: "Accès réservé aux élèves." };
  }
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error:
        "Mise à jour impossible : configurez une base de données (DATABASE_URL).",
    };
  }

  const parsed = learnerProfileSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  const telephone =
    parsed.data.telephone.trim() === ""
      ? null
      : parsed.data.telephone.trim();

  try {
    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        prenom: parsed.data.prenom.trim(),
        nom: parsed.data.nom.trim(),
        telephone,
      },
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        role: true,
      },
    });

    await setSessionCookie({
      id: user.id,
      email: user.email,
      prenom: user.prenom,
      nom: user.nom,
      role: user.role,
    });

    revalidatePath("/tableau-de-bord");
    return { ok: true };
  } catch (e) {
    console.error("[updateLearnerProfile]", e);
    return { ok: false, error: dbUnavailableMessage(e) };
  }
}
