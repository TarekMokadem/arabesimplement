/** Aligné sur l’enum Prisma `FormationSchedulingMode`. */
export type FormationSchedulingMode =
  | "HOURLY_PURCHASE"
  | "FLEXIBLE_FORMATION"
  | "FIXED_SLOTS";

/** Grille indicative cours particuliers / din (affichage boutique). */
export const HOURLY_SLOTS_PRICING = [
  { durationLabel: "1 heure", priceEuros: 10, minutes: 60 },
  { durationLabel: "40 minutes", priceEuros: 8, minutes: 40 },
  { durationLabel: "30 minutes", priceEuros: 5, minutes: 30 },
] as const;

const HOURLY_MINUTES = new Set(
  HOURLY_SLOTS_PRICING.map((r) => r.minutes) as number[]
);

export function isValidHourlyMinutes(minutes: number): boolean {
  return HOURLY_MINUTES.has(minutes);
}

export function hourlyPriceForMinutes(minutes: number): number | null {
  const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === minutes);
  return row ? row.priceEuros : null;
}

export function hourlyMinPriceEuros(): number {
  return Math.min(...HOURLY_SLOTS_PRICING.map((r) => r.priceEuros));
}

export function schedulingModeTitle(mode: FormationSchedulingMode): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return "Cours à la carte — même créneau chaque semaine, payé chaque semaine";
    case "FLEXIBLE_FORMATION":
      return "Paiement forfaitaire — organisation avec le professeur";
    case "FIXED_SLOTS":
    default:
      return "Créneaux proposés — calendrier à respecter";
  }
}

export function schedulingModeShortLabel(mode: FormationSchedulingMode): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return "Cours à la carte";
    case "FLEXIBLE_FORMATION":
      return "Paiement forfaitaire";
    case "FIXED_SLOTS":
    default:
      return "Créneaux proposés";
  }
}

/** Résumé affiché sous le badge sur les cartes boutique. */
export function schedulingModeBoutiquePriceShort(
  mode: FormationSchedulingMode
): string {
  switch (mode) {
    case "FIXED_SLOTS":
      return "Un seul paiement · créneaux imposés (délai / sessions)";
    case "FLEXIBLE_FORMATION":
      return "Un seul paiement · horaires libres avec le prof";
    case "HOURLY_PURCHASE":
      return "Paiement chaque semaine · une séance récurrente (durée au choix, voir grille)";
    default:
      return "";
  }
}

export function schedulingModeDescription(
  mode: FormationSchedulingMode
): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return (
        "Vous réservez une durée par séance (ex. 1 h) : c’est le même créneau chaque semaine, " +
        "avec le même montant prélevé chaque semaine tant que vous suivez ce cours. " +
        "Les horaires se finalisent avec l’équipe comme pour un forfait flexible."
      );
    case "FLEXIBLE_FORMATION":
      return (
        "Vous payez la formation une seule fois, puis vous arrangez vos cours " +
        "avec le professeur quand vous voulez jusqu’à la fin du parcours, sans liste " +
        "de créneaux obligatoires."
      );
    case "FIXED_SLOTS":
    default:
      return (
        "Vous payez aussi une seule fois, mais l’offre s’inscrit dans une période " +
        "et un calendrier : vous choisissez parmi les créneaux proposés et vous les respectez."
      );
  }
}

/** Encadré « comment ça se paie » (boutique / admin). */
export function schedulingModePaymentExplanation(
  mode: FormationSchedulingMode
): string {
  switch (mode) {
    case "FIXED_SLOTS":
      return (
        "Paiement : forfait unique. Ensuite vous sélectionnez l’un des créneaux affichés ; " +
        "les sessions ont une cadence et souvent une limite dans le temps fixée par la formation."
      );
    case "FLEXIBLE_FORMATION":
      return (
        "Paiement : forfait unique. Pas de créneaux imposés : après achat, vous coordonnez " +
        "directement avec le professeur pour planifier chaque séance jusqu’à la fin."
      );
    case "HOURLY_PURCHASE":
      return (
        "Paiement : chaque semaine, selon la durée de votre séance récurrente (grille indicative 10 € / 8 € / 5 €). " +
        "Ex. 1 h par semaine = le même créneau hebdo, 10 € par semaine. L’horaire exact se confirme avec l’équipe."
      );
    default:
      return "";
  }
}

/** Titre de la section liste des créneaux sur la fiche produit. */
export function schedulingModeBoutiqueCreneauxHeading(
  mode: FormationSchedulingMode
): string {
  switch (mode) {
    case "FIXED_SLOTS":
      return "Créneaux proposés — choisissez le vôtre";
    case "FLEXIBLE_FORMATION":
      return "Horaires indicatifs (optionnel)";
    case "HOURLY_PURCHASE":
      return "Exemples de créneaux / durées (indicatif)";
    default:
      return "Créneaux";
  }
}

/** Ligne « calendrier » sous les métadonnées fiche produit. */
export function schedulingModeBoutiqueCalendarHint(
  mode: FormationSchedulingMode
): string {
  switch (mode) {
    case "FIXED_SLOTS":
      return "Calendrier & créneaux à respecter";
    case "FLEXIBLE_FORMATION":
      return "Planning avec le professeur";
    case "HOURLY_PURCHASE":
      return "Séance hebdomadaire fixe · paiement chaque semaine";
    default:
      return "";
  }
}

/** Section admin : titre au-dessus de la liste des créneaux. */
export function schedulingModeAdminCreneauxTitle(
  mode: FormationSchedulingMode,
  count: number
): string {
  switch (mode) {
    case "FIXED_SLOTS":
      return `Créneaux proposés aux élèves (${count})`;
    case "FLEXIBLE_FORMATION":
      return `Créneaux indicatifs (${count}) — facultatif`;
    case "HOURLY_PURCHASE":
      return `Créneaux d’exemple (${count}) — facultatif`;
    default:
      return `Créneaux (${count})`;
  }
}

/**court encadré d’aide sous le titre admin. */
export function schedulingModeAdminCreneauxIntro(
  mode: FormationSchedulingMode
): string {
  switch (mode) {
    case "FIXED_SLOTS":
      return (
        "Renseignez ici les sessions que l’élève pourra choisir après son paiement unique. " +
        "C’est la référence officielle du calendrier."
      );
    case "FLEXIBLE_FORMATION":
      return (
        "Le forfait ne repose pas sur ces lignes : vous pouvez laisser la liste vide " +
        "ou ajouter des exemples (site, FAQ). Les élèves s’organisent avec le prof."
      );
    case "HOURLY_PURCHASE":
      return (
        "Les élèves paient chaque semaine selon la durée choisie : les fiches peuvent illustrer " +
        "des créneaux types ou des liens WhatsApp ; vous pouvez aussi laisser vide."
      );
    default:
      return "";
  }
}
