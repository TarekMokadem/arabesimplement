"use client";

import { cn } from "@/lib/utils";
import type { BoutiqueThemeFilterTab } from "@/lib/content/formation-theme";
import { boutiqueArchMetaForFilterId } from "@/lib/content/boutique-category-visual";

type BoutiqueArchFiltersProps = {
  tabs: BoutiqueThemeFilterTab[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function BoutiqueArchFilters({
  tabs,
  selectedId,
  onSelect,
}: BoutiqueArchFiltersProps) {
  return (
    <div
      className="flex flex-wrap gap-3 sm:gap-4 justify-center items-end mb-10"
      role="tablist"
      aria-label="Filtrer les formations par domaine"
    >
      {tabs.map((tab) => {
        const meta = boutiqueArchMetaForFilterId(tab.id);
        const selected = selectedId === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            id={`filter-${tab.id.toLowerCase()}`}
            data-testid={`filter-${tab.id.toLowerCase()}`}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "group flex flex-col items-center gap-0 bg-transparent border-0 cursor-pointer p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded-md",
              meta.toneClass
            )}
          >
            <div
              className={cn(
                "w-[70px] sm:w-[84px] h-[92px] sm:h-[110px] rounded-t-[35px] sm:rounded-t-[42px] border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 overflow-hidden",
                meta.shapeBgClass,
                selected
                  ? "border-current shadow-sm -translate-y-1"
                  : cn(meta.shapeBorderIdleClass, "group-hover:-translate-y-1")
              )}
            >
              <span
                className="font-arabic text-2xl sm:text-[28px] leading-none"
                dir="rtl"
              >
                {meta.archAr}
              </span>
              <span
                className={cn(
                  "text-[9px] uppercase tracking-[0.05em] font-medium",
                  selected ? "opacity-90" : "opacity-70"
                )}
              >
                {meta.archLabelEn}
              </span>
            </div>
            <div
              className={cn(
                "w-[70px] sm:w-[84px] h-2.5 border-l border-r border-b transition-colors duration-200",
                selected ? "border-current" : meta.shapeBorderIdleClass
              )}
            />
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full mt-1.5 transition-opacity duration-200",
                meta.dotClass,
                selected ? "opacity-100" : "opacity-0"
              )}
            />
            <span className="text-[11px] text-gray-500 text-center max-w-[84px] mt-1.5 leading-snug px-0.5">
              {meta.captionFr}
            </span>
          </button>
        );
      })}
    </div>
  );
}
