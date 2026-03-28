import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { verifyAuthSessionToken } from "@/lib/auth/session-token";
import type { AuthSession } from "@/lib/auth/types";

export async function requireAdminSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!raw) return null;
  const session = await verifyAuthSessionToken(raw);
  if (!session || session.role !== "ADMIN") return null;
  return session;
}
