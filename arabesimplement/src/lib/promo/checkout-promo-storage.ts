export const CHECKOUT_PROMO_STORAGE_KEY = "as.checkout.promoCode";

export function readStoredCheckoutPromoCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(CHECKOUT_PROMO_STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function writeStoredCheckoutPromoCode(code: string): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = code.trim();
    if (!trimmed) {
      sessionStorage.removeItem(CHECKOUT_PROMO_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(CHECKOUT_PROMO_STORAGE_KEY, trimmed);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStoredCheckoutPromoCode(): void {
  writeStoredCheckoutPromoCode("");
}
