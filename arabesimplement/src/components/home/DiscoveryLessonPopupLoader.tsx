"use client";

import dynamic from "next/dynamic";

/**
 * Code-split : react-hook-form + Calendly ne bloquent pas l’hydratation des pages publiques.
 */
export const DiscoveryLessonPopupLoader = dynamic(
  () =>
    import("@/components/home/DiscoveryLessonPopup").then((m) => ({
      default: m.DiscoveryLessonPopup,
    })),
  { ssr: false }
);
