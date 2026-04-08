import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { getApprovedTestimonials } from "@/lib/data/testimonials.service";

export default async function TemoignagesPage() {
  const testimonials = await getApprovedTestimonials();
  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((acc, t) => acc + t.note, 0) / testimonials.length
      : 0;

  return (
    <div className="pt-20">
      <PageHeader
        title="Témoignages"
        subtitle="Découvrez les retours de nos étudiants sur leur expérience d'apprentissage."
      />

      <section className="py-10 sm:py-16 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {testimonials.length === 0 ? (
            <p className="text-center text-gray-600 max-w-lg mx-auto">
              Les avis approuvés par l&apos;équipe apparaîtront ici. Revenez
              bientôt ou contactez-nous après votre formation pour partager
              votre expérience.
            </p>
          ) : (
            <>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i <= Math.round(averageRating)
                            ? "fill-secondary text-secondary"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-primary">
                    {averageRating.toFixed(1)}/5
                  </span>
                  <span className="text-gray-500">
                    ({testimonials.length} avis)
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="bg-white hover:shadow-lg transition-shadow"
                    data-testid={`testimonial-${testimonial.id}`}
                  >
                    <CardContent className="p-6">
                      <Quote className="h-8 w-8 text-secondary/20 mb-4" />

                      <p className="text-gray-600 leading-relaxed mb-6">
                        &ldquo;{testimonial.texte}&rdquo;
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="font-medium text-primary">
                            {testimonial.nom}
                          </p>
                          <p className="text-sm text-gray-500">Étudiant(e)</p>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i <= testimonial.note
                                  ? "fill-secondary text-secondary"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
