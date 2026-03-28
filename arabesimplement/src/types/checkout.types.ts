import type { CartItem } from "@/store/cart.store";

/** Données de session (sessionStorage) entre étapes du tunnel de commande. */
export type StoredCheckoutOrder = {
  prenom: string;
  nom: string;
  email: string;
  items?: CartItem[];
  total?: number;
  orderId: string;
  createdAt: string;
  paymentMode?: "stripe" | "mock";
  clientSecret?: string | null;
  stripePublishableKey?: string | null;
};
