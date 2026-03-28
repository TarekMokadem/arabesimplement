"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth/session";
import { signAuthSession, verifyAuthSessionToken } from "@/lib/auth/session-token";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { AuthSession } from "@/lib/auth/types";
import { isDatabaseConfigured } from "@/lib/utils/database";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function dbUnavailableMessage(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  const name =
    err && typeof err === "object" && "name" in err
      ? String((err as { name: unknown }).name)
      : "";
  if (
    code === "ETIMEDOUT" ||
    code === "P1008" ||
    name === "TimeoutError" ||
    (typeof err === "object" &&
      err !== null &&
      "message" in err &&
      String((err as { message: unknown }).message).includes("timeout"))
  ) {
    return (
      "La base de données met trop de temps à répondre (réseau, pare-feu ou service distant). " +
      "Réessayez dans un instant ou vérifiez votre connexion Internet et DATABASE_URL."
    );
  }
  return (
    "Impossible de joindre la base de données pour le moment. Réessayez plus tard."
  );
}

async function setSessionCookie(session: AuthSession) {
  const token = await signAuthSession(session);
  if (!token) {
    throw new Error("SESSION_SECRET manquant ou trop court (min. 32 caractères).");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function signIn(
  email: string,
  password: string
): Promise<
  { success: true; redirectTo: string } | { success: false; error: string }
> {
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error:
        "Connexion impossible : configurez une base de données (DATABASE_URL).",
    };
  }

  const normalizedEmail = normalizeEmail(email);

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  } catch (e) {
    console.error("[signIn] base de données", e);
    return { success: false, error: dbUnavailableMessage(e) };
  }

  if (!user?.passwordHash) {
    return { success: false, error: "Email ou mot de passe incorrect" };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { success: false, error: "Email ou mot de passe incorrect" };
  }

  const session: AuthSession = {
    id: user.id,
    email: user.email,
    prenom: user.prenom,
    nom: user.nom,
    role: user.role,
  };

  try {
    await setSessionCookie(session);
  } catch {
    return {
      success: false,
      error:
        "Configuration serveur : ajoutez SESSION_SECRET (32 caractères minimum) dans .env",
    };
  }

  const redirectTo = user.role === "ADMIN" ? "/admin" : "/tableau-de-bord";
  return { success: true, redirectTo };
}

export async function signUp(
  email: string,
  password: string,
  prenom: string,
  nom: string
): Promise<
  | { success: true; redirectTo: string }
  | { success: false; error: string }
> {
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error:
        "Inscription impossible : configurez une base de données (DATABASE_URL).",
    };
  }

  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        prenom: prenom.trim(),
        nom: nom.trim(),
        passwordHash,
        role: "STUDENT",
      },
    });

    const session: AuthSession = {
      id: user.id,
      email: user.email,
      prenom: user.prenom,
      nom: user.nom,
      role: user.role,
    };

    await setSessionCookie(session);
    return { success: true, redirectTo: "/tableau-de-bord" };
  } catch (e: unknown) {
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      e.code === "P2002"
    ) {
      return {
        success: false,
        error: "Un compte existe déjà avec cette adresse email.",
      };
    }
    console.error("[signUp]", e);
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      (e as { code: string }).code !== "P2002"
    ) {
      return { success: false, error: dbUnavailableMessage(e) };
    }
    return {
      success: false,
      error: "Impossible de créer le compte. Réessayez plus tard.",
    };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/connexion");
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME);
  if (!raw?.value) return null;

  return verifyAuthSessionToken(raw.value);
}
