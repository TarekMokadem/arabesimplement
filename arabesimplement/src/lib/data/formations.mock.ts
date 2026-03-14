import type { Formation } from "@/types/domain.types";

export const MOCK_FORMATIONS: Formation[] = [
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

export const FORMATION_CATEGORIES = ["Toutes", "Lecture", "Tajwid", "Invocations"] as const;
