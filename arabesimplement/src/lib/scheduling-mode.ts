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

/** Durées facturables pour l’abonnement cours à la carte (plusieurs unités par durée). */
export const HOURLY_BUNDLE_MINUTES = [60, 40, 30] as const;
export type HourlyBundleMinutes = (typeof HOURLY_BUNDLE_MINUTES)[number];
export type HourlyDurationBundle = Partial<Record<HourlyBundleMinutes, number>>;

export function sumHourlyBundleEuros(bundle: HourlyDurationBundle): number {
  let s = 0;
  for (const m of HOURLY_BUNDLE_MINUTES) {
    const q = Math.max(0, Math.floor(bundle[m] ?? 0));
    if (q <= 0) continue;
    const p = hourlyPriceForMinutes(m);
    if (p == null) continue;
    s += p * q;
  }
  return s;
}

export function totalMinutesInHourlyBundle(bundle: HourlyDurationBundle): number {
  let t = 0;
  for (const m of HOURLY_BUNDLE_MINUTES) {
    const q = Math.max(0, Math.floor(bundle[m] ?? 0));
    t += q * m;
  }
  return t;
}

/** Texte court : « 2×1 h + 1×30 min (25 € / mois) » — sans montant si omitPrice. */
export function formatHourlyBundleForDisplay(
  bundle: HourlyDurationBundle,
  options?: { omitPrice?: boolean }
): string {
  const parts: string[] = [];
  for (const m of HOURLY_BUNDLE_MINUTES) {
    const q = Math.max(0, Math.floor(bundle[m] ?? 0));
    if (q <= 0) continue;
    const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === m);
    if (!row) continue;
    parts.push(`${q}×${row.durationLabel}`);
  }
  if (parts.length === 0) return "";
  const core = parts.join(" + ");
  if (options?.omitPrice) return core;
  const euros = sumHourlyBundleEuros(bundle);
  return `${core} (${euros} € / mois)`;
}

export function mergeHourlyBundles(
  a: HourlyDurationBundle | undefined,
  b: HourlyDurationBundle | undefined
): HourlyDurationBundle {
  const out: HourlyDurationBundle = {};
  for (const m of HOURLY_BUNDLE_MINUTES) {
    const sum =
      Math.max(0, Math.floor(a?.[m] ?? 0)) +
      Math.max(0, Math.floor(b?.[m] ?? 0));
    if (sum > 0) out[m] = sum;
  }
  return out;
}

export function emptyHourlyBundle(): Record<HourlyBundleMinutes, number> {
  return { 60: 0, 40: 0, 30: 0 };
}

export function schedulingModeTitle(mode: FormationSchedulingMode): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return "Cours à la carte — créneau récurrent chaque semaine, prélèvement mensuel";
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
      return "Prélèvement chaque mois · une séance récurrente (durée au choix, voir grille)";
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
        "avec le même montant prélevé chaque mois tant que vous suivez ce cours. " +
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
        "Paiement : chaque mois, selon la durée et le volume choisis (grille indicative 10 € / 8 € / 5 € par unité). " +
        "Ex. 1 h par semaine au créneau : rythme hebdomadaire, montant mensuel aligné sur votre sélection. L’horaire exact se confirme avec l’équipe."
      );
    default:
      return "";
  }
}

/** Fiche formation : 2–3 lignes max. sur le type de paiement (forfait, à la carte, etc.). */
export function schedulingModePaymentBrief(mode: FormationSchedulingMode): string {
  switch (mode) {
    case "FIXED_SLOTS":
      return "Paiement unique à l’achat. Créneau parmi ceux listés ci-dessous.";
    case "FLEXIBLE_FORMATION":
      return "Paiement unique. Les séances s’organisent avec le professeur après l’achat.";
    case "HOURLY_PURCHASE":
      return "Prélèvement chaque mois selon le nombre d’heures choisies au créneau. Les séances s’organisent avec le professeur après l’achat.";
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
      return "Séance hebdomadaire au créneau · prélèvement mensuel";
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
        "Les élèves sont prélevés chaque mois selon la durée et le volume choisis : les fiches peuvent illustrer " +
        "des créneaux types ou des liens WhatsApp ; vous pouvez aussi laisser vide."
      );
    default:
      return "";
  }
}
