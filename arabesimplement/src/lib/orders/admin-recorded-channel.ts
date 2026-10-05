/** Canaux d’un paiement saisi à la main dans l’admin (hors Stripe). */
export const ADMIN_RECORDED_CHANNEL_IDS = [
  "virement",
  "paypal_me",
  "especes",
  "admin_manual",
] as const;

export type AdminRecordedChannelId =
  (typeof ADMIN_RECORDED_CHANNEL_IDS)[number];

const LABELS: Record<AdminRecordedChannelId, string> = {
  virement: "Virement",
  paypal_me: "PayPal.me",
  especes: "Espèces",
  admin_manual: "Autre / saisie admin",
};

export function isAdminRecordedChannelId(
  value: string
): value is AdminRecordedChannelId {
  return (ADMIN_RECORDED_CHANNEL_IDS as readonly string[]).includes(value);
}

export function adminRecordedChannelLabel(id: string): string | null {
  if (!isAdminRecordedChannelId(id)) return null;
  return LABELS[id];
}
