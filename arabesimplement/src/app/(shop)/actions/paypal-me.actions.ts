"use server";

import { getOrCreateSiteConfig } from "@/lib/data/site-config";
import { paypalMeUrlWithAmount } from "@/lib/paypal-me";

export type PaypalMePaymentLinkResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function getPaypalMePaymentLink(
  amountEuros: number
): Promise<PaypalMePaymentLinkResult> {
  if (!Number.isFinite(amountEuros) || amountEuros <= 0) {
    return { success: false, error: "Montant invalide." };
  }
  try {
    const cfg = await getOrCreateSiteConfig();
    return {
      success: true,
      url: paypalMeUrlWithAmount(cfg.paypalMeRecipient, amountEuros),
    };
  } catch {
    return { success: false, error: "Indisponible pour le moment." };
  }
}
