"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const HEADER_AIDE_LINKS = [
  {
    href: "/par-ou-commencer",
    label: "Par où commencer",
    description: "Choisir un parcours selon votre objectif",
  },
  {
    href: "/comment-ca-marche",
    label: "Comment ça marche",
    description: "Après l’achat : accès, créneaux, organisation",
  },
  {
    href: "/faq",
    label: "FAQ",
    description: "Questions fréquentes",
  },
] as const;

type HeaderAideMenuProps = {
  /** Fermeture après navigation (ex. menu mobile). */
  onNavigate?: () => void;
  /** Pour aligner le style du déclencheur sur les autres liens nav. */
  triggerClassName?: string;
};

export function HeaderAideMenu({
  onNavigate,
  triggerClassName,
}: HeaderAideMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (!el?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 text-primary hover:text-secondary outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 rounded-sm",
          triggerClassName
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        id="nav-aide-trigger"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        Aide
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-80 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="absolute left-0 z-[100] pt-2 w-[min(100vw-2rem,280px)]"
          role="menu"
          aria-labelledby="nav-aide-trigger"
        >
          <div className="rounded-xl border border-gray-100 bg-white py-2 shadow-lg ring-1 ring-black/5">
            {HEADER_AIDE_LINKS.map((link) => (
              <Link
                key={link.href}
                role="menuitem"
                href={link.href}
                className="block px-4 py-3 text-left transition-colors hover:bg-surface"
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                <span className="font-medium text-primary text-sm">
                  {link.label}
                </span>
                <span className="mt-0.5 block text-xs text-gray-500 leading-snug">
                  {link.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
