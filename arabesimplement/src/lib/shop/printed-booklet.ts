import { MARKETING_BOUTIQUE_SLUGS } from "@/lib/content/marketing-boutique-links";

/** Supplément unique pour l’envoi du livret imprimé. */
export const PRINTED_BOOKLET_EUROS = 20;

/** Le livret papier n’est proposé que pour Devenir Arabophone. */
export function printedBookletIsOffered(slug: string): boolean {
  return slug === MARKETING_BOUTIQUE_SLUGS.devenirArabophone;
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
