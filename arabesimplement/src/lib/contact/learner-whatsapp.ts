import type { StudentSex } from "@prisma/client";

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * URL WhatsApp (wa.me) pour l’élève selon son sexe et la formation suivie.
 * Variables : NEXT_PUBLIC_WHATSAPP_FEMMES et NEXT_PUBLIC_WHATSAPP_HOMMES
 * (chiffres uniquement, ex. 33612345678 sans + ni espaces).
 */
export function learnerFormationWhatsAppUrl(
  sexe: StudentSex | null,
  formationTitre: string
): string | null {
  const raw =
    sexe === "FEMME"
      ? process.env.NEXT_PUBLIC_WHATSAPP_FEMMES
      : sexe === "HOMME"
        ? process.env.NEXT_PUBLIC_WHATSAPP_HOMMES
        : null;
  if (!raw?.trim()) return null;

  const phone = digitsOnly(raw);
  if (phone.length < 8) return null;

  const text = `Bonjour, je suis inscrit(e) à la formation « ${formationTitre} » et je souhaite échanger pour l’organisation des cours / le suivi. Barakallahou fik.`;
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function learnerWhatsAppCoachLabel(sexe: StudentSex | null): string {
  if (sexe === "FEMME") return "Équipe féminine (WhatsApp)";
  if (sexe === "HOMME") return "Équipe masculine (WhatsApp)";
  return "";
}
