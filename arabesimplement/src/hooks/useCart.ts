"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";

export function useCart() {
  const store = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    items: isHydrated ? store.items : [],
    addItem: store.addItem,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    getTotal: () => (isHydrated ? store.getTotal() : 0),
    getItemCount: () => (isHydrated ? store.getItemCount() : 0),
    isInCart: (id: string) => (isHydrated ? store.isInCart(id) : false),
    isHydrated,
  };
}
