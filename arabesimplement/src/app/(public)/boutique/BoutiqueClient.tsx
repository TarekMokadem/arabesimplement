"use client";

import { useState, useMemo } from "react";
import { FormationCard } from "@/components/shop/FormationCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { MOCK_FORMATIONS, FORMATION_CATEGORIES } from "@/lib/data/formations.mock";
import type { Formation } from "@/types/domain.types";

export function BoutiqueClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");

  const filteredFormations = useMemo(() => {
    if (selectedCategory === "Toutes") return MOCK_FORMATIONS;
    return MOCK_FORMATIONS.filter((f) => f.categorie === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="pt-20">
      <PageHeader
        title="Nos Formations"
        subtitle="Découvrez nos programmes d'apprentissage de l'arabe, adaptés à tous les niveaux."
      />

      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-12">
            {FORMATION_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#0F2A45] text-white"
                    : "bg-white text-[#0F2A45] hover:bg-[#0F2A45] hover:text-white"
                }`}
                data-testid={`filter-${category.toLowerCase()}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-testid="formations-grid"
          >
            {filteredFormations.map((formation: Formation) => (
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
