import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { applyFixedAmountOff, minPayableForCheckoutKind } from "@/lib/promo/apply-discount";
import type { AppliedCartDiscount, CheckoutKindForDiscount } from "@/lib/promo/apply-discount";
import { isValidPromoCodeFormat, normalizePromoCode } from "@/lib/promo/normalize-code";

export type CheckoutPromoResolution = {
  applied: AppliedCartDiscount;
  promo: { id: string; code: string } | null;
};

/**
 * Valide un code promo pour le checkout. Code vide = pas de réduction.
 */
export async function resolvePromoForCheckout(params: {
  rawCode: string | null | undefined;
  subtotalEuros: number;
  checkoutKind: CheckoutKindForDiscount;
  stripeConfigured: boolean;
}): Promise<
  | { success: true; resolution: CheckoutPromoResolution }
  | { success: false; error: string }
> {
  const minPayable = minPayableForCheckoutKind(
    params.checkoutKind,
    params.stripeConfigured
  );
  const trimmed = params.rawCode?.trim() ?? "";
  if (!trimmed) {
    return {
      success: true,
      resolution: {
        applied: applyFixedAmountOff(params.subtotalEuros, 0, minPayable),
        promo: null,
      },
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error: "Les codes promo ne sont pas disponibles pour le moment.",
    };
  }

  const code = normalizePromoCode(trimmed);
  if (!isValidPromoCodeFormat(code)) {
    return { success: false, error: "Code promo invalide." };
  }

  const row = await prisma.promoCode.findUnique({ where: { code } });
  if (!row || !row.active) {
    return { success: false, error: "Ce code promo n’est pas valide." };
  }
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
    return { success: false, error: "Ce code promo a expiré." };
  }

  if (row.maxRedemptions != null) {
    const pendingUsing = await prisma.order.count({
      where: { promoCodeId: row.id, statut: "PENDING" },
    });
    if (row.redemptionCount + pendingUsing >= row.maxRedemptions) {
      return {
        success: false,
        error: "Ce code promo a atteint son nombre d’utilisations.",
      };
    }
  }

  const amountOff = Number(row.amountOffEuros);
  if (!Number.isFinite(amountOff) || amountOff <= 0) {
    return { success: false, error: "Ce code promo n’est pas valide." };
  }

  const applied = applyFixedAmountOff(
    params.subtotalEuros,
    amountOff,
    minPayable
  );
  if (applied.discountEuros <= 0) {
    return {
      success: false,
      error: "Ce code promo ne s’applique pas à ce montant.",
    };
  }

  return {
    success: true,
    resolution: {
      applied,
      promo: { id: row.id, code: row.code },
    },
  };
}
