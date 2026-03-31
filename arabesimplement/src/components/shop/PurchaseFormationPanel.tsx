"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { buildCartItemFromSelection } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";
import type { FormationCartInput } from "@/types/domain.types";
import type { Creneau } from "@/types/domain.types";
import { HOURLY_SLOTS_PRICING } from "@/lib/scheduling-mode";
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
  const [hourlyMinutes, setHourlyMinutes] = useState<number | null>(null);

  const mode = formation.schedulingMode;

  const needsCreneau =
    mode === "FIXED_SLOTS" ||
    (mode === "HOURLY_PURCHASE" && open.length > 0);

  const needsHourly = mode === "HOURLY_PURCHASE";

  const unitPrice = useMemo(() => {
    if (mode === "HOURLY_PURCHASE") {
      const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === hourlyMinutes);
      return row?.priceEuros ?? 0;
    }
    const p = Number(formation.prix);
    const promo =
      formation.prixPromo != null ? Number(formation.prixPromo) : undefined;
    if (promo != null && promo > 0 && (!p || promo <= p)) return promo;
    return p;
  }, [mode, hourlyMinutes, formation.prix, formation.prixPromo]);

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
    (needsHourly ? hourlyMinutes != null : true) &&
    (needsCreneau ? !!creneauId : true);

  const buildChoiceSummary = (): string => {
    const parts: string[] = [];
    if (needsHourly && hourlyMinutes != null) {
      const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === hourlyMinutes);
      if (row) {
        parts.push(
          `Durée : ${row.durationLabel} — ${row.priceEuros} € / semaine`
        );
      }
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
    const item = buildCartItemFromSelection({
      formationId: formation.id,
      titre: formation.titre,
      slug: formation.slug,
      imageUrl: formation.imageUrl,
      schedulingMode: mode,
      unitEuros: unitPrice,
      creneauId: creneauId ?? undefined,
      choiceSummary: buildChoiceSummary(),
      hourlyMinutes: needsHourly ? hourlyMinutes ?? undefined : undefined,
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
          <div className="space-y-2">
            <p className="font-medium text-primary text-sm">
              Durée de la séance hebdomadaire (montant par semaine)
            </p>
            <div className="grid gap-2">
              {HOURLY_SLOTS_PRICING.map((row) => (
                <button
                  key={row.minutes}
                  type="button"
                  onClick={() => setHourlyMinutes(row.minutes)}
                  className={cn(
                    "flex justify-between items-center rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    hourlyMinutes === row.minutes
                      ? "border-secondary bg-secondary/10 ring-1 ring-secondary/30"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span>{row.durationLabel}</span>
                  <span className="font-semibold text-primary">
                    {row.priceEuros} €
                  </span>
                </button>
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
