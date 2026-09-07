"use server";

import { isStripeConfigured } from "@/lib/stripe/config";
import { resolvePromoForCheckout } from "@/lib/promo/resolve-promo-for-checkout";
import type { CheckoutKindForDiscount } from "@/lib/promo/apply-discount";

export type PreviewPromoCodeResult =
  | {
      success: true;
      code: string;
      subtotalEuros: number;
      discountEuros: number;
      payableEuros: number;
    }
  | { success: false; error: string };

export async function previewPromoCode(
  rawCode: string,
  subtotalEuros: number,
  checkoutKind: CheckoutKindForDiscount
): Promise<PreviewPromoCodeResult> {
  if (!Number.isFinite(subtotalEuros) || subtotalEuros <= 0) {
    return { success: false, error: "Montant du panier invalide." };
  }

  const resolved = await resolvePromoForCheckout({
    rawCode,
    subtotalEuros,
    checkoutKind,
    stripeConfigured: isStripeConfigured(),
  });
  if (!resolved.success) {
    return { success: false, error: resolved.error };
  }
  if (!resolved.resolution.promo) {
    return { success: false, error: "Saisissez un code promo." };
  }

  return {
    success: true,
    code: resolved.resolution.promo.code,
    subtotalEuros: resolved.resolution.applied.subtotalEuros,
    discountEuros: resolved.resolution.applied.discountEuros,
    payableEuros: resolved.resolution.applied.payableEuros,
  };
}
