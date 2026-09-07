"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { CHECKOUT_PROMO_STORAGE_KEY } from "@/lib/promo/checkout-promo-storage";

/** Vide le panier et la session checkout à l’arrivée sur la page de confirmation. */
export function ConfirmationCleanup() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
    sessionStorage.removeItem("orderInfo");
    try {
      sessionStorage.removeItem(CHECKOUT_PROMO_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [clearCart]);

  return null;
}
