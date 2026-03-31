import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionDuMoment } from "@/components/shop/SessionDuMoment";
import {
  getFeaturedSessionHome,
  type FeaturedSessionHome,
} from "@/lib/data/formations.service";
import {
  getHomeHeroTrust,
  type HomeHeroTrust,
} from "@/lib/data/home.service";
import { cn } from "@/lib/utils";

function SessionDuMomentSection(props: FeaturedSessionHome) {
  return <SessionDuMoment {...props} />;
}

// Hero Section
function HeroSection({ trust }: { trust: HomeHeroTrust }) {
  const starFill = (i: number) =>
    trust.ratingAverage != null &&
    i <= Math.round(Math.min(5, Math.max(0, trust.ratingAverage)));

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1769428197773-e4adbe22aa8e?w=1920&q=80"
          alt="Mosquée au coucher de soleil"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-2xl">
          <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30">
            Pédagogie & partenariat Égypte
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Apprendre l&apos;arabe avec une équipe{" "}
            <span className="text-secondary">solide et ancrée</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Méthodes inspirées de l&apos;enseignement en Égypte, supports
            (livre du niveau 1 au 11) et accompagnement pour progresser{" "}
            <span className="font-bold text-white">
              à votre rythme, en ligne
            </span>
            . Pas de promesse miraculeuse — du travail encadré et des repères
            clairs.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href={trust.primaryCtaHref}>
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary-light hover:text-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="hero-cta-primary"
              >
                Apprends à lire l&apos;arabe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/boutique">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white shadow-sm backdrop-blur-[2px] hover:bg-white hover:text-primary px-8 py-6 text-lg transition-all duration-300"
                data-testid="hero-cta-secondary"
              >
                Voir les cours
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {trust.avatarInitials.map((label, idx) => (
                  <div
                    key={`${label}-${idx}`}
                    className="w-8 h-8 rounded-full bg-secondary border-2 border-primary flex items-center justify-center"
                  >
                    <span className="text-secondary-foreground text-[10px] font-bold leading-none px-0.5 text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-white text-sm">{trust.studentCountLabel}</span>
            </div>
            {trust.ratingAverage !== null ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      starFill(i)
                        ? "fill-secondary text-secondary"
                        : "fill-transparent text-white/35"
                    )}
                  />
                ))}
                <span className="text-white text-sm ml-2">
                  {trust.ratingAverage.toFixed(1)}/5
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Partenariat avec un institut en Égypte",
      description:
        "Un lien direct avec une structure d’enseignement en Égypte pour des contenus et des repères fiables, adaptés aux francophones.",
    },
    {
      icon: Users,
      title: "Livre d’Égypte — niveaux 1 à 11",
      description:
        "Progression structurée avec le support du livre jusqu’au niveau 11, pour avancer étape par étape sans improvisation.",
    },
    {
      icon: Award,
      title: "Pédagogie d’inspiration égyptienne",
      description:
        "Méthodes et exercices calqués sur des pratiques éprouvées en Égypte, avec des explications en français quand il le faut.",
    },
  ];

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              Notre approche
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">
              Un parcours sérieux, sans effet d’annonce
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Nous misons sur la régularité, des supports clairs et des
              enseignants impliqués. Notre différence : l’expérience d’un
              partenaire en Égypte, des méthodes inspirées de là-bas, et un
              matériel pédagogique cohérent jusqu’au niveau 11 — pas de
              superlatifs vides, plutôt du concret et du suivi.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
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

          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1622228862102-d691d3e2a334?w=800&q=80"
                alt="Apprentissage de l'arabe"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-primary rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

// SEO Content Section
function SEOContentSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
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
      <HeroSection trust={heroTrust} />
      <SessionDuMomentSection {...featuredSession} />
      <FeaturesSection />
      <SEOContentSection />
    </div>
  );
}
