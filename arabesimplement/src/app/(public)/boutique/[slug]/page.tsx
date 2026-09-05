import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PurchaseFormationPanel } from "@/components/shop/PurchaseFormationPanel";
import { SchedulingModeExplainer } from "@/components/shop/SchedulingModeExplainer";
import { schedulingModeBoutiqueCalendarHint } from "@/lib/scheduling-mode";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import {
  getFormationBySlug,
  getFormationSlugsForStaticParams,
  toFormationCartInput,
} from "@/lib/data/formations.service";
import { getApprovedTestimonialsPreview } from "@/lib/data/testimonials.service";
import { formationThemeLabel } from "@/lib/content/formation-theme";
import { FormationTestimonialsPreview } from "@/components/shop/FormationTestimonialsPreview";
import {
  BRAND_LOGO_PUBLIC_PATH,
  BrandLogoMark,
} from "@/components/layout/BrandLogoMark";
import { FormationCoverImage } from "@/components/shop/FormationCoverImage";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";
import { isFormationPurchasable } from "@/lib/availability";
import type { Creneau } from "@/types/domain.types";

/** Props client : pas de `Date` ni champs non sérialisables (évite erreur RSC → client). */
function creneauxForPurchasePanel(
  creneaux: Creneau[]
): Pick<
  Creneau,
  | "id"
  | "nom"
  | "jours"
  | "journeeSlots"
  | "heureDebut"
  | "dureeMinutes"
  | "statut"
  | "placesMax"
  | "schedulingMode"
  | "_count"
>[] {
  return creneaux.map((c) => ({
    id: c.id,
    nom: c.nom,
    jours: c.jours,
    journeeSlots: c.journeeSlots,
    heureDebut: c.heureDebut,
    dureeMinutes: c.dureeMinutes,
    statut: c.statut,
    placesMax: c.placesMax,
    schedulingMode: c.schedulingMode,
    _count: c._count,
  }));
}

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
    : toAbsoluteUrl(BRAND_LOGO_PUBLIC_PATH);
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
            <div className="relative aspect-square w-full max-w-xl mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-xl bg-neutral-100">
              {formation.imageUrl ? (
                <FormationCoverImage
                  src={formation.imageUrl}
                  alt={formation.titre}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-10">
                  <BrandLogoMark
                    size={240}
                    className="shadow-lg"
                    priority
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
                      __html: sanitizeHtml(formation.description),
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

            <PurchaseFormationPanel
              formation={cartFormation}
              creneaux={creneauxForPurchasePanel(
                formation.schedulingMode === "FIXED_SLOTS"
                  ? (formation.creneaux ?? [])
                  : []
              )}
              formationPurchasable={purchasable}
            />
          </div>
        </div>

        <FormationTestimonialsPreview rows={testimonials} />
      </div>
    </div>
  );
}
