import type { FormationTheme } from "@prisma/client";
import type { BoutiqueThemeFilterTab } from "@/lib/content/formation-theme";

/** Représente visuellement un filtre boutique (arche + libellés), aligné sur le modèle HTML fourni. */
export type BoutiqueArchMeta = {
  archAr: string;
  archLabelEn: string;
  captionFr: string;
  /** Couleur « currentColor » pour bordure active / texte */
  toneClass: string;
  shapeBgClass: string;
  shapeBorderIdleClass: string;
  dotClass: string;
};

const ARCH_ALL: BoutiqueArchMeta = {
  archAr: "كل",
  archLabelEn: "tout",
  captionFr: "Tout voir",
  toneClass: "text-gray-600",
  shapeBgClass: "bg-gray-100",
  shapeBorderIdleClass: "border-gray-200",
  dotClass: "bg-gray-600",
};

const ARCH_ARABE: BoutiqueArchMeta = {
  archAr: "لغة",
  archLabelEn: "langue",
  captionFr: "Langue arabe",
  toneClass: "text-[#185FA5]",
  shapeBgClass: "bg-sky-50",
  shapeBorderIdleClass: "border-sky-200/70",
  dotClass: "bg-[#185FA5]",
};

const ARCH_RELIGION: BoutiqueArchMeta = {
  archAr: "دين",
  archLabelEn: "religion",
  captionFr: "Religion islamique",
  toneClass: "text-[#0F6E56]",
  shapeBgClass: "bg-emerald-50",
  shapeBorderIdleClass: "border-emerald-200/70",
  dotClass: "bg-[#0F6E56]",
};

const ARCH_MIX: BoutiqueArchMeta = {
  archAr: "معاً",
  archLabelEn: "mixte",
  captionFr: "Langue & religion",
  toneClass: "text-[#854F0B]",
  shapeBgClass: "bg-amber-50",
  shapeBorderIdleClass: "border-amber-200/70",
  dotClass: "bg-amber-700",
};

export function boutiqueArchMetaForFilterId(id: string): BoutiqueArchMeta {
  switch (id) {
    case "ALL":
      return ARCH_ALL;
    case "ARABE":
      return ARCH_ARABE;
    case "RELIGION":
      return ARCH_RELIGION;
    case "MIX":
      return ARCH_MIX;
    default:
      return ARCH_ALL;
  }
}

/** Styles carte formation : liseré, tag bilangue, filigrane. */
export type FormationCardCategoryVisual = {
  accentClass: string;
  tagContainerClass: string;
  tagDotClass: string;
  tagFr: string;
  tagAr: string;
  /** Path SVG unique par catégorie (viewBox 0 0 100 100) */
  watermarkPath: string;
};

export function formationCardCategoryVisual(
  theme: FormationTheme
): FormationCardCategoryVisual {
  switch (theme) {
    case "ARABE":
      return {
        accentClass: "bg-sky-600",
        tagContainerClass: "bg-sky-50 text-sky-900 border-sky-100/80",
        tagDotClass: "bg-sky-600",
        tagFr: "Langue",
        tagAr: "لغة",
        watermarkPath:
          "M50 0 L59 34 L93 22 L71 50 L93 78 L59 66 L50 100 L41 66 L7 78 L29 50 L7 22 L41 34 Z",
      };
    case "RELIGION":
      return {
        accentClass: "bg-emerald-700",
        tagContainerClass: "bg-emerald-50 text-emerald-900 border-emerald-100/80",
        tagDotClass: "bg-emerald-700",
        tagFr: "Religion",
        tagAr: "دين",
        watermarkPath:
          "M50 5 L55 22 L70 12 L62 28 L80 30 L65 40 L74 57 L57 52 L53 70 L50 52 L47 70 L43 52 L26 57 L35 40 L20 30 L38 28 L30 12 L45 22 Z",
      };
    case "MIX":
      return {
        accentClass: "bg-amber-600",
        tagContainerClass: "bg-amber-50 text-amber-950 border-amber-100/80",
        tagDotClass: "bg-amber-600",
        tagFr: "Mixte",
        tagAr: "معاً",
        watermarkPath:
          "M50 3 L61 37 L97 37 L69 58 L80 92 L50 71 L20 92 L31 58 L3 37 L39 37 Z",
      };
  }
}

/** Ruban sous les filtres : libellé + nombre affiché. */
export function boutiqueSectionDividerLabel(
  tabs: BoutiqueThemeFilterTab[],
  selectedId: string,
  count: number
): string {
  const tab = tabs.find((t) => t.id === selectedId);
  const label = tab?.label ?? "Formations";
  const unit = count <= 1 ? "formation" : "formations";
  return `${label} · ${count} ${unit}`;
}
