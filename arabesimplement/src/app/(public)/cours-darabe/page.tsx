import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  MARKETING_BOUTIQUE_SLUGS,
  boutiqueFormationHref,
} from "@/lib/content/marketing-boutique-links";
import { NotreMethodeSection } from "@/components/home/NotreMethodeSection";

const sessionHighlights = [
  {
    title: "J'apprends à lire l'arabe — module 1",
    description:
      "Première brique de notre parcours lecture : alphabet, sons et premiers pas pour déchiffrer l'arabe avec une méthode progressive, pensée pour les francophones.",
    imageSrc: "/images/sessions/module-lire-arabe-1.png",
    imageAlt:
      "Couverture du module 1 « J'apprends à lire l'arabe », ArabeSimplement",
    href: boutiqueFormationHref(MARKETING_BOUTIQUE_SLUGS.lectureArabe),
    cta: "Voir la formation",
    imageBgClass:
      "bg-[radial-gradient(ellipse_95%_85%_at_50%_35%,#e8f6fc_0%,#d5f0f0_42%,#fceeeb_88%)] ring-1 ring-teal-900/10",
    /** Remplit la zone (recadrage type bannière, léger zoom pour éviter les bords). */
    imageClassName:
      "object-cover object-center scale-105 drop-shadow-sm",
  },
  {
    title: "Session invocations — groupe femmes",
    description:
      "Accompagnement structuré sur les invocations du matin et du soir : cadre bienveillant, rappels utiles et pratique régulière entre sœurs.",
    imageSrc: "/images/sessions/session-invocations-femme.png",
    imageAlt:
      "Visuel « Session invocations du matin et du soir », groupe femmes, ArabeSimplement",
    href: boutiqueFormationHref(MARKETING_BOUTIQUE_SLUGS.invocationsMatinSoir),
    cta: "Découvrir la session",
    imageBgClass:
      "bg-[radial-gradient(ellipse_90%_75%_at_50%_45%,#5c4478_0%,#3d2a52_38%,#1a0f24_100%)] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.12)]",
    /** Fond noir des visuels : mode fusion pour laisser passer le dégradé. */
    imageClassName:
      "object-contain object-center mix-blend-screen p-3 md:p-4 contrast-[1.02]",
  },
  {
    title: "Session invocations — groupe hommes",
    description:
      "Même parcours d'invocations du matin et du soir, dans un groupe réservé aux hommes, pour avancer sereinement avec un enseignant adapté.",
    imageSrc: "/images/sessions/session-invocations-homme.png",
    imageAlt:
      "Visuel « Session invocations du matin et du soir », groupe hommes, ArabeSimplement",
    href: boutiqueFormationHref(MARKETING_BOUTIQUE_SLUGS.invocationsMatinSoir),
    cta: "Découvrir la session",
    imageBgClass:
      "bg-[radial-gradient(ellipse_90%_75%_at_50%_45%,#2a8a7e_0%,#1a5c54_40%,#0c2522_100%)] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1)]",
    imageClassName:
      "object-contain object-center mix-blend-screen p-3 md:p-4 contrast-[1.02]",
  },
] as const;

export default function CoursDarabePage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Cours d'arabe"
        subtitle="Découvrez notre méthode unique pour apprendre à lire l'arabe en seulement 10 leçons."
      />

      <section className="py-10 sm:py-16 md:py-20 bg-surface border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/15">
              Nos offres
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Sessions et modules à la une
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Trois entrées concrètes : la base lecture (module 1), puis deux
              sessions d&apos;invocations matin et soir — chacune avec un
              groupe hommes ou femmes pour un cadre adapté.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {sessionHighlights.map((session) => (
              <article
                key={session.title}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden isolation-isolate",
                    session.imageBgClass
                  )}
                >
                  <Image
                    src={session.imageSrc}
                    alt={session.imageAlt}
                    fill
                    className={session.imageClassName}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6 pt-5">
                  <h3 className="font-serif text-lg font-bold text-primary mb-3 leading-snug">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6">
                    {session.description}
                  </p>
                  <Link
                    href={session.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    {session.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <NotreMethodeSection />
    </div>
  );
}
