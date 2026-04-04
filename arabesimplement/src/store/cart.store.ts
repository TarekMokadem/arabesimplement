import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FormationSchedulingMode } from "@/types/domain.types";
import {
  mergeHourlyBundles,
  sumHourlyBundleEuros,
  type HourlyDurationBundle,
} from "@/lib/scheduling-mode";

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
  /**
   * Cours à la carte : quantités par durée (60 / 40 / 30 min) pour la même semaine.
   * Ex. { 60: 2, 30: 1 } → 2×10 € + 1×5 € / semaine.
   */
  hourlyBundle?: HourlyDurationBundle;
  /** @deprecated Préférer `hourlyBundle` ; conservé pour paniers persistés anciens. */
  hourlyMinutes?: number;
}

function newLineId(): string {
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Évite deux fois exactement la même sélection pour les modes hors cours à la carte. */
export function sameCartSelection(a: CartItem, b: CartItem): boolean {
  if (a.schedulingMode === "HOURLY_PURCHASE" && b.schedulingMode === "HOURLY_PURCHASE") {
    return (
      a.formationId === b.formationId && (a.creneauId ?? "") === (b.creneauId ?? "")
    );
  }
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
  const schedulingMode =
    (r.schedulingMode as FormationSchedulingMode) ?? "FIXED_SLOTS";

  let hourlyBundle: HourlyDurationBundle | undefined;
  const rawBundle = r.hourlyBundle as Record<string, unknown> | undefined;
  if (rawBundle && typeof rawBundle === "object") {
    hourlyBundle = {};
    for (const key of ["60", "40", "30"]) {
      const v = rawBundle[key];
      if (v != null && Number(v) > 0) {
        hourlyBundle[Number(key) as 60 | 40 | 30] = Math.floor(Number(v));
      }
    }
    if (Object.keys(hourlyBundle).length === 0) hourlyBundle = undefined;
  }

  const hourlyMinutes =
    r.hourlyMinutes != null ? Number(r.hourlyMinutes) : undefined;

  const prix = Number(r.prix ?? 0);
  const resolvedPrix =
    schedulingMode === "HOURLY_PURCHASE" && hourlyBundle
      ? sumHourlyBundleEuros(hourlyBundle)
      : schedulingMode === "HOURLY_PURCHASE" && hourlyMinutes != null && !hourlyBundle
        ? prix
        : prix;

  return {
    lineId,
    formationId: formationId || lineId,
    titre: String(r.titre ?? ""),
    prix: resolvedPrix,
    prixPromo:
      r.prixPromo != null && r.prixPromo !== ""
        ? Number(r.prixPromo)
        : undefined,
    imageUrl: r.imageUrl ? String(r.imageUrl) : undefined,
    slug: String(r.slug ?? ""),
    schedulingMode,
    creneauId: r.creneauId ? String(r.creneauId) : undefined,
    choiceSummary: r.choiceSummary ? String(r.choiceSummary) : undefined,
    hourlyBundle,
    hourlyMinutes:
      hourlyBundle && Object.keys(hourlyBundle).length > 0
        ? undefined
        : hourlyMinutes,
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

        if (item.schedulingMode === "HOURLY_PURCHASE" && item.hourlyBundle) {
          const weekly = sumHourlyBundleEuros(item.hourlyBundle);
          if (weekly <= 0) return;

          set((state) => {
            const idx = state.items.findIndex(
              (i) =>
                i.schedulingMode === "HOURLY_PURCHASE" &&
                i.formationId === item.formationId &&
                (i.creneauId ?? "") === (item.creneauId ?? "")
            );
            if (idx >= 0) {
              const existing = state.items[idx];
              const mergedBundle = mergeHourlyBundles(
                existing.hourlyBundle,
                item.hourlyBundle
              );
              const mergedPrix = sumHourlyBundleEuros(mergedBundle);
              if (mergedPrix <= 0) return state;

              const next = [...state.items];
              next[idx] = {
                ...existing,
                hourlyBundle: mergedBundle,
                hourlyMinutes: undefined,
                prix: mergedPrix,
                choiceSummary: item.choiceSummary ?? existing.choiceSummary,
                imageUrl: item.imageUrl ?? existing.imageUrl,
              };
              return { items: next };
            }
            return {
              items: [...state.items, { ...item, lineId, prix: weekly }],
            };
          });
          return;
        }

        const normalized = { ...item, lineId };
        set((state) => ({ items: [...state.items, normalized] }));
      },

      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.lineId !== lineId),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, item) => {
          if (
            item.schedulingMode === "HOURLY_PURCHASE" &&
            item.hourlyBundle &&
            Object.keys(item.hourlyBundle).length > 0
          ) {
            return sum + sumHourlyBundleEuros(item.hourlyBundle);
          }
          return sum + (item.prixPromo ?? item.prix);
        }, 0),

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
  hourlyBundle?: HourlyDurationBundle;
}): CartItem {
  const weeklyFromBundle = input.hourlyBundle
    ? sumHourlyBundleEuros(input.hourlyBundle)
    : 0;
  const prix =
    input.schedulingMode === "HOURLY_PURCHASE"
      ? weeklyFromBundle > 0
        ? weeklyFromBundle
        : input.unitEuros
      : input.unitEuros;

  return {
    lineId: newLineId(),
    formationId: input.formationId,
    titre: input.titre,
    slug: input.slug,
    imageUrl: input.imageUrl,
    schedulingMode: input.schedulingMode,
    prix,
    prixPromo: undefined,
    creneauId: input.creneauId,
    choiceSummary: input.choiceSummary,
    hourlyBundle:
      input.hourlyBundle && Object.keys(input.hourlyBundle).length > 0
        ? input.hourlyBundle
        : undefined,
    hourlyMinutes:
      input.schedulingMode === "HOURLY_PURCHASE" && input.hourlyBundle
        ? undefined
        : input.hourlyMinutes,
  };
}
