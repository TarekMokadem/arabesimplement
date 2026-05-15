/**
 * Slugs des fiches `/boutique/[slug]` utilisés par le footer et les pages vitrine.
 * Si une formation est renommée dans l’admin, alignez ces constantes pour éviter des 404.
 */
export const MARKETING_BOUTIQUE_SLUGS = {
  /** Formation lecture arabe (équivalent ancien « lire en 10 leçons »). */
  lectureArabe: "apprendre-a-lire-l-arabe-en-10-lecons",
  /** Invocations matin & soir (fiche boutique en production). */
  invocationsMatinSoir: "les-invocations-matin-et-soir",
  /** Fiche Tajwid en boutique (la page contenu `/tajwid` reste disponible séparément). */
  tajwid: "formation-tajwid",
} as const;

export function boutiqueFormationHref(slug: string): string {
  return `/boutique/${slug}`;
}
