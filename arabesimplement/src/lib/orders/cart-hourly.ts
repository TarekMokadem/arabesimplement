import type { CartItem } from "@/store/cart.store";

export type CheckoutCartKind = "hourly_only" | "standard" | "mixed";

/**
 * Panier entièrement cours à la carte, entièrement autres modes, ou mélange interdit au checkout.
 */
export function classifyCheckoutCart(items: CartItem[]): CheckoutCartKind {
  const hasHourly = items.some((i) => i.schedulingMode === "HOURLY_PURCHASE");
  const hasNonHourly = items.some((i) => i.schedulingMode !== "HOURLY_PURCHASE");
  if (hasHourly && hasNonHourly) return "mixed";
  if (hasHourly) return "hourly_only";
  return "standard";
}

export const MIXED_CART_CHECKOUT_ERROR =
  "Mélange interdit : les cours à la carte (abonnement mensuel) doivent être commandés séparément des autres formations. Videz le panier et procédez en deux commandes.";
