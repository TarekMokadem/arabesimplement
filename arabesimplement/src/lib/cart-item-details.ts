import type { CartItem } from "@/store/cart.store";
import {
  HOURLY_SLOTS_PRICING,
  formatHourlyBundleForDisplay,
  schedulingModeCartHeadline,
  type FormationSchedulingMode,
} from "@/lib/scheduling-mode";

/** Anciens libellés panier encore présents dans `choiceSummary` (localStorage). */
function isStaleSchedulingHeadline(
  segment: string,
  mode: FormationSchedulingMode
): boolean {
  const headline = schedulingModeCartHeadline(mode);
  if (segment === headline) return true;
  if (mode !== "HOURLY_PURCHASE") return false;
  const stale = [
    "cours à la carte",
    "cours a la carte",
    "créneau récurrent",
    "creneau recurrent",
    "prélevé chaque mois",
    "preleve chaque mois",
    "montant total prélevé",
    "montant total preleve",
  ];
  const lower = segment.toLowerCase();
  return stale.some((s) => lower.includes(s));
}

function hourlyLine(minutes: number): string | null {
  const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === minutes);
  if (!row) return null;
  return `Durée : ${row.durationLabel} — ${row.priceEuros} € / mois`;
}

function foldForCompare(s: string): string {
  return s.replace(/×/g, "x").replace(/\s+/g, " ").trim().toLowerCase();
}

/** True if ce extrait du choiceSummary duplique déjà le bloc bundle / durée. */
function isRedundantHourlySegment(segment: string, item: CartItem): boolean {
  if (item.hourlyBundle && Object.keys(item.hourlyBundle).length > 0) {
    const bl = formatHourlyBundleForDisplay(item.hourlyBundle);
    if (bl) {
      const foldedSeg = foldForCompare(segment);
      const foldedBl = foldForCompare(bl);
      const blCore = foldForCompare(bl.split("—")[0] ?? bl.split("(")[0] ?? bl);
      if (
        foldedSeg === foldedBl ||
        foldedSeg.startsWith(blCore) ||
        foldedSeg.includes(blCore)
      ) {
        return true;
      }
    }
  }
  if (item.hourlyMinutes == null) return false;
  const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === item.hourlyMinutes);
  if (!row) return false;
  const hasDuration =
    segment.includes(row.durationLabel) ||
    segment.includes(`${item.hourlyMinutes} min`) ||
    segment.includes(`${item.hourlyMinutes}min`);
  const hasPrice = segment.includes(`${row.priceEuros}`);
  return hasDuration && (hasPrice || segment.includes("€"));
}

/**
 * Lignes à afficher sous le titre produit (panier, checkout).
 * Évite les doublons entre résumé structuré et `choiceSummary`.
 */
export function getCartItemDetailLines(item: CartItem): string[] {
  const lines: string[] = [];

  switch (item.schedulingMode) {
    case "HOURLY_PURCHASE":
      lines.push(schedulingModeCartHeadline("HOURLY_PURCHASE"));
      if (item.hourlyBundle && Object.keys(item.hourlyBundle).length > 0) {
        const t = formatHourlyBundleForDisplay(item.hourlyBundle);
        if (t) lines.push(t);
      } else if (item.hourlyMinutes != null) {
        const h = hourlyLine(item.hourlyMinutes);
        if (h) lines.push(h);
      }
      break;
    case "FLEXIBLE_FORMATION":
      lines.push(schedulingModeCartHeadline("FLEXIBLE_FORMATION"));
      break;
    case "FIXED_SLOTS":
      lines.push(schedulingModeCartHeadline("FIXED_SLOTS"));
      break;
    default:
      break;
  }

  if (item.choiceSummary) {
    const parts = item.choiceSummary
      .split(" · ")
      .map((p) => p.trim())
      .filter(Boolean);
    for (const part of parts) {
      if (
        item.schedulingMode === "HOURLY_PURCHASE" &&
        isRedundantHourlySegment(part, item)
      ) {
        continue;
      }
      if (isStaleSchedulingHeadline(part, item.schedulingMode)) continue;
      if (lines.includes(part)) continue;
      lines.push(part);
    }
  }

  return lines;
}
