/**
 * URL WhatsApp (wa.me) pour l’élève selon la formation suivie.
 * Variable : NEXT_PUBLIC_WHATSAPP_HOMMES
 * (chiffres uniquement, ex. 33612345678 sans + ni espaces).
 */
export function learnerFormationWhatsAppUrl(
  formationTitre: string
): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_HOMMES;
  if (!raw?.trim()) return null;

  const phone = raw.replace(/\D/g, "");
  if (phone.length < 8) return null;

  const text = `Bonjour, je suis inscrit(e) à la formation « ${formationTitre} » et je souhaite échanger pour l’organisation des cours / le suivi. Barakallahou fik.`;
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function learnerWhatsAppCoachLabel(): string {
  return "WhatsApp";
}
