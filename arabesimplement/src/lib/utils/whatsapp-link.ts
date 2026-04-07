/** Transforme un lien ou un numéro saisi admin en URL cliquable https. */
export function normalizeWhatsappHref(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^(wa\.me|chat\.whatsapp\.com)\//i.test(t)) return `https://${t}`;
  const digits = t.replace(/\D/g, "");
  if (digits.length >= 8) return `https://wa.me/${digits}`;
  return t.startsWith("/") ? t : `https://${t}`;
}
