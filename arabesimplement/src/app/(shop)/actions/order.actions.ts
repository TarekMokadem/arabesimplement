"use server";

import type { OrderFormInput } from "@/lib/validations/order.schema";
import type { CartItem } from "@/store/cart.store";

export type CreateOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function createOrder(
  data: OrderFormInput,
  items: CartItem[]
): Promise<CreateOrderResult> {
  if (items.length === 0) {
    return { success: false, error: "Le panier est vide" };
  }

  // Sans BDD configurée : retourne un orderId mock
  // Quand Prisma + Stripe seront configurés : créer Order, PaymentIntent, etc.
  const hasDatabase =
    !!process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("placeholder");

  if (!hasDatabase) {
    return { success: true, orderId: `ORD-MOCK-${Date.now()}` };
  }

  // TODO: Implémentation avec Prisma
  // - Créer ou récupérer User
  // - Créer Order (PENDING) + OrderItems
  // - Créer Stripe PaymentIntent
  // - Retourner orderId / clientSecret
  return { success: true, orderId: `ORD-${Date.now()}` };
}
