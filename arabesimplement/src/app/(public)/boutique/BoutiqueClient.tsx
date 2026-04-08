"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  LayoutGroup,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { FormationCard } from "@/components/shop/FormationCard";
import { BoutiqueArchFilters } from "@/components/shop/BoutiqueArchFilters";
import { PageHeader } from "@/components/shared/PageHeader";
import type { FormationBoutiqueCard } from "@/types/domain.types";
import type { BoutiqueThemeFilterTab } from "@/lib/content/formation-theme";
import { boutiqueSectionDividerLabel } from "@/lib/content/boutique-category-visual";

interface BoutiqueClientProps {
  formations: FormationBoutiqueCard[];
  themeFilters: BoutiqueThemeFilterTab[];
}

export function BoutiqueClient({
  formations,
  themeFilters,
}: BoutiqueClientProps) {
  const [selectedFilterId, setSelectedFilterId] = useState<string>("ALL");
  /** Après le 1er rendu : les cartes qui apparaissent au changement de filtre jouent l’entrée (pop + léger wobble). */
  const [filterEnterAnimationsReady, setFilterEnterAnimationsReady] =
    useState(false);
  useEffect(() => {
    setFilterEnterAnimationsReady(true);
  }, []);
  const reduceMotion = useReducedMotion();

  const filteredFormations = useMemo(() => {
    const tab = themeFilters.find((t) => t.id === selectedFilterId);
    if (!tab?.theme) return formations;
    return formations.filter((f) => f.theme === tab.theme);
  }, [selectedFilterId, formations, themeFilters]);

  return (
    <div className="pt-20">
      <PageHeader
        title="Boutique des formations"
        subtitle="Parcours en langue arabe et en sciences religieuses. Choisissez un domaine ci-dessous, puis ouvrez une fiche pour le détail et l’achat."
      >
        <p
          className="mt-5 text-sm text-gray-400 font-arabic leading-relaxed"
          dir="rtl"
        >
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <p className="mt-2 text-gray-300 text-sm md:text-base max-w-2xl">
          Choisissez votre parcours ·{" "}
          <span className="font-arabic text-[1.05em]" dir="rtl">
            اختر مسارك
          </span>
        </p>
        <p className="mt-6 text-gray-200 text-sm md:text-base max-w-2xl leading-relaxed">
          Pas sûr(e) de votre choix ?{" "}
          <Link
            href="/par-ou-commencer"
            className="text-secondary font-semibold underline underline-offset-4 decoration-secondary/80 hover:text-white hover:decoration-white"
          >
            Par où commencer
          </Link>{" "}
          — repères selon votre objectif (lecture, tajwid, invocations…).
        </p>
      </PageHeader>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <BoutiqueArchFilters
            tabs={themeFilters}
            selectedId={selectedFilterId}
            onSelect={setSelectedFilterId}
          />

          <div className="mb-10">
            <div className="flex items-center gap-3" aria-hidden>
              <div className="flex-1 h-px bg-gray-200" />
              <svg
                width="48"
                height="16"
                viewBox="0 0 48 16"
                className="shrink-0 text-primary/35"
              >
                <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.35" />
                <path
                  d="M24 2 L26.5 8.5 L24 15 L21.5 8.5 Z"
                  fill="currentColor"
                  opacity="0.28"
                />
                <path
                  d="M19 8 L25.5 5.5 L32 8 L25.5 10.5 Z"
                  fill="currentColor"
                  opacity="0.28"
                />
                <circle cx="40" cy="8" r="2" fill="currentColor" opacity="0.35" />
              </svg>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3 tabular-nums">
              {boutiqueSectionDividerLabel(
                themeFilters,
                selectedFilterId,
                filteredFormations.length
              )}
            </p>
          </div>

          <LayoutGroup id="boutique-formations-grid">
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              data-testid="formations-grid"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredFormations.map((formation) => (
                  <motion.div
                    key={formation.id}
                    layout={!reduceMotion}
                    initial={
                      filterEnterAnimationsReady && !reduceMotion
                        ? {
                            opacity: 0,
                            scale: 0.88,
                            y: 28,
                            rotate: -4,
                          }
                        : false
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      rotate: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.94,
                      transition: {
                        opacity: { duration: 0.15, ease: "easeIn" },
                        scale: { duration: 0.15, ease: "easeIn" },
                      },
                    }}
                    transition={{
                      layout: reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                            mass: 0.85,
                          },
                      opacity: { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] },
                      scale: reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 460,
                            damping: 22,
                          },
                      y: reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 420,
                            damping: 28,
                          },
                      rotate: reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 220,
                            damping: 9,
                          },
                    }}
                    className="h-full min-w-0"
                  >
                    <FormationCard formation={formation} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>

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
