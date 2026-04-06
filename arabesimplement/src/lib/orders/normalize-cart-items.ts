import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/store/cart.store";
import {
  HOURLY_BUNDLE_MINUTES,
  hourlyPriceForMinutes,
  isValidHourlyMinutes,
  sumHourlyBundleEuros,
  formatHourlyBundleForDisplay,
  type HourlyDurationBundle,
} from "@/lib/scheduling-mode";
import type { FormationSchedulingMode } from "@/types/domain.types";
import { creneauBookableFromCounts } from "@/lib/availability";
import {
  formatCreneauSummaryForCart,
  parseJourneeSlotsFromJson,
} from "@/lib/creneau-display";

function formatCreneauLineFromDb(c: {
  nom: string;
  jours: string[];
  heureDebut: string;
  dureeMinutes: number;
  journeeSlots: unknown;
}): string {
  return formatCreneauSummaryForCart(
    c.nom,
    parseJourneeSlotsFromJson(c.journeeSlots),
    {
      jours: c.jours,
      heureDebut: c.heureDebut,
      dureeMinutes: c.dureeMinutes,
    }
  );
}

function resolveHourlyBundleFromLine(line: CartItem): HourlyDurationBundle | null {
  if (line.hourlyBundle && Object.keys(line.hourlyBundle).length > 0) {
    const cleaned: HourlyDurationBundle = {};
    for (const m of HOURLY_BUNDLE_MINUTES) {
      const q = Math.floor(Number(line.hourlyBundle[m] ?? 0));
      if (q > 0) cleaned[m] = q;
    }
    return Object.keys(cleaned).length > 0 ? cleaned : null;
  }
  if (line.hourlyMinutes != null && isValidHourlyMinutes(line.hourlyMinutes)) {
    return { [line.hourlyMinutes]: 1 } as HourlyDurationBundle;
  }
  return null;
}

export type NormalizeCartResult =
  | { success: true; items: CartItem[]; totalEuros: number }
  | { success: false; error: string };

/**
 * Vérifie chaque ligne avec la BDD et recalcule prix / métadonnées (ne jamais faire
 * confiance aux montants envoyés par le client).
 */
export async function normalizeCartItemsForCheckout(
  rawItems: CartItem[]
): Promise<NormalizeCartResult> {
  if (rawItems.length === 0) {
    return { success: false, error: "Le panier est vide" };
  }

  const formationIds = [...new Set(rawItems.map((i) => i.formationId))];
  const formations = await prisma.formation.findMany({
    where: {
      id: { in: formationIds },
      statut: { in: ["ACTIVE", "COMING_SOON"] },
    },
    include: {
      creneaux: {
        include: { _count: { select: { enrollments: true } } },
      },
      _count: { select: { enrollments: true } },
    },
  });
  const byId = new Map(formations.map((f) => [f.id, f]));

  const out: CartItem[] = [];
  let totalEuros = 0;

  for (const line of rawItems) {
    const f = byId.get(line.formationId);
    if (!f) {
      return {
        success: false,
        error:
          "Une formation n’est plus disponible. Videz le panier et réessayez.",
      };
    }

    const mode = f.schedulingMode as FormationSchedulingMode;
    const openCreneaux = f.creneaux.filter((c) => c.statut === "OPEN");

    if (mode === "FIXED_SLOTS" && openCreneaux.length === 0) {
      return {
        success: false,
        error: `Aucun créneau ouvert pour « ${f.titre} ».`,
      };
    }

    const needsCreneau =
      mode === "FIXED_SLOTS" ||
      (mode === "HOURLY_PURCHASE" && openCreneaux.length > 0);

    const effectiveCreneauId = needsCreneau ? line.creneauId : undefined;

    if (needsCreneau) {
      if (!effectiveCreneauId) {
        return { success: false, error: "Créneau manquant pour une ligne du panier." };
      }
      const c = f.creneaux.find((x) => x.id === effectiveCreneauId);
      if (
        !c ||
        !creneauBookableFromCounts(
          c.statut,
          c.placesMax,
          c._count.enrollments
        )
      ) {
        return {
          success: false,
          error: "Un créneau choisi n’est plus disponible. Actualisez la boutique.",
        };
      }
    }

    if (mode === "HOURLY_PURCHASE") {
      const bundle = resolveHourlyBundleFromLine(line);
      if (!bundle) {
        return {
          success: false,
          error:
            "Indiquez au moins une durée (nombre de séances par semaine) pour chaque cours à la carte.",
        };
      }
      const weeklyTotal = sumHourlyBundleEuros(bundle);
      if (weeklyTotal <= 0) {
        return { success: false, error: "Montant hebdomadaire invalide." };
      }
      const creneau = effectiveCreneauId
        ? f.creneaux.find((x) => x.id === effectiveCreneauId)
        : undefined;
      const bundleLine = formatHourlyBundleForDisplay(bundle);
      const summaryParts = [
        bundleLine,
        creneau ? formatCreneauLineFromDb(creneau) : undefined,
      ].filter(Boolean);
      const normalized: CartItem = {
        lineId: line.lineId,
        formationId: f.id,
        titre: f.titre,
        slug: f.slug,
        imageUrl: f.imageUrl ?? undefined,
        schedulingMode: mode,
        prix: weeklyTotal,
        prixPromo: undefined,
        creneauId: effectiveCreneauId,
        hourlyBundle: bundle,
        choiceSummary: summaryParts.join(" · "),
      };
      out.push(normalized);
      totalEuros += weeklyTotal;
      continue;
    }

    const prix = Number(f.prix);
    const promo = f.prixPromo != null ? Number(f.prixPromo) : undefined;
    if (!prix || prix <= 0) {
      return {
        success: false,
        error: `Prix non configuré pour « ${f.titre} ».`,
      };
    }
    const unit = promo != null && promo > 0 ? promo : prix;
    const creneau = effectiveCreneauId
      ? f.creneaux.find((x) => x.id === effectiveCreneauId)
      : undefined;
    const choiceSummary =
      creneau != null
        ? formatCreneauLineFromDb(creneau)
        : mode === "FLEXIBLE_FORMATION"
          ? "Forfait — organisation avec le professeur"
          : undefined;

    const normalized: CartItem = {
      lineId: line.lineId,
      formationId: f.id,
      titre: f.titre,
      slug: f.slug,
      imageUrl: f.imageUrl ?? undefined,
      schedulingMode: mode,
      prix,
      prixPromo: promo != null && promo > 0 && promo < prix ? promo : undefined,
      creneauId: effectiveCreneauId,
      hourlyMinutes: undefined,
      choiceSummary,
    };
    out.push(normalized);
    totalEuros += unit;
  }

  if (totalEuros <= 0) {
    return { success: false, error: "Montant de commande invalide" };
  }

  return { success: true, items: out, totalEuros };
}
