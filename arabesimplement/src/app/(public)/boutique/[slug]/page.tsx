import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Compass, Users, Calendar } from "lucide-react";
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
import { getApprovedTestimonialsPreview } from "@/lib/data/testimonials.service";
import { formationThemeLabel } from "@/lib/content/formation-theme";
import { FormationTestimonialsPreview } from "@/components/shop/FormationTestimonialsPreview";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";
import { isFormationPurchasable } from "@/lib/availability";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getFormationSlugsForStaticParams();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);
  if (!formation) {
    return { title: "Formation" };
  }
  const base = getSiteUrl();
  const url = base ? `${base}/boutique/${slug}` : `/boutique/${slug}`;
  const ogImage = formation.imageUrl
    ? toAbsoluteUrl(formation.imageUrl)
    : toAbsoluteUrl("/brand/logo-arabe-simplement.png");
  const images =
    ogImage.startsWith("http") && ogImage.length > 0
      ? [{ url: ogImage, alt: formation.titre }]
      : undefined;
  return {
    title: formation.titre,
    description: formation.descriptionCourte,
    openGraph: {
      title: formation.titre,
      description: formation.descriptionCourte,
      url,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: formation.titre,
      description: formation.descriptionCourte,
      images: images?.map((i) => i.url),
    },
  };
}

export default async function FormationPage({ params }: PageProps) {
  const { slug } = await params;
  const [formation, testimonials] = await Promise.all([
    getFormationBySlug(slug),
    getApprovedTestimonialsPreview(3),
  ]);

  if (!formation) {
    notFound();
  }

  const cartFormation = toFormationCartInput(formation);
  const purchasable = isFormationPurchasable(
    formation,
    formation.creneaux ?? [],
    formation._count?.enrollments ?? 0
  );

  return (
    <div className="pt-16 sm:pt-20 bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Link
          href="/boutique"
          className="inline-flex items-center text-primary hover:text-secondary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la boutique
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
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

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {formation.statut === "COMING_SOON" && (
                <Badge className="bg-primary-light text-white">Bientôt</Badge>
              )}
              {formation.statut === "ACTIVE" &&
                (purchasable ? (
                  <Badge className="bg-accent text-white">Disponible</Badge>
                ) : (
                  <Badge className="bg-red-600 text-white hover:bg-red-600">
                    Rupture
                  </Badge>
                ))}
              {formation.prixPromo != null && (
                <Badge className="bg-secondary text-secondary-foreground">Promo</Badge>
              )}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary">
                {formationThemeLabel(formation.theme)}
              </Badge>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4">
                {formation.titre}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {formation.descriptionCourte}
              </p>
            </div>

            {formation.description != null &&
              formation.description.trim() !== "" && (
                <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8 shadow-sm">
                  <div
                    className="prose prose-sm sm:prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary"
                    dangerouslySetInnerHTML={{
                      __html: formation.description,
                    }}
                  />
                </div>
              )}

            <SchedulingModeExplainer mode={formation.schedulingMode} />

            <div className="flex flex-wrap gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200 text-sm sm:text-base">
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

            <div className="rounded-2xl border border-secondary/30 bg-gradient-to-br from-primary/[0.07] via-white to-secondary/[0.06] p-5 md:p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-primary/10"
                  aria-hidden
                >
                  <Compass className="h-5 w-5 text-secondary" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="font-serif text-lg font-semibold text-primary leading-snug">
                    Vous hésitez entre ce cours et un autre parcours ?
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Avant de vous inscrire, le guide{" "}
                    <span className="font-medium text-primary">
                      Par où commencer
                    </span>{" "}
                    pose quelques questions sur votre objectif (lecture du Coran,
                    tajwid, invocations, niveau…) et vous propose une orientation
                    adaptée — pour éviter de vous tromper de formation.
                  </p>
                  <Link
                    href="/par-ou-commencer"
                    className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                  >
                    Ouvrir le guide d&apos;orientation
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <PurchaseFormationPanel
              formation={cartFormation}
              creneaux={formation.creneaux ?? []}
              formationPurchasable={purchasable}
            />

            {formation.schedulingMode === "FLEXIBLE_FORMATION" &&
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

        <FormationTestimonialsPreview rows={testimonials} />
      </div>
    </div>
  );
}
