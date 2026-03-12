import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  titre: string;
  prix: number;
  prixPromo?: number;
  imageUrl?: string;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (id: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) return;
        set((state) => ({ items: [...state.items, item] }));
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, item) => sum + (item.prixPromo ?? item.prix),
          0
        ),

      getItemCount: () => get().items.length,

      isInCart: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: "arabesimplement-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
