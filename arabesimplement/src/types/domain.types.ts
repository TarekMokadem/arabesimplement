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
  categorie: string;
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

export interface Creneau {
  id: string;
  formationId: string;
  nom: string;
  jours: string[];
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
