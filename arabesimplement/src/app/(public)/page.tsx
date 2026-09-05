import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionDuMoment } from "@/components/shop/SessionDuMoment";
import {
  getFeaturedSessionHome,
  type FeaturedSessionHome,
} from "@/lib/data/formations.service";
import { getHomeHeroTrust } from "@/lib/data/home.service";
import { AfterPurchaseJourneySection } from "@/components/home/AfterPurchaseJourneySection";
import { HeroLireArabeSection } from "@/components/home/HeroLireArabeSection";
import { HomeFaqTeaser } from "@/components/home/HomeFaqTeaser";
import { DiscoveryLessonPopup } from "@/components/home/DiscoveryLessonPopup";
import { calendlyDiscoveryUrl } from "@/lib/calendly";

function SessionDuMomentSection(props: FeaturedSessionHome) {
  return <SessionDuMoment {...props} />;
}

// Icônes pleines (silhouettes) pour la section "Pourquoi nous choisir"
function MosqueIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="2.6" r="0.9" />
      <path d="M3 21V9.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1V21H3Z" />
      <path d="M18.8 21V9.4c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1V21h-2.2Z" />
      <path d="M4.1 6.5c.7 0 1.1.6 1.1 1.3H3c0-.7.4-1.3 1.1-1.3Z" />
      <path d="M19.9 6.5c.7 0 1.1.6 1.1 1.3h-2.2c0-.7.4-1.3 1.1-1.3Z" />
      <path d="M6 21v-8a6 6 0 0 1 12 0v8h-3.2v-3a2.8 2.8 0 0 0-5.6 0v3H6Z" />
      <rect x="2" y="21.2" width="20" height="1.5" rx="0.75" />
    </svg>
  );
}

function BookFilledIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 6.4C10.5 5.2 8.2 4.6 5.4 4.6c-1 0-1.9.1-2.8.3-.4.1-.6.4-.6.8v12c0 .5.5.9 1 .8.8-.2 1.6-.2 2.4-.2 2.3 0 4.2.5 5.6 1.6V6.4Z" />
      <path d="M12 6.4c1.5-1.2 3.8-1.8 6.6-1.8 1 0 1.9.1 2.8.3.4.1.6.4.6.8v12c0 .5-.5.9-1 .8-.8-.2-1.6-.2-2.4-.2-2.3 0-4.2.5-5.6 1.6V6.4Z" />
    </svg>
  );
}

function UsersFilledIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="7.3" r="3.3" />
      <path d="M9 12c-3.4 0-6.2 2.2-6.2 5v1.4c0 .6.4 1 1 1h10.4c.6 0 1-.4 1-1V17c0-2.8-2.8-5-6.2-5Z" />
      <circle cx="17.2" cy="8" r="2.6" />
      <path d="M17.2 12.4c-.8 0-1.6.2-2.3.5 1.1 1.1 1.8 2.7 1.8 4.4v1.1h4.3c.6 0 1-.4 1-1V17c0-2.5-2.1-4.6-4.8-4.6Z" />
    </svg>
  );
}

// Bloc "expérience Égypte" + trajet Égypte → France (partagé desktop/mobile)
function ExperienceEgypteContent() {
  return (
    <>
      <p className="text-center font-serif text-lg sm:text-xl font-bold text-primary">
        Une expérience acquise
        <br />
        en Égypte
      </p>
      <p className="mt-1 text-center text-sm text-primary/70">
        au service des francophones
      </p>

      {/* Trajet Égypte → France (pointillés en courbe) */}
      <div className="mx-auto mt-5 flex max-w-[300px] items-start justify-between gap-2">
        <div className="flex shrink-0 flex-col items-center">
          <MapPin className="h-5 w-5 fill-primary text-primary" />
          <span className="mt-1 text-xs font-medium text-primary/80">Égypte</span>
        </div>
        <div className="relative mt-1 flex-1">
          <svg
            viewBox="0 0 180 26"
            className="w-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path
              d="M4 18 Q 90 -4 176 18"
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="2 5"
              strokeLinecap="round"
              className="text-primary/45"
            />
          </svg>
          <Plane className="absolute left-1/2 top-[15%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 fill-primary text-primary" />
        </div>
        <div className="flex shrink-0 flex-col items-center">
          <MapPin className="h-5 w-5 fill-primary text-primary" />
          <span className="mt-1 text-xs font-medium text-primary/80">France</span>
        </div>
      </div>
    </>
  );
}

