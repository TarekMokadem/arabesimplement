import { SignJWT, jwtVerify } from "jose";
import type { AuthSession } from "@/lib/auth/types";
import { SESSION_MAX_AGE } from "@/lib/auth/session";

const MIN_SECRET_LENGTH = 32;

function getSecretKey(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

export async function signAuthSession(session: AuthSession): Promise<string | null> {
  const key = getSecretKey();
  if (!key) return null;

  return new SignJWT({
    email: session.email,
    prenom: session.prenom,
    nom: session.nom,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .sign(key);
}

export async function verifyAuthSessionToken(
  token: string
): Promise<AuthSession | null> {
  const key = getSecretKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    const sub = payload.sub;
    const email = payload.email;
    const prenom = payload.prenom;
    const nom = payload.nom;
    const role = payload.role;

    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      typeof prenom !== "string" ||
      typeof nom !== "string" ||
      (role !== "STUDENT" && role !== "ADMIN")
    ) {
      return null;
    }

    return { id: sub, email, prenom, nom, role };
  } catch {
    return null;
  }
}
