"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Iframe Calendly : occupe l’espace restant de la popup, sans agrandir le dialog. */
export function DiscoveryCalendlyFrame({ src }: { src: string }) {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative min-h-0 min-w-[320px] flex-1 overflow-hidden rounded-lg bg-[#f4f5f0]">
      {!ready ? (
        <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
          Chargement du calendrier…
        </p>
      ) : null}
      <iframe
        title="Choisir un horaire — Calendly"
        src={src}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setReady(true)}
        className={cn(
          "absolute inset-0 h-full w-full border-0 [color-scheme:light]",
          ready ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
