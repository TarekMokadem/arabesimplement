"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { buildCartItemFromSelection } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";
import type { FormationCartInput } from "@/types/domain.types";
import type { Creneau } from "@/types/domain.types";
import {
  HOURLY_SLOTS_PRICING,
  emptyHourlyBundle,
  formatHourlyBundleForDisplay,
  sumHourlyBundleEuros,
  type HourlyDurationBundle,
} from "@/lib/scheduling-mode";
import { cn } from "@/lib/utils";
import {
  formatCreneauSlotLine,
  normalizeJourneeSlots,
} from "@/lib/creneau-display";

type CreneauLite = Pick<
  Creneau,
  | "id"
  | "nom"
  | "jours"
  | "journeeSlots"
  | "heureDebut"
  | "dureeMinutes"
  | "statut"
  | "placesMax"
>;

type HourlyQtyState = Record<60 | 40 | 30, number>;

type Props = {
  formation: FormationCartInput;
  creneaux: CreneauLite[];
};

export function PurchaseFormationPanel({ formation, creneaux }: Props) {
  const { addItem } = useCart();
  const open = useMemo(
    () => creneaux.filter((c) => c.statut === "OPEN"),
    [creneaux]
  );

  const [creneauId, setCreneauId] = useState<string | null>(null);
  const [hourlyQty, setHourlyQty] = useState<HourlyQtyState>(() =>
    emptyHourlyBundle()
  );

  const mode = formation.schedulingMode;

  const needsCreneau =
    mode === "FIXED_SLOTS" ||
    (mode === "HOURLY_PURCHASE" && open.length > 0);

  const needsHourly = mode === "HOURLY_PURCHASE";

  const hourlyBundleForTotal: HourlyDurationBundle = useMemo(
    () => ({
      60: hourlyQty[60],
      40: hourlyQty[40],
      30: hourlyQty[30],
    }),
    [hourlyQty]
  );

  const weeklyHourlyEuros = useMemo(
    () => sumHourlyBundleEuros(hourlyBundleForTotal),
    [hourlyBundleForTotal]
  );

  const unitPrice = useMemo(() => {
    if (mode === "HOURLY_PURCHASE") {
      return weeklyHourlyEuros;
    }
    const p = Number(formation.prix);
    const promo =
      formation.prixPromo != null ? Number(formation.prixPromo) : undefined;
    if (promo != null && promo > 0 && (!p || promo <= p)) return promo;
    return p;
  }, [mode, weeklyHourlyEuros, formation.prix, formation.prixPromo]);

  const catalogOk =
    mode === "HOURLY_PURCHASE" ||
    Number(formation.prix) > 0 ||
    (formation.prixPromo != null && Number(formation.prixPromo) > 0);

  const disabledReason = useMemo(() => {
    if (mode === "FIXED_SLOTS" && open.length === 0) {
      return "Aucun créneau disponible pour le moment.";
    }
    if (!catalogOk) {
      return "Prix catalogue non configuré.";
    }
    return null;
  }, [mode, open.length, catalogOk]);

  const canAdd =
    !disabledReason &&
    unitPrice > 0 &&
    (needsHourly ? weeklyHourlyEuros > 0 : true) &&
    (needsCreneau ? !!creneauId : true);

  const setTier = (minutes: 60 | 40 | 30, delta: number) => {
    setHourlyQty((prev) => {
      const next = Math.max(0, prev[minutes] + delta);
      return { ...prev, [minutes]: next };
    });
  };

  const buildChoiceSummary = (): string => {
    const parts: string[] = [];
    if (needsHourly && weeklyHourlyEuros > 0) {
      const line = formatHourlyBundleForDisplay(hourlyBundleForTotal);
      if (line) parts.push(line);
    }
    if (creneauId) {
      const c = creneaux.find((x) => x.id === creneauId);
      if (c) {
        const lines = normalizeJourneeSlots(c.journeeSlots, {
          jours: c.jours,
          heureDebut: c.heureDebut,
          dureeMinutes: c.dureeMinutes,
        })
          .map(formatCreneauSlotLine)
          .join(" · ");
        parts.push(`Créneau : ${c.nom} — ${lines}`);
      }
    }
    if (
      mode === "FLEXIBLE_FORMATION" &&
      !creneauId &&
      open.length === 0
    ) {
      parts.push(
        "Organisation des horaires directement avec le professeur après paiement"
      );
    }
    return parts.join(" · ");
  };

  const handleAdd = () => {
    if (!canAdd) return;
    const bundle: HourlyDurationBundle = {};
    if (needsHourly) {
      if (hourlyQty[60] > 0) bundle[60] = hourlyQty[60];
      if (hourlyQty[40] > 0) bundle[40] = hourlyQty[40];
      if (hourlyQty[30] > 0) bundle[30] = hourlyQty[30];
    }
    const item = buildCartItemFromSelection({
      formationId: formation.id,
      titre: formation.titre,
      slug: formation.slug,
      imageUrl: formation.imageUrl,
      schedulingMode: mode,
      unitEuros: unitPrice,
      creneauId: creneauId ?? undefined,
      choiceSummary: buildChoiceSummary(),
      hourlyBundle: needsHourly ? bundle : undefined,
    });
    addItem(item);
    toast.success("Ajouté au panier !");
  };

  return (
    <Card
      id="achat"
      className="bg-white border-2 border-secondary/20 scroll-mt-28"
    >
      <CardContent className="p-6 space-y-6">
        {disabledReason && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {disabledReason}
          </p>
        )}

        {needsHourly && (
          <div className="space-y-3">
            <p className="font-medium text-primary text-sm">
              Durées par semaine (ex. 2×1 h + 1×30 min)
            </p>
            <p className="text-xs text-gray-600">
              Chaque durée = une ligne d’abonnement ; le total affiché est prélevé
              chaque semaine.
            </p>
            <div className="grid gap-2">
              {HOURLY_SLOTS_PRICING.map((row) => (
                <div
                  key={row.minutes}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5"
                >
                  <div className="text-sm min-w-0">
                    <span className="font-medium text-primary">
                      {row.durationLabel}
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      — {row.priceEuros} € / semaine · unité
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Moins ${row.durationLabel}`}
                      onClick={() =>
                        setTier(row.minutes as 60 | 40 | 30, -1)
                      }
                      disabled={hourlyQty[row.minutes as 60 | 40 | 30] <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {hourlyQty[row.minutes as 60 | 40 | 30]}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Plus ${row.durationLabel}`}
                      onClick={() =>
                        setTier(row.minutes as 60 | 40 | 30, 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {needsCreneau && (
          <div className="space-y-2">
            <p className="font-medium text-primary text-sm">
              {mode === "FIXED_SLOTS"
                ? "Choisissez votre créneau"
                : "Choisissez un créneau proposé"}
            </p>
            <div className="grid gap-2 max-h-56 overflow-y-auto pr-1">
              {open.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCreneauId(c.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    creneauId === c.id
                      ? "border-secondary bg-secondary/10 ring-1 ring-secondary/30"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="font-medium text-primary block">{c.nom}</span>
                  <span className="text-gray-600 text-xs">
                    {normalizeJourneeSlots(c.journeeSlots, {
                      jours: c.jours,
                      heureDebut: c.heureDebut,
                      dureeMinutes: c.dureeMinutes,
                    })
                      .map(formatCreneauSlotLine)
                      .join(" · ")}{" "}
                    · {c.placesMax} places
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "FLEXIBLE_FORMATION" && open.length === 0 && (
          <p className="text-sm text-gray-600">
            Forfait unique : après paiement, vos horaires se fixent directement
            avec le professeur (aucun créneau à choisir ici).
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-gray-600">Total pour cette ligne</span>
          <span className="text-2xl font-bold text-primary">
            {unitPrice > 0 ? formatPrice(unitPrice) : "—"}
          </span>
        </div>

        {needsHourly && weeklyHourlyEuros > 0 ? (
          <p className="text-xs text-gray-500 -mt-2">
            <span className="font-medium text-primary">
              {formatHourlyBundleForDisplay(hourlyBundleForTotal, {
                omitPrice: true,
              })}
            </span>{" "}
            — prélevé chaque semaine.
          </p>
        ) : null}

        <Button
          onClick={handleAdd}
          disabled={!canAdd}
          className={cn(
            "w-full py-6 text-lg",
            !canAdd && "opacity-50 cursor-not-allowed"
          )}
          data-testid="add-to-cart-detail"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
}
