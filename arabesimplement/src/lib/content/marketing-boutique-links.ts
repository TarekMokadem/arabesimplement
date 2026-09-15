/**
 * Slugs des fiches `/boutique/[slug]` utilisés par le footer et les pages vitrine.
 * Si une formation est renommée dans l’admin, alignez ces constantes pour éviter des 404.
 */
export const MARKETING_BOUTIQUE_SLUGS = {
  /** Formation lecture arabe (équivalent ancien « lire en 10 leçons »). */
  lectureArabe: "apprendre-a-lire-l-arabe-en-10-lecons",
  /** Invocations matin & soir (fiche boutique en production). */
  invocationsMatinSoir: "les-invocations-matin-et-soir",
  /**
   * Parcours Tajwid / récitation : la fiche dédiée n'est pas publiée en
   * production, on redirige vers la fiche « Lire le Coran en 10 leçons »
   * (la page contenu `/tajwid` reste disponible séparément).
   */
  tajwid: "apprends-a-lire-le-coran",
  lireCoran: "apprends-a-lire-le-coran",
} as const;

/** Ordre des 3 formations mises en avant sur `/cours-darabe`. */
export const COURS_DARABE_HIGHLIGHT_SLUGS = [
  MARKETING_BOUTIQUE_SLUGS.lectureArabe,
  MARKETING_BOUTIQUE_SLUGS.lireCoran,
  MARKETING_BOUTIQUE_SLUGS.invocationsMatinSoir,
] as const;

export function boutiqueFormationHref(slug: string): string {
  return `/boutique/${slug}`;
}
