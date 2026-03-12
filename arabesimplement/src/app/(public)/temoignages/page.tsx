import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";

// Mock testimonials
const testimonials = [
  {
    id: "1",
    nom: "Fatima B.",
    texte:
      "Alhamdulillah, grâce à ArabeSimplement j'ai appris à lire l'arabe en quelques semaines seulement. La méthode est vraiment efficace et le professeur très pédagogue.",
    note: 5,
  },
  {
    id: "2",
    nom: "Youssef M.",
    texte:
      "Je recommande vivement cette formation ! Après des années à essayer d'apprendre seul, j'ai enfin trouvé une méthode qui fonctionne. Barakallahu fik !",
    note: 5,
  },
  {
    id: "3",
    nom: "Khadija L.",
    texte:
      "Le suivi personnalisé fait vraiment la différence. Le groupe WhatsApp permet de poser ses questions et de rester motivé. Très satisfaite !",
    note: 5,
  },
  {
    id: "4",
    nom: "Omar S.",
    texte:
      "Formation excellente, j'ai pu enfin comprendre les bases de la lecture arabe. Les cours sont clairs et bien structurés.",
    note: 4,
  },
  {
    id: "5",
    nom: "Amina R.",
    texte:
      "Ma fille de 12 ans a suivi la formation et elle lit maintenant le Coran par elle-même. Un grand merci à toute l'équipe !",
    note: 5,
  },
  {
    id: "6",
    nom: "Ibrahim T.",
    texte:
      "Le rapport qualité-prix est imbattable. Pour 8€, on accède à une formation complète. Je ne regrette pas mon achat.",
    note: 5,
  },
];

export default function TemoignagesPage() {
  const averageRating =
    testimonials.reduce((acc, t) => acc + t.note, 0) / testimonials.length;

  return (
    <div className="pt-20">
      <PageHeader
        title="Témoignages"
        subtitle="Découvrez les retours de nos étudiants sur leur expérience d'apprentissage."
      />

      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Stats */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i <= Math.round(averageRating)
                        ? "fill-[#B7860B] text-[#B7860B]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-[#0F2A45]">
                {averageRating.toFixed(1)}/5
              </span>
              <span className="text-gray-500">
                ({testimonials.length} avis)
              </span>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="bg-white hover:shadow-lg transition-shadow"
                data-testid={`testimonial-${testimonial.id}`}
              >
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-[#B7860B]/20 mb-4" />

                  <p className="text-gray-600 leading-relaxed mb-6">
                    &ldquo;{testimonial.texte}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-medium text-[#0F2A45]">
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
                              ? "fill-[#B7860B] text-[#B7860B]"
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
        </div>
      </section>
    </div>
  );
}
