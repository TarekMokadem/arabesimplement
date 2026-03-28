"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";

/** Vide le panier et la session checkout à l’arrivée sur la page de confirmation. */
export function ConfirmationCleanup() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
    sessionStorage.removeItem("orderInfo");
  }, [clearCart]);

  return null;
}
