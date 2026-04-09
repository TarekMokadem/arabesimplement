import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth/session";
import { signAuthSession } from "@/lib/auth/session-token";
import type { AuthSession } from "@/lib/auth/types";

export async function setSessionCookie(session: AuthSession): Promise<void> {
  const token = await signAuthSession(session);
  if (!token) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court (min. 32 caractères)."
    );
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
