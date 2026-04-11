import { Loader2 } from "lucide-react";

/** Affiché par les `loading.tsx` des segments App Router pendant le streaming RSC. */
export function PageLoadingFallback() {
  return (
    <div
      className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 bg-surface px-4"
      role="status"
      aria-live="polite"
    >
      <Loader2
        className="h-10 w-10 animate-spin text-secondary"
        aria-hidden
      />
      <span className="text-sm text-muted-foreground">Chargement…</span>
      <span className="sr-only">Chargement de la page en cours</span>
    </div>
  );
}
