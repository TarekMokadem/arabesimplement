"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import type { CartItem } from "@/store/cart.store";

/**
 * Attend la réhydratation du middleware `persist` (localStorage) avant d’exposer
 * le contenu du panier — évite les redirections à tort vers /panier « vide ».
 */
export function useCart() {
  const store = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }
    return useCartStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
  }, []);

  return {
    items: isHydrated ? store.items : [],
    addItem: store.addItem,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    getTotal: () => (isHydrated ? store.getTotal() : 0),
    getItemCount: () => (isHydrated ? store.getItemCount() : 0),
    hasSameSelection: (item: Omit<CartItem, "lineId"> & { lineId?: string }) =>
      isHydrated ? store.hasSameSelection(item) : false,
    isHydrated,
  };
}