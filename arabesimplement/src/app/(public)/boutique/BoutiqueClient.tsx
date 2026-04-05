"use client";

import { useState, useMemo } from "react";
import { FormationCard } from "@/components/shop/FormationCard";
import { PageHeader } from "@/components/shared/PageHeader";
import type { FormationBoutiqueCard } from "@/types/domain.types";
import type { BoutiqueThemeFilterTab } from "@/lib/content/formation-theme";

interface BoutiqueClientProps {
  formations: FormationBoutiqueCard[];
  themeFilters: BoutiqueThemeFilterTab[];
}

export function BoutiqueClient({
  formations,
  themeFilters,
}: BoutiqueClientProps) {
  const [selectedFilterId, setSelectedFilterId] = useState<string>("ALL");

  const filteredFormations = useMemo(() => {
    const tab = themeFilters.find((t) => t.id === selectedFilterId);
    if (!tab?.theme) return formations;
    return formations.filter((f) => f.theme === tab.theme);
  }, [selectedFilterId, formations, themeFilters]);

  return (
    <div className="pt-20">
      <PageHeader
        title="Nos Formations"
        subtitle="Découvrez nos programmes d'apprentissage de l'arabe, adaptés à tous les niveaux."
      />

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-12">
            {themeFilters.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilterId(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilterId === tab.id
                    ? "bg-primary text-white"
                    : "bg-white text-primary hover:bg-primary hover:text-white"
                }`}
                data-testid={`filter-${tab.id.toLowerCase()}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-testid="formations-grid"
          >
            {filteredFormations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>

          {filteredFormations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Aucune formation dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