// Section "Pourquoi nous choisir"
function FeaturesSection() {
  const features = [
    {
      icon: MosqueIcon,
      title: "Une expérience acquise en Égypte",
      description:
        "Vivre, étudier et enseigner en Égypte nous a permis de découvrir les méthodes et les supports les plus efficaces pour apprendre l’arabe de manière progressive et durable.",
    },
    {
      icon: BookFilledIcon,
      title: "Un parcours pensé étape par étape",
      description:
        "De l’alphabet à l’expression orale, notre parcours suit une logique claire afin d’aider les élèves à construire des bases solides et à progresser avec confiance.",
    },
    {
      icon: UsersFilledIcon,
      title: "Un accompagnement tout au long du parcours",
      description:
        "Derrière chaque élève se trouve une personne avec ses objectifs, ses difficultés et son rythme d’apprentissage. C’est pourquoi nos enseignants prennent le temps d’accompagner chacun tout au long de son parcours.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#f4f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Colonne texte */}
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary border-transparent hover:bg-primary/10">
              Pourquoi nous choisir
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-primary leading-tight mb-5">
              Pourquoi choisir
              <br />
              Arabe Simplement&nbsp;?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed max-w-xl">
              Depuis plusieurs années, nous accompagnons des francophones dans
              leur apprentissage de l’arabe en nous appuyant sur une expérience
              acquise en Égypte, des supports sélectionnés avec soin et une
              progression pensée étape par étape.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/25 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/cours-darabe" className="inline-block mt-8">
              <Button className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Colonne droite — Desktop & tablette : photo cadrée à droite + overlay */}
          <div className="relative hidden aspect-square overflow-hidden rounded-3xl shadow-2xl md:block">
            <Image
              src="/images/home/experience-egypte.png"
              alt="Vue sur une mosquée du Caire avec des livres d'apprentissage de l'arabe"
              fill
              className="object-cover object-right"
              sizes="50vw"
            />
            {/* Voile clair en haut pour la lisibilité du texte */}
            <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/85 via-white/45 to-transparent" />

            <div className="absolute inset-x-0 top-0 p-6 sm:p-8">
              <ExperienceEgypteContent />
            </div>
          </div>

          {/* Colonne droite — Mobile : carte épurée sans photo (plus lisible) */}
          <div className="rounded-3xl border border-[#d8e2cf] bg-gradient-to-b from-[#eef3e8] to-[#e3ecd9] p-6 md:hidden">
            <ExperienceEgypteContent />
          </div>
        </div>
      </div>
    </section>
  );
}

// SEO Content Section
function SEOContentSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-serif text-3xl font-bold text-primary mb-8">
            ArabeSimplement : pour qui, pourquoi
          </h2>

          <p className="text-gray-600 leading-relaxed">
            L&apos;arabe mérite un enseignement patient et structuré. Chez
            ArabeSimplement, nous combinons des approches utilisées en Égypte
            avec des explications adaptées aux francophones, un partenariat avec
            un institut sur place, et un partage pédagogique (livre niveaux 1 à
            11) pour que vous sachiez toujours où vous en êtes.
          </p>

          <h3 className="font-serif text-2xl font-bold text-primary mt-12 mb-4">
            Pourquoi apprendre l&apos;arabe ?
          </h3>
          <p className="text-gray-600 leading-relaxed">
            L&apos;arabe est la cinquième langue la plus parlée au monde, avec
            plus de 420 millions de locuteurs natifs. C&apos;est également la
            langue du Coran, ce qui en fait une langue essentielle pour les
            musulmans du monde entier souhaitant comprendre les textes sacrés
            dans leur version originale.
          </p>

          <h3 className="font-serif text-2xl font-bold text-primary mt-12 mb-4">
            Lecture et progression
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Selon les parcours, nous proposons entre autres un programme de
            lecture en dix leçons structurées : objectifs clairs, révisions et
            mise en pratique. L’efficacité dépend aussi de votre assiduité —
            nous posons le cadre, vous avancez avec régularité.
          </p>

          <h3 className="font-serif text-2xl font-bold text-primary mt-12 mb-4">
            L&apos;arabe littéraire vs l&apos;arabe dialectal
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Il existe une distinction importante entre l&apos;arabe littéraire
            (fusha), utilisé dans les médias, la littérature et les textes
            religieux, et les dialectes arabes qui varient selon les régions.
            Notre formation se concentre sur l&apos;arabe littéraire, qui vous
            permettra de comprendre le Coran et de communiquer avec des
            arabophones de toutes origines.
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [featuredSession, heroTrust] = await Promise.all([
    getFeaturedSessionHome(),
    getHomeHeroTrust(),
  ]);

  return (
    <div className="pt-20">
      <HeroLireArabeSection
        decouvrirHref={heroTrust.primaryCtaHref}
        programmeHref="/boutique"
      />
      {featuredSession ? (
        <SessionDuMomentSection {...featuredSession} />
      ) : null}
      <FeaturesSection />
      <HomeFaqTeaser />
      <AfterPurchaseJourneySection />
      <SEOContentSection />
      <DiscoveryLessonPopup calendlyUrl={calendlyDiscoveryUrl()} />
    </div>
  );
}
