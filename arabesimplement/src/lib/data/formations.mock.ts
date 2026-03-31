import type { Formation, Creneau } from "@/types/domain.types";

/** Détail boutique (HTML + créneaux) — source de vérité pour mock et seed. */
export const MOCK_FORMATIONS_BY_SLUG: Record<
  string,
  Formation & { creneaux: Creneau[] }
> = {
  "lire-en-10-lecons": {
    id: "1",
    titre: "Lire l'arabe en 10 leçons",
    slug: "lire-en-10-lecons",
    descriptionCourte:
      "Programme progressif pour apprendre à lire l’arabe en dix leçons structurées, adapté aux francophones.",
    schedulingMode: "FIXED_SLOTS",
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
      "https://images.unsplash.com/photo-1622228862102-d691d3e2a334?w=600&q=80",
    placesMax: 50,
    categorie: "Lecture",
    statut: "ACTIVE",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    creneaux: [
      {
        id: "c1",
        formationId: "1",
        nom: "Session Matin",
        jours: ["Lundi", "Mercredi"],
        journeeSlots: [
          { jour: "Lundi", heureDebut: "10:00", dureeMinutes: 60 },
          { jour: "Mercredi", heureDebut: "10:00", dureeMinutes: 60 },
        ],
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
        journeeSlots: [
          { jour: "Mardi", heureDebut: "20:00", dureeMinutes: 60 },
          { jour: "Jeudi", heureDebut: "20:00", dureeMinutes: 45 },
        ],
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
      "https://images.unsplash.com/photo-1756808862471-46ad2f6c6fc0?w=600&q=80",
    placesMax: 20,
    categorie: "Invocations",
    schedulingMode: "FLEXIBLE_FORMATION",
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
    prix: 0,
    prixPromo: undefined,
    imageUrl:
      "https://images.unsplash.com/photo-1769428197773-e4adbe22aa8e?w=600&q=80",
    placesMax: 12,
    categorie: "Tajwid",
    schedulingMode: "HOURLY_PURCHASE",
    statut: "ACTIVE",
    featured: true,
    featuredTitre: "Formation Tajwid - Offre spéciale",
    featuredContent:
      "Maîtrisez les règles de récitation du Coran avec notre formation complète. Accès à vie + groupe WhatsApp de suivi.",
    featuredBadge: "Offre limitée",
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

/** Liste boutique (sans créneaux ni description longue) — repli sans BDD. */
export const MOCK_FORMATIONS: Formation[] = Object.values(
  MOCK_FORMATIONS_BY_SLUG
).map(({ creneaux: _c, description: _d, ...rest }) => ({
  ...rest,
  description: undefined,
}));

export function getBoutiqueCategoriesFromFormations(
  formations: Formation[]
): string[] {
  const uniq = [...new Set(formations.map((f) => f.categorie))].sort(
    (a, b) => a.localeCompare(b, "fr")
  );
  return ["Toutes", ...uniq];
}

/** Filtre catégories historique (ordre fixe) si besoin de compat visuelle. */
export const FORMATION_CATEGORIES_FALLBACK = [
  "Toutes",
  "Lecture",
  "Tajwid",
  "Invocations",
] as const;
