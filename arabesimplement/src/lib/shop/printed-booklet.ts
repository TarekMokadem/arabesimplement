import type { FormationSchedulingMode } from "@/types/domain.types";

/** Supplément unique pour l’envoi du livret imprimé. */
export const PRINTED_BOOKLET_EUROS = 20;

export function printedBookletIsOffered(
  mode: FormationSchedulingMode
): boolean {
  return mode === "FLEXIBLE_FORMATION" || mode === "FIXED_SLOTS";
}

export function printedBookletSurchargeEuros(wantsBooklet: boolean): number {
  return wantsBooklet ? PRINTED_BOOKLET_EUROS : 0;
}

export function printedBookletOptionalLabel(): string {
  return "Supplément facultatif";
}

export function printedBookletBenefitText(): string {
  return "Profitez de votre support de cours en version papier pour suivre les leçons, prendre des notes et réviser plus facilement.";
}

export function printedBookletDeliveryLabel(): string {
  return "Livraison à domicile";
}

export function printedBookletCartLabel(): string {
  return `Livret imprimé (+${PRINTED_BOOKLET_EUROS} €)`;
}
