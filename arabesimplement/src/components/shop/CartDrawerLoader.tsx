"use client";

import dynamic from "next/dynamic";

/**
 * Enveloppe client : `next/dynamic` avec `ssr: false` n’est pas autorisé dans un Server Component (layout).
 * Le tiroir panier ne s’hydrate qu’après le montage, ce qui évite les erreurs d’id Base UI (`useId`).
 */
export const CartDrawerLoader = dynamic(
  () =>
    import("@/components/shop/CartDrawer").then((m) => ({
      default: m.CartDrawer,
    })),
  { ssr: false }
);
