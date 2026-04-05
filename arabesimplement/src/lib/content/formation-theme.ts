import type { FormationTheme } from "@prisma/client";

/** Libellés boutique / fiches (domaine pédagogique principal). */
export function formationThemeLabel(theme: FormationTheme): string {
  switch (theme) {
    case "ARABE":
      return "Arabe";
    case "RELIGION":
      return "Religion";
    case "MIX":
      return "Pack mixte";
    default:
      return theme;
  }
}

export type BoutiqueThemeFilterTab = {
  /** Valeur stable pour l’état UI et data-testid */
  id: string;
  label: string;
  theme: FormationTheme | null;
};

/** Onglets de filtre boutique : les deux domaines + option pack mixte si au moins une formation. */
export function getBoutiqueThemeFilterTabs(
  themes: FormationTheme[]
): BoutiqueThemeFilterTab[] {
  const hasMix = themes.includes("MIX");
  const tabs: BoutiqueThemeFilterTab[] = [
    { id: "ALL", label: "Toutes", theme: null },
    { id: "ARABE", label: "Arabe", theme: "ARABE" },
    { id: "RELIGION", label: "Religion", theme: "RELIGION" },
  ];
  if (hasMix) {
    tabs.push({ id: "MIX", label: "Pack mixte", theme: "MIX" });
  }
  return tabs;
}
