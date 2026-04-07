import type { FormationTheme } from "@prisma/client";

export type { FormationTheme };

export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  role: "STUDENT" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export type FormationSchedulingMode =
  | "HOURLY_PURCHASE"
  | "FLEXIBLE_FORMATION"
  | "FIXED_SLOTS";

export interface Formation {
  id: string;
  titre: string;
  slug: string;
  descriptionCourte: string;
  description?: string;
  prix: number;
  prixPromo?: number;
  imageUrl?: string;
  placesMax?: number;
  theme: FormationTheme;
  schedulingMode: FormationSchedulingMode;
  statut: "ACTIVE" | "INACTIVE" | "COMING_SOON" | "ARCHIVED";
  featured: boolean;
  featuredContent?: string;
  featuredTitre?: string;
  featuredBadge?: string;
  featuredExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  creneaux?: Creneau[];
  _count?: {
    enrollments: number;
  };
}

/** Carte boutique (champs sérialisables côté client). */
export type FormationBoutiqueCard = Pick<
  Formation,
  | "id"
  | "titre"
  | "slug"
  | "descriptionCourte"
  | "prix"
  | "prixPromo"
  | "imageUrl"
  | "placesMax"
  | "theme"
  | "schedulingMode"
  | "statut"
  | "featured"
> & {
  /** Places / créneaux encore disponibles pour l’achat. */
  boutiquePurchasable: boolean;
  /** Capacité totale des créneaux &lt; 4 (mode créneaux fixes uniquement). */
  showLimitedBadge: boolean;
};

/** Données panier / bouton d’ajout (composants client). */
export type FormationCartInput = Pick<
  Formation,
  | "id"
  | "titre"
  | "slug"
  | "prix"
  | "prixPromo"
  | "imageUrl"
  | "schedulingMode"
>;

export interface Creneau {
  id: string;
  formationId: string;
  nom: string;
  jours: string[];
  /** Horaire détaillé par jour (prioritaire pour l’affichage si présent). */
  journeeSlots?: {
    jour: string;
    heureDebut: string;
    dureeMinutes: number;
  }[];
  heureDebut: string;
  dureeMinutes: number;
  placesMax: number;
  whatsappLink?: string;
  statut: "OPEN" | "FULL" | "CLOSED";
  createdAt: Date;
  formation?: Formation;
  _count?: {
    enrollments: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  statut: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  stripePaymentIntentId?: string;
  reglementSigneAt?: Date;
  reglementIp?: string;
  reglementVersion?: string;
  createdAt: Date;
  user?: User;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  formationId: string;
  creneauId?: string;
  hourlyMinutes?: number;
  hourlyQuantity?: number;
  cartLineId?: string;
  prixUnitaire: number;
  formation?: Formation;
}

export interface Enrollment {
  id: string;
  userId: string;
  formationId: string;
  creneauId?: string;
  token: string;
  tokenExpiresAt: Date;
  tokenUsed: boolean;
  assignedProfessorName?: string;
  assignedWhatsappUrl?: string;
  createdAt: Date;
  user?: User;
  formation?: Formation;
  creneau?: Creneau;
}

export interface Testimonial {
  id: string;
  nom: string;
  texte: string;
  note: number;
  approuve: boolean;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  imageUrl?: string;
  publie: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  lu: boolean;
  createdAt: Date;
}

export interface ReglementInterieur {
  id: string;
  contenu: string;
  version: string;
  actif: boolean;
  createdAt: Date;
}
