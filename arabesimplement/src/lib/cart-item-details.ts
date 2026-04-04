import type { CartItem } from "@/store/cart.store";
import {
  HOURLY_SLOTS_PRICING,
  formatHourlyBundleForDisplay,
} from "@/lib/scheduling-mode";

function hourlyLine(minutes: number): string | null {
  const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === minutes);
  if (!row) return null;
  return `Durée : ${row.durationLabel} — ${row.priceEuros} € / semaine`;
}

/** True if ce extrait du choiceSummary duplique déjà le bloc bundle / durée. */
function isRedundantHourlySegment(segment: string, item: CartItem): boolean {
  if (item.hourlyBundle && Object.keys(item.hourlyBundle).length > 0) {
    const bl = formatHourlyBundleForDisplay(item.hourlyBundle);
    if (bl && (segment === bl || segment.startsWith(bl.split("(")[0].trim()))) {
      return true;
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
      lines.push(
        "Cours à la carte — même créneau type chaque semaine, montant total prélevé chaque semaine"
      );
      if (item.hourlyBundle && Object.keys(item.hourlyBundle).length > 0) {
        const t = formatHourlyBundleForDisplay(item.hourlyBundle);
        if (t) lines.push(t);
      } else if (item.hourlyMinutes != null) {
        const h = hourlyLine(item.hourlyMinutes);
        if (h) lines.push(h);
      }
      break;
    case "FLEXIBLE_FORMATION":
      lines.push("Forfait unique — horaires à organiser avec le professeur");
      break;
    case "FIXED_SLOTS":
      lines.push("Forfait unique — créneau parmi les sessions proposées");
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
      if (lines.includes(part)) continue;
      lines.push(part);
    }
  }

  return lines;
}
