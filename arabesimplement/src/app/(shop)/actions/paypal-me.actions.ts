"use server";

import type { PaypalMeRecipient } from "@prisma/client";
import { getOrCreateSiteConfig } from "@/lib/data/site-config";
import {
  PAYPAL_ME_PROFILES,
  paypalMeUrlWithAmount,
} from "@/lib/paypal-me";

export type PaypalMePaymentLinkResult =
  | {
      success: true;
      url: string;
      recipient: PaypalMeRecipient;
      recipientShortLabel: string;
    }
  | { success: false; error: string };

export async function getPaypalMePaymentLink(
  amountEuros: number
): Promise<PaypalMePaymentLinkResult> {
  if (!Number.isFinite(amountEuros) || amountEuros <= 0) {
    return { success: false, error: "Montant invalide." };
  }
  try {
    const cfg = await getOrCreateSiteConfig();
    const profile = PAYPAL_ME_PROFILES[cfg.paypalMeRecipient];
    return {
      success: true,
      url: paypalMeUrlWithAmount(cfg.paypalMeRecipient, amountEuros),
      recipient: cfg.paypalMeRecipient,
      recipientShortLabel: profile.shortLabel,
    };
  } catch {
    return { success: false, error: "Indisponible pour le moment." };
  }
}
