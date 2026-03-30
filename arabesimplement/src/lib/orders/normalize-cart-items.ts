import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/store/cart.store";
import {
  hourlyPriceForMinutes,
  isValidHourlyMinutes,
} from "@/lib/scheduling-mode";
import type { FormationSchedulingMode } from "@/types/domain.types";
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

export type NormalizeCartResult =
  | { success: true; items: CartItem[]; totalEuros: number }
  | { success: false; error: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

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
  for (const id of formationIds) {
    if (!isUuid(id)) {
      return {
        success: false,
        error:
          "Votre panier contient d’anciennes données. Videz-le puis sélectionnez à nouveau vos formations dans la boutique.",
      };
    }
  }
  const formations = await prisma.formation.findMany({
    where: {
      id: { in: formationIds },
      statut: { in: ["ACTIVE", "COMING_SOON"] },
    },
    include: { creneaux: true },
  });
  const byId = new Map(formations.map((f) => [f.id, f]));

  const out: CartItem[] = [];
  let totalEuros = 0;

  for (const line of rawItems) {
    if (line.creneauId != null && line.creneauId !== "" && !isUuid(line.creneauId)) {
      return {
        success: false,
        error:
          "Créneau invalide dans le panier. Videz-le puis sélectionnez à nouveau vos options.",
      };
    }

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
      if (!c || c.statut !== "OPEN") {
        return {
          success: false,
          error: "Un créneau choisi n’est plus disponible. Actualisez la boutique.",
        };
      }
    }

    if (mode === "HOURLY_PURCHASE") {
      if (line.hourlyMinutes == null || !isValidHourlyMinutes(line.hourlyMinutes)) {
        return {
          success: false,
          error: "Durée de cours invalide dans le panier.",
        };
      }
      const euros = hourlyPriceForMinutes(line.hourlyMinutes);
      if (euros == null || euros <= 0) {
        return { success: false, error: "Tarif horaire introuvable." };
      }
      const creneau = effectiveCreneauId
        ? f.creneaux.find((x) => x.id === effectiveCreneauId)
        : undefined;
      const summaryParts = [
        `${line.hourlyMinutes} min — ${euros} €`,
        creneau ? formatCreneauLineFromDb(creneau) : undefined,
      ].filter(Boolean);
      const normalized: CartItem = {
        lineId: line.lineId,
        formationId: f.id,
        titre: f.titre,
        slug: f.slug,
        imageUrl: f.imageUrl ?? undefined,
        schedulingMode: mode,
        prix: euros,
        prixPromo: undefined,
        creneauId: effectiveCreneauId,
        hourlyMinutes: line.hourlyMinutes,
        choiceSummary: summaryParts.join(" · "),
      };
      out.push(normalized);
      totalEuros += euros;
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
