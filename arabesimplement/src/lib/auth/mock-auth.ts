/**
 * Auth mock - Utilisé quand Supabase n'est pas configuré.
 * Remplace par Supabase Auth une fois les clés configurées.
 */

export const MOCK_ADMIN_EMAIL = "admin@arabesimplement.fr";
export const MOCK_ADMIN_PASSWORD = "admin123";

export interface MockSession {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  role: "STUDENT" | "ADMIN";
  expiresAt: number;
}

export function createMockSession(
  email: string,
  prenom: string,
  nom: string
): MockSession {
  const isAdmin = email.toLowerCase() === MOCK_ADMIN_EMAIL;
  return {
    id: crypto.randomUUID(),
    email,
    prenom,
    nom,
    role: isAdmin ? "ADMIN" : "STUDENT",
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 jours
  };
}

export function validateMockCredentials(
  email: string,
  password: string
): { valid: boolean; prenom?: string; nom?: string } {
  if (email.toLowerCase() === MOCK_ADMIN_EMAIL) {
    return password === MOCK_ADMIN_PASSWORD
      ? { valid: true, prenom: "Admin", nom: "ArabeSimplement" }
      : { valid: false };
  }
  return { valid: true, prenom: "Utilisateur", nom: "Test" };
}
