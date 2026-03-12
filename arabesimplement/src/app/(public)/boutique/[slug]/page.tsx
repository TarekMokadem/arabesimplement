import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart, Clock, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import type { Formation, Creneau } from "@/types/domain.types";
import { AddToCartButton } from "./AddToCartButton";

// Mock data - sera remplacé par Prisma
const mockFormations: Record<string, Formation & { creneaux: Creneau[] }> = {
  "lire-en-10-lecons": {
    id: "1",
    titre: "Lire l'arabe en 10 leçons",
    slug: "lire-en-10-lecons",
    descriptionCourte:
      "Apprenez à lire l'arabe en seulement 10 leçons avec notre méthode révolutionnaire.",
    description: `
      <h3>Une méthode unique pour apprendre à lire l'arabe</h3>
      <p>Notre programme "Lire l'arabe en 10 leçons" est le fruit de plusieurs années d'expérience dans l'enseignement de l'arabe aux francophones.</p>
      
      <h4>Ce que vous allez apprendre :</h4>
      <ul>
        <li>Les 28 lettres de l'alphabet arabe</li>
        <li>Les voyelles courtes et longues</li>
        <li>Les règles de liaison entre les lettres</li>
        <li>La lecture fluide de textes simples</li>
      </ul>
      
      <h4>Méthode pédagogique :</h4>
      <p>Chaque leçon est construite de manière progressive, avec des exercices pratiques et des supports audio pour perfectionner votre prononciation.</p>
    `,
    prix: 8,
    prixPromo: undefined,
    imageUrl:
      "https://images.unsplash.com/photo-1622228862102-d691d3e2a334?w=1200&q=80",
    placesMax: 50,
    categorie: "Lecture",
    statut: "ACTIVE",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    creneaux: [
      {
        id: "c1",
        formationId: "1",
        nom: "Session Matin",
        jours: ["Lundi", "Mercredi"],
        heureDebut: "10:00",
        dureeMinutes: 60,
        placesMax: 12,
        statut: "OPEN",
        createdAt: new Date(),
      },
      {
        id: "c2",
        formationId: "1",
        nom: "Session Soir",
        jours: ["Mardi", "Jeudi"],
        heureDebut: "20:00",
        dureeMinutes: 60,
        placesMax: 12,
        statut: "OPEN",
        createdAt: new Date(),
      },
    ],
  },
  "sessions-invocations": {
    id: "2",
    titre: "Sessions Invocations du matin et du soir",
    slug: "sessions-invocations",
    descriptionCourte:
      "Mémorisez et comprenez les invocations quotidiennes avec accompagnement personnalisé.",
    description: `
      <h3>Mémorisez les invocations essentielles</h3>
      <p>Les adhkâr (invocations) du matin et du soir sont une protection et une bénédiction pour chaque musulman.</p>
      
      <h4>Programme :</h4>
      <ul>
        <li>Apprentissage des invocations du matin</li>
        <li>Apprentissage des invocations du soir</li>
        <li>Compréhension du sens de chaque invocation</li>
        <li>Prononciation correcte en arabe</li>
      </ul>
    `,
    prix: 25,
    prixPromo: undefined,
    imageUrl:
      "https://images.unsplash.com/photo-1756808862471-46ad2f6c6fc0?w=1200&q=80",
    placesMax: 20,
    categorie: "Invocations",
    statut: "ACTIVE",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    creneaux: [
      {
        id: "c3",
        formationId: "2",
        nom: "Session Weekend",
        jours: ["Samedi"],
        heureDebut: "14:00",
        dureeMinutes: 90,
        placesMax: 20,
        statut: "OPEN",
        createdAt: new Date(),
      },
    ],
  },
  "formation-tajwid": {
    id: "3",
    titre: "Formation Tajwid complète",
    slug: "formation-tajwid",
    descriptionCourte:
      "Maîtrisez les règles de récitation du Coran avec notre formation Tajwid approfondie.",
    description: `
      <h3>Maîtrisez l'art de la récitation coranique</h3>
      <p>Le tajwid est l'ensemble des règles permettant de réciter le Coran comme il a été révélé au Prophète ﷺ.</p>
      
      <h4>Contenu de la formation :</h4>
      <ul>
        <li>Les règles du Noun sakin et Tanwin</li>
        <li>Les règles du Mim sakin</li>
        <li>Les prolongations (Madd)</li>
        <li>Les arrêts et pauses</li>
        <li>Application pratique sur des sourates</li>
      </ul>
    `,
    prix: 75,
    prixPromo: 49,
    imageUrl:
      "https://images.unsplash.com/photo-1769428197773-e4adbe22aa8e?w=1200&q=80",
    placesMax: 12,
    categorie: "Tajwid",
    statut: "ACTIVE",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    creneaux: [
      {
        id: "c4",
        formationId: "3",
        nom: "Groupe Intensif",
        jours: ["Lundi", "Mercredi", "Vendredi"],
        heureDebut: "19:00",
        dureeMinutes: 90,
        placesMax: 8,
        statut: "OPEN",
        createdAt: new Date(),
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(mockFormations).map((slug) => ({ slug }));
}

export default async function FormationPage({ params }: PageProps) {
  const { slug } = await params;
  const formation = mockFormations[slug];

  if (!formation) {
    notFound();
  }

  return (
    <div className="pt-20 bg-[#F9F7F2] min-h-screen">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/boutique"
          className="inline-flex items-center text-[#0F2A45] hover:text-[#B7860B] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la boutique
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              {formation.imageUrl ? (
                <Image
                  src={formation.imageUrl}
                  alt={formation.titre}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0F2A45] to-[#1B6CA8] flex items-center justify-center">
                  <span className="font-arabic text-8xl text-white/80">ع</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-[#1A7A4A] text-white">Disponible</Badge>
              {formation.prixPromo && (
                <Badge className="bg-[#B7860B] text-white">Promo</Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <Badge className="mb-4 bg-[#0F2A45]/10 text-[#0F2A45]">
                {formation.categorie}
              </Badge>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0F2A45] mb-4">
                {formation.titre}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {formation.descriptionCourte}
              </p>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-200">
              {formation.placesMax && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-5 w-5 text-[#B7860B]" />
                  <span>{formation.placesMax} places max</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5 text-[#B7860B]" />
                <span>Accès immédiat</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5 text-[#B7860B]" />
                <span>Accès à vie</span>
              </div>
            </div>

            {/* Price & CTA */}
            <Card className="bg-white border-2 border-[#B7860B]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    {formation.prixPromo ? (
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-[#1A7A4A]">
                          {formatPrice(formation.prixPromo)}
                        </span>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(formation.prix)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-[#0F2A45]">
                        {formatPrice(formation.prix)}
                      </span>
                    )}
                  </div>
                </div>

                <AddToCartButton formation={formation} />
              </CardContent>
            </Card>

            {/* Creneaux */}
            {formation.creneaux.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0F2A45] mb-4">
                  Créneaux disponibles
                </h3>
                <div className="space-y-3">
                  {formation.creneaux.map((creneau) => (
                    <div
                      key={creneau.id}
                      className="p-4 bg-white rounded-lg border border-gray-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-[#0F2A45]">
                          {creneau.nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          {creneau.jours.join(", ")} à {creneau.heureDebut} -{" "}
                          {creneau.dureeMinutes}min
                        </p>
                      </div>
                      <Badge
                        className={
                          creneau.statut === "OPEN"
                            ? "bg-[#1A7A4A]/10 text-[#1A7A4A]"
                            : "bg-red-100 text-red-600"
                        }
                      >
                        {creneau.statut === "OPEN"
                          ? `${creneau.placesMax} places`
                          : "Complet"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {formation.description && (
          <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#0F2A45] mb-6">
              Description complète
            </h2>
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#0F2A45] prose-a:text-[#B7860B]"
              dangerouslySetInnerHTML={{ __html: formation.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
