import { isValidHourlyMinutes } from "@/lib/scheduling-mode";

/**
 * Prix Stripe récurrents « cours à la carte » (mensuel).
 * Préférez STRIPE_PRICE_MONTHLY_* ; les anciennes variables STRIPE_PRICE_WEEKLY_* restent prises en charge.
 */
const MONTHLY_60 = "STRIPE_PRICE_MONTHLY_60";
const MONTHLY_40 = "STRIPE_PRICE_MONTHLY_40";
const MONTHLY_30 = "STRIPE_PRICE_MONTHLY_30";
const LEGACY_WEEKLY_60 = "STRIPE_PRICE_WEEKLY_60";
const LEGACY_WEEKLY_40 = "STRIPE_PRICE_WEEKLY_40";
const LEGACY_WEEKLY_30 = "STRIPE_PRICE_WEEKLY_30";

function priceIdForMinutes(minutes: 60 | 40 | 30): string | undefined {
  const monthly =
    minutes === 60
      ? process.env[MONTHLY_60]
      : minutes === 40
        ? process.env[MONTHLY_40]
        : process.env[MONTHLY_30];
  const legacy =
    minutes === 60
      ? process.env[LEGACY_WEEKLY_60]
      : minutes === 40
        ? process.env[LEGACY_WEEKLY_40]
        : process.env[LEGACY_WEEKLY_30];
  return (monthly?.trim() || legacy?.trim()) ?? undefined;
}

const byMinutes = {
  60: () => priceIdForMinutes(60),
  40: () => priceIdForMinutes(40),
  30: () => priceIdForMinutes(30),
} as const;

/** @deprecated utiliser `recurringCartStripePriceIdsConfigured` */
export function weeklyStripePriceIdsConfigured(): boolean {
  return recurringCartStripePriceIdsConfigured();
}

export function recurringCartStripePriceIdsConfigured(): boolean {
  return Boolean(
    byMinutes[60]() && byMinutes[40]() && byMinutes[30]()
  );
}

/** Identifiant de prix Stripe récurrent (mensuel) pour la durée choisie. */
/** @deprecated utiliser `recurringCartStripePriceIdForMinutes` */
export function weeklyStripePriceIdForMinutes(minutes: number): string | null {
  return recurringCartStripePriceIdForMinutes(minutes);
}

export function recurringCartStripePriceIdForMinutes(
  minutes: number
): string | null {
  if (!isValidHourlyMinutes(minutes)) return null;
  const id = byMinutes[minutes as 60 | 40 | 30]();
  const t = id?.trim();
  return t && t.length > 0 ? t : null;
}

/** Pour resynchroniser la DB après changement de prix côté Stripe. */
export function hourlyMinutesFromStripePriceId(
  priceId: string | undefined | null
): number | null {
  if (!priceId?.trim()) return null;
  const id = priceId.trim();
  for (const m of [60, 40, 30] as const) {
    const configured = recurringCartStripePriceIdForMinutes(m);
    if (configured && configured === id) return m;
  }
  return null;
}
