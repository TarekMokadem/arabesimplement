import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { NotreMethodeSection } from "@/components/home/NotreMethodeSection";
import { FormationCard } from "@/components/shop/FormationCard";
import { COURS_DARABE_HIGHLIGHT_SLUGS } from "@/lib/content/marketing-boutique-links";
import { getBoutiqueCardsBySlugs } from "@/lib/data/formations.service";

export default async function CoursDarabePage() {
  const highlights = await getBoutiqueCardsBySlugs(COURS_DARABE_HIGHLIGHT_SLUGS);

  return (
    <div className="pt-20">
      <PageHeader
        title="Cours d'arabe"
        subtitle="Découvrez notre méthode unique pour apprendre à lire l'arabe en seulement 10 leçons."
      />

      <section className="py-10 sm:py-16 md:py-20 bg-surface border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/15">
              Nos offres
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Formations mises en avant
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Trois parcours pour avancer pas à pas : lire l&apos;arabe, lire le
              Coran, puis devenir arabophone.
            </p>
          </div>

          {highlights.length === 0 ? (
            <p className="text-sm text-gray-500">
              Les formations seront bientôt disponibles dans la boutique.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {highlights.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
            </div>
          )}
        </div>
      </section>

      <NotreMethodeSection />
    </div>
  );
}
