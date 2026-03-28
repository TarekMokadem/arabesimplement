import Link from "next/link";
import { Star, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getTestimonialsForAdmin } from "@/lib/data/testimonials.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { TestimonialModerationButtons } from "./TestimonialModerationButtons";
import { TestimonialForm } from "./TestimonialForm";
import { getDefaultTestimonialValues } from "./testimonial-defaults";

export default async function TemoignagesPage() {
  const db = isDatabaseConfigured();
  const temoignages = db ? await getTestimonialsForAdmin() : [];
  const pending = temoignages.filter((t) => !t.approuve).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">
          Témoignages
        </h1>
        <p className="text-gray-500 mt-1">
          {pending} en attente de modération — source : table{" "}
          <code className="text-xs bg-gray-100 px-1 rounded">testimonials</code>
        </p>
      </div>
      {!db && (
        <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Configurez DATABASE_URL pour gérer les témoignages.
        </p>
      )}
      {db && (
        <TestimonialForm
          mode="create"
          defaultValues={getDefaultTestimonialValues()}
        />
      )}
      {temoignages.length === 0 ? (
        <p className="text-gray-500 text-sm">
          {db
            ? "Aucun témoignage. Exécutez le seed ou ajoutez des entrées en base."
            : "—"}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {temoignages.map((t) => (
            <Card
              key={t.id}
              className={`bg-white ${!t.approuve ? "border-l-4 border-l-secondary" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">
                        {t.nom[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-primary truncate">
                        {t.nom}
                      </p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i <= t.note
                                ? "fill-secondary text-secondary"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      t.approuve
                        ? "bg-accent/10 text-accent shrink-0"
                        : "bg-secondary/10 text-secondary shrink-0"
                    }
                  >
                    {t.approuve ? "Approuvé" : "En attente"}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">&ldquo;{t.texte}&rdquo;</p>
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Link
                    href={`/admin/temoignages/${t.id}/modifier`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Link>
                </div>
                <TestimonialModerationButtons id={t.id} approuve={t.approuve} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
