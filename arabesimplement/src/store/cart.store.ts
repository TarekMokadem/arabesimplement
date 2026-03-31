import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FormationSchedulingMode } from "@/types/domain.types";

export interface CartItem {
  /** Identifiant unique de la ligne panier */
  lineId: string;
  formationId: string;
  titre: string;
  prix: number;
  prixPromo?: number;
  imageUrl?: string;
  slug: string;
  schedulingMode: FormationSchedulingMode;
  /** Créneau choisi (obligatoire si le mode / la formation l’exige) */
  creneauId?: string;
  /** Affichage : ex. « Mercredi 10h — Groupe A » */
  choiceSummary?: string;
  /** Durée réservée pour le mode cours à la carte (60, 40 ou 30) */
  hourlyMinutes?: number;
}

function newLineId(): string {
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Évite deux fois exactement la même sélection pour la même formation. */
export function sameCartSelection(a: CartItem, b: CartItem): boolean {
  return (
    a.formationId === b.formationId &&
    (a.creneauId ?? "") === (b.creneauId ?? "") &&
    (a.hourlyMinutes ?? 0) === (b.hourlyMinutes ?? 0)
  );
}

/** Migre d’anciennes entrées panier (id = formationId). */
export function migrateRawCartItem(raw: unknown): CartItem {
  const r = raw as Record<string, unknown>;
  const formationId = String(r.formationId ?? r.id ?? "");
  const lineId = String(r.lineId ?? (formationId || newLineId()));
  return {
    lineId,
    formationId: formationId || lineId,
    titre: String(r.titre ?? ""),
    prix: Number(r.prix ?? 0),
    prixPromo:
      r.prixPromo != null && r.prixPromo !== ""
        ? Number(r.prixPromo)
        : undefined,
    imageUrl: r.imageUrl ? String(r.imageUrl) : undefined,
    slug: String(r.slug ?? ""),
    schedulingMode: (r.schedulingMode as FormationSchedulingMode) ?? "FIXED_SLOTS",
    creneauId: r.creneauId ? String(r.creneauId) : undefined,
    choiceSummary: r.choiceSummary ? String(r.choiceSummary) : undefined,
    hourlyMinutes:
      r.hourlyMinutes != null ? Number(r.hourlyMinutes) : undefined,
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  /** Indique si une ligne avec la même formation + sélection existe déjà. */
  hasSameSelection: (item: Omit<CartItem, "lineId"> & { lineId?: string }) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const lineId = item.lineId || newLineId();
        const normalized = { ...item, lineId };
        set((state) => ({ items: [...state.items, normalized] }));
      },

      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.lineId !== lineId),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, item) => sum + (item.prixPromo ?? item.prix),
          0
        ),

      getItemCount: () => get().items.length,

      hasSameSelection: (item) => {
        const withId = { ...item, lineId: item.lineId ?? "" };
        return get().items.some((i) => sameCartSelection(i, withId as CartItem));
      },
    }),
    {
      name: "arabesimplement-cart-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function buildCartItemFromSelection(input: {
  formationId: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  schedulingMode: FormationSchedulingMode;
  unitEuros: number;
  creneauId?: string;
  choiceSummary?: string;
  hourlyMinutes?: number;
}): CartItem {
  return {
    lineId: newLineId(),
    formationId: input.formationId,
    titre: input.titre,
    slug: input.slug,
    imageUrl: input.imageUrl,
    schedulingMode: input.schedulingMode,
    prix: input.unitEuros,
    prixPromo: undefined,
    creneauId: input.creneauId,
    choiceSummary: input.choiceSummary,
    hourlyMinutes: input.hourlyMinutes,
  };
}
