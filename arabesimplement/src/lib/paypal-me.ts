import type { PaypalMeRecipient } from "@prisma/client";

export const PAYPAL_ME_PROFILES: Record<
  PaypalMeRecipient,
  { pathSegment: string; description: string; shortLabel: string }
> = {
  YACINE_BOU18: {
    pathSegment: "yacineBou18",
    description: "paypal.me/yacineBou18",
    shortLabel: "Yacine",
  },
  JANA_OKF: {
    pathSegment: "janaokf",
    description: "paypal.me/janaokf",
    shortLabel: "Jana",
  },
};

export function paypalMeBaseUrl(recipient: PaypalMeRecipient): string {
  const { pathSegment } = PAYPAL_ME_PROFILES[recipient];
  return `https://www.paypal.me/${pathSegment}`;
}

/** Préremplit le montant sur la page PayPal.me (comportement habituel PayPal). */
export function paypalMeUrlWithAmount(
  recipient: PaypalMeRecipient,
  amountEuros: number
): string {
  const base = paypalMeBaseUrl(recipient);
  const n = Math.round(amountEuros * 100) / 100;
  if (!Number.isFinite(n) || n <= 0) return base;
  return `${base}/${n}`;
}
