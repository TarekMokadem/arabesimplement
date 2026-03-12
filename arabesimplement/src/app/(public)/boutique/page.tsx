import { FormationCard } from "@/components/shop/FormationCard";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Formation } from "@/types/domain.types";

// Mock data - sera remplacé par les données Prisma
const mockFormations: Formation[] = [
  {
    id: "1",
    titre: "Lire l'arabe en 10 leçons",
    slug: "lire-en-10-lecons",
    descriptionCourte:
      "Apprenez à lire l'arabe en seulement 10 leçons avec notre méthode révolutionnaire.",
    description: "",
    prix: 8,
    prixPromo: undefined,
    imageUrl:
      "https://images.unsplash.com/photo-1622228862102-d691d3e2a334?w=600&q=80",
    placesMax: 50,
    categorie: "Lecture",
    statut: "ACTIVE",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    titre: "Sessions Invocations du matin et du soir",
    slug: "sessions-invocations",
    descriptionCourte:
      "Mémorisez et comprenez les invocations quotidiennes avec accompagnement personnalisé.",
    description: "",
    prix: 25,
    prixPromo: undefined,
    imageUrl:
      "https://images.unsplash.com/photo-1756808862471-46ad2f6c6fc0?w=600&q=80",
    placesMax: 20,
    categorie: "Invocations",
    statut: "ACTIVE",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    titre: "Formation Tajwid complète",
    slug: "formation-tajwid",
    descriptionCourte:
      "Maîtrisez les règles de récitation du Coran avec notre formation Tajwid approfondie.",
    description: "",
    prix: 75,
    prixPromo: 49,
    imageUrl:
      "https://images.unsplash.com/photo-1769428197773-e4adbe22aa8e?w=600&q=80",
    placesMax: 12,
    categorie: "Tajwid",
    statut: "ACTIVE",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function BoutiquePage() {
  // TODO: Replace with Prisma query
  // const formations = await prisma.formation.findMany({
  //   where: { statut: { in: ['ACTIVE', 'COMING_SOON'] } },
  //   orderBy: { createdAt: 'desc' }
  // });
  const formations = mockFormations;

  return (
    <div className="pt-20">
      <PageHeader
        title="Nos Formations"
        subtitle="Découvrez nos programmes d'apprentissage de l'arabe, adaptés à tous les niveaux."
      />

      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filters - TODO: Add category filters */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button className="px-6 py-2 bg-[#0F2A45] text-white rounded-full text-sm font-medium">
              Toutes
            </button>
            <button className="px-6 py-2 bg-white text-[#0F2A45] rounded-full text-sm font-medium hover:bg-[#0F2A45] hover:text-white transition-colors">
              Lecture
            </button>
            <button className="px-6 py-2 bg-white text-[#0F2A45] rounded-full text-sm font-medium hover:bg-[#0F2A45] hover:text-white transition-colors">
              Tajwid
            </button>
            <button className="px-6 py-2 bg-white text-[#0F2A45] rounded-full text-sm font-medium hover:bg-[#0F2A45] hover:text-white transition-colors">
              Invocations
            </button>
          </div>

          {/* Formations Grid */}
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-testid="formations-grid"
          >
            {formations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>

          {formations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Aucune formation disponible pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
