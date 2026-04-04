import { isValidHourlyMinutes } from "@/lib/scheduling-mode";

const ENV_60 = "STRIPE_PRICE_WEEKLY_60";
const ENV_40 = "STRIPE_PRICE_WEEKLY_40";
const ENV_30 = "STRIPE_PRICE_WEEKLY_30";

const byMinutes = {
  60: process.env[ENV_60],
  40: process.env[ENV_40],
  30: process.env[ENV_30],
} as const;

export function weeklyStripePriceIdsConfigured(): boolean {
  return Boolean(byMinutes[60]?.trim() && byMinutes[40]?.trim() && byMinutes[30]?.trim());
}

/** Identifiant de prix Stripe récurrent hebdomadaire pour la durée choisie. */
export function weeklyStripePriceIdForMinutes(minutes: number): string | null {
  if (!isValidHourlyMinutes(minutes)) return null;
  const id = byMinutes[minutes as 60 | 40 | 30];
  const t = id?.trim();
  return t && t.length > 0 ? t : null;
}
