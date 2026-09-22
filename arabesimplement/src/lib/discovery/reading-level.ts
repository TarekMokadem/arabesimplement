/** Niveau de lecture déclaré dans le formulaire du cours découverte. */
export const DISCOVERY_READING_LEVELS = [
  {
    id: "LIT_AVEC_DIFFICULTE",
    label: "Je sais lire mais avec difficulté",
  },
  {
    id: "NE_SAIT_PAS_LIRE",
    label: "Je ne sais pas lire",
  },
  {
    id: "LIT_ET_VEUT_COMPRENDRE",
    label: "Je sais lire et je veux comprendre l'arabe",
  },
] as const;

export type DiscoveryReadingLevelId =
  (typeof DISCOVERY_READING_LEVELS)[number]["id"];

const LABELS = Object.fromEntries(
  DISCOVERY_READING_LEVELS.map((level) => [level.id, level.label])
) as Record<DiscoveryReadingLevelId, string>;

export function isDiscoveryReadingLevelId(
  value: string
): value is DiscoveryReadingLevelId {
  return discoveryReadingLevelsInclude(value);
}

export function discoveryReadingLevelsInclude(value: string): boolean {
  return DISCOVERY_READING_LEVELS.some((level) => level.id === value);
}

export function discoveryReadingLevelLabel(id: string): string {
  if (!isDiscoveryReadingLevelId(id)) return id;
  return LABELS[id];
}
