import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import { AddToCartButton } from "./AddToCartButton";
import { SchedulingModeExplainer } from "@/components/shop/SchedulingModeExplainer";
import {
  getFormationBySlug,
  getFormationSlugsForStaticParams,
  toFormationCartInput,
} from "@/lib/data/formations.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getFormationSlugsForStaticParams();
  return slugs.map((slug) => ({ slug }));
}

export default async function FormationPage({ params }: PageProps) {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);

  if (!formation) {
    notFound();
  }

  const cartFormation = toFormationCartInput(formation);

  return (
    <div className="pt-20 bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/boutique"
          className="inline-flex items-center text-primary hover:text-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la boutique
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              {formation.imageUrl ? (
                <Image
                  src={formation.imageUrl}
                  alt={formation.titre}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <span className="font-arabic text-8xl text-white/80">ع</span>
                </div>
              )}
            </div>

            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-accent text-white">Disponible</Badge>
              {formation.prixPromo != null && (
                <Badge className="bg-secondary text-secondary-foreground">Promo</Badge>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">
                {formation.categorie}
              </Badge>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                {formation.titre}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {formation.descriptionCourte}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-200">
              {formation.placesMax != null && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-5 w-5 text-secondary" />
                  <span>{formation.placesMax} places max</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5 text-secondary" />
                <span>Accès immédiat</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5 text-secondary" />
                <span>Accès à vie</span>
              </div>
            </div>

            <Card className="bg-white border-2 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    {formation.prixPromo != null ? (
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-accent">
                          {formatPrice(formation.prixPromo)}
                        </span>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(formation.prix)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(formation.prix)}
                      </span>
                    )}
                  </div>
                </div>

                <AddToCartButton formation={cartFormation} />
              </CardContent>
            </Card>

            {(formation.creneaux ?? []).length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-bold text-primary mb-4">
                  {formation.schedulingMode === "FIXED_SLOTS"
                    ? "Créneaux disponibles"
                    : "Horaires / sessions (indicatif)"}
                </h3>
                <div className="space-y-3">
                  {(formation.creneaux ?? []).map((creneau) => (
                    <div
                      key={creneau.id}
                      className="p-4 bg-white rounded-lg border border-gray-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-primary">
                          {creneau.nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          {creneau.jours.join(", ")} à {creneau.heureDebut} -{" "}
                          {creneau.dureeMinutes}min
                        </p>
                      </div>
                      <Badge
                        className={
                          creneau.statut === "OPEN"
                            ? "bg-accent/10 text-accent"
                            : "bg-red-100 text-red-600"
                        }
                      >
                        {creneau.statut === "OPEN"
                          ? `${creneau.placesMax} places`
                          : "Complet"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {formation.description != null && formation.description.trim() !== "" && (
          <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-primary mb-6">
              Description complète
            </h2>
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary"
              dangerouslySetInnerHTML={{ __html: formation.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
