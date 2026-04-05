import Link from "next/link";
import { Star } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type Row = Pick<Testimonial, "id" | "nom" | "texte" | "note">;

export function FormationTestimonialsPreview({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;

  return (
    <section
      className="mt-16 bg-surface rounded-2xl p-8 md:p-10 border border-gray-100"
      aria-labelledby="titre-temoignages-formation"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2
            id="titre-temoignages-formation"
            className="font-serif text-2xl font-bold text-primary"
          >
            Ce qu’en disent les élèves
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Extraits d’avis publiés sur la page témoignages.
          </p>
        </div>
        <Link
          href="/temoignages"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-primary text-primary w-fit shrink-0"
          )}
        >
          Tous les témoignages
        </Link>
      </div>

      <ul className="grid gap-6 md:grid-cols-3">
        {rows.map((t) => (
          <li
            key={t.id}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex gap-0.5 mb-3" aria-label={`Note ${t.note} sur 5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i <= t.note
                      ? "fill-secondary text-secondary"
                      : "fill-transparent text-gray-200"
                  )}
                />
              ))}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-5">
              « {t.texte} »
            </p>
            <p className="mt-3 text-sm font-medium text-primary">— {t.nom}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
