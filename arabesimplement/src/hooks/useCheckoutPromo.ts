"use client";

import { useCallback, useEffect, useState } from "react";
import { previewPromoCode } from "@/app/(shop)/actions/promo.actions";
import type { CheckoutKindForDiscount } from "@/lib/promo/apply-discount";
import {
  readStoredCheckoutPromoCode,
  writeStoredCheckoutPromoCode,
} from "@/lib/promo/checkout-promo-storage";
import type { AppliedCheckoutPromo } from "@/components/shop/PromoCodeField";

export function useCheckoutPromo(
  subtotalEuros: number,
  checkoutKind: CheckoutKindForDiscount
) {
  const [applied, setApplied] = useState<AppliedCheckoutPromo | null>(null);

  const restore = useCallback(async () => {
    const stored = readStoredCheckoutPromoCode();
    if (!stored || subtotalEuros <= 0) {
      setApplied(null);
      return;
    }
    const result = await previewPromoCode(stored, subtotalEuros, checkoutKind);
    if (!result.success) {
      writeStoredCheckoutPromoCode("");
      setApplied(null);
      return;
    }
    setApplied({
      code: result.code,
      discountEuros: result.discountEuros,
      payableEuros: result.payableEuros,
    });
  }, [subtotalEuros, checkoutKind]);

  useEffect(() => {
    void restore();
  }, [restore]);

  return { applied, setApplied };
}
