"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createMockSession,
  validateMockCredentials,
  type MockSession,
} from "@/lib/auth/mock-auth";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth/session";

export async function signIn(email: string, password: string) {
  const { valid, prenom, nom } = validateMockCredentials(email, password);
  if (!valid) {
    return { error: "Email ou mot de passe incorrect" };
  }

  const session = createMockSession(email, prenom ?? "Utilisateur", nom ?? "Test");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  const redirectTo = session.role === "ADMIN" ? "/admin" : "/tableau-de-bord";
  return { success: true, redirectTo };
}

export async function signUp(
  email: string,
  password: string,
  prenom: string,
  nom: string
) {
  const session = createMockSession(email, prenom, nom);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return { success: true, redirectTo: "/tableau-de-bord" };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/connexion");
}

export async function getSession(): Promise<MockSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  try {
    const session: MockSession = JSON.parse(sessionCookie.value);
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}
