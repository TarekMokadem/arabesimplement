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

export function schedulingModeTitle(mode: FormationSchedulingMode): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return "Cours à la carte (durées & tarifs)";
    case "FLEXIBLE_FORMATION":
      return "Formation : paiement unique, planning avec le professeur";
    case "FIXED_SLOTS":
    default:
      return "Créneaux horaires à choisir";
  }
}

export function schedulingModeShortLabel(mode: FormationSchedulingMode): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return "À l’heure";
    case "FLEXIBLE_FORMATION":
      return "Formation flexible";
    case "FIXED_SLOTS":
    default:
      return "Créneaux fixes";
  }
}

export function schedulingModeDescription(
  mode: FormationSchedulingMode
): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return (
        "Idéal pour le cours particulier ou le cours de din : vous achetez des créneaux " +
        "avec une grille de tarifs adaptée à la durée (voir ci-dessous). Vous convenez des horaires avec l’équipe."
      );
    case "FLEXIBLE_FORMATION":
      return (
        "Vous réglez la formation une seule fois, puis vous organisez vos séances " +
        "directement avec votre professeur jusqu’à la fin du parcours, selon vos disponibilités."
      );
    case "FIXED_SLOTS":
    default:
      return (
        "Après inscription, vous choisissez l’un des créneaux proposés ci-dessous " +
        "pour suivre les cours en groupe (ou selon le calendrier affiché)."
      );
  }
}
