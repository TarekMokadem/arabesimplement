"use client";

import NextTopLoader from "nextjs-toploader";

/** Barre de progression en haut de l’écran lors des navigations client (App Router). */
export function NavigationTopLoader() {
  return (
    <NextTopLoader
      color="var(--color-secondary)"
      height={3}
      showSpinner={false}
      shadow="0 0 12px hsl(88 28% 62% / 0.35)"
      zIndex={9999}
    />
  );
}
