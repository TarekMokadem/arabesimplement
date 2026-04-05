import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PurchaseFormationPanel } from "@/components/shop/PurchaseFormationPanel";
import { SchedulingModeExplainer } from "@/components/shop/SchedulingModeExplainer";
import {
  schedulingModeBoutiqueCalendarHint,
  schedulingModeBoutiqueCreneauxHeading,
} from "@/lib/scheduling-mode";
import {
  formatCreneauSlotLine,
  normalizeJourneeSlots,
} from "@/lib/creneau-display";
import {
  getFormationBySlug,
  getFormationSlugsForStaticParams,
  toFormationCartInput,
} from "@/lib/data/formations.service";
import { formationThemeLabel } from "@/lib/content/formation-theme";

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
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-10">
                  <Image
                    src="/brand/logo-arabe-simplement.png"
                    alt={formation.titre}
                    width={320}
                    height={320}
                    className="object-contain max-w-[55%] opacity-95 drop-shadow-md"
                  />
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
                {formationThemeLabel(formation.theme)}
              </Badge>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                {formation.titre}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {formation.descriptionCourte}
              </p>
            </div>

            <SchedulingModeExplainer mode={formation.schedulingMode} />

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
                <span>
                  {schedulingModeBoutiqueCalendarHint(formation.schedulingMode)}
                </span>
              </div>
            </div>

            <PurchaseFormationPanel
              formation={cartFormation}
              creneaux={formation.creneaux ?? []}
            />

            {formation.schedulingMode !== "FLEXIBLE_FORMATION" &&
              (formation.creneaux ?? []).length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-4">
                    {schedulingModeBoutiqueCreneauxHeading(
                      formation.schedulingMode
                    )}
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
                          <div className="text-sm text-gray-500 space-y-0.5">
                            {normalizeJourneeSlots(creneau.journeeSlots, {
                              jours: creneau.jours,
                              heureDebut: creneau.heureDebut,
                              dureeMinutes: creneau.dureeMinutes,
                            }).map((slot) => (
                              <p
                                key={`${creneau.id}-${slot.jour}-${slot.heureDebut}`}
                              >
                                {formatCreneauSlotLine(slot)}
                              </p>
                            ))}
                          </div>
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
