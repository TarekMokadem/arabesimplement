import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Award, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SessionDuMoment } from "@/components/shop/SessionDuMoment";

// Session du moment section
function SessionDuMomentSection({ expiresAt }: { expiresAt: Date }) {
  return (
    <SessionDuMoment
      titre="Formation Tajwid - Offre spéciale"
      description="Maîtrisez les règles de récitation du Coran avec notre formation complète. Accès à vie + groupe WhatsApp de suivi."
      badge="Offre limitée"
      prix={75}
      prixPromo={49}
      slug="formation-tajwid"
      expiresAt={expiresAt}
    />
  );
}

// Hero Section
function HeroSection() {
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A45]/90 via-[#0F2A45]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-2xl">
          <Badge className="mb-6 bg-[#B7860B]/20 text-[#B7860B] border-[#B7860B]/30 hover:bg-[#B7860B]/30">
            Méthode révolutionnaire
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Une méthode encore jamais vue pour{" "}
            <span className="text-[#B7860B]">apprendre l&apos;arabe</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Tu vas apprendre à lire en l&apos;espace de{" "}
            <span className="font-bold text-white">10 leçons</span>. Une
            approche unique, pensée pour les francophones.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/boutique/lire-en-10-lecons">
              <Button
                size="lg"
                className="bg-[#B7860B] hover:bg-[#D4AF37] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
                className="border-2 border-white text-white hover:bg-white hover:text-[#0F2A45] px-8 py-6 text-lg transition-all duration-300"
                data-testid="hero-cta-secondary"
              >
                Voir les cours
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-[#B7860B] border-2 border-[#0F2A45] flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">{i}</span>
                  </div>
                ))}
              </div>
              <span className="text-white text-sm">+500 étudiants</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#B7860B] text-[#B7860B]"
                />
              ))}
              <span className="text-white text-sm ml-2">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Offers Section
const offers = [
  {
    title: "Programme 100% Autonome",
    subtitle: "À votre rythme",
    price: 8,
    features: [
      "Accès à toutes les vidéos",
      "Livre PDF fourni",
      "Progression à votre rythme",
      "Accès à vie",
    ],
    popular: false,
    color: "bg-white",
  },
  {
    title: "Équilibre",
    subtitle: "Le meilleur compromis",
    price: 25,
    features: [
      "Tout le programme Autonome",
      "Suivi personnalisé à distance",
      "4h de cours particuliers",
      "Groupe WhatsApp",
    ],
    popular: true,
    color: "bg-[#F9F7F2]",
  },
  {
    title: "Maîtrise",
    subtitle: "Accompagnement total",
    price: 75,
    features: [
      "Accès à vie à toutes les formations",
      "Cours personnalisés illimités",
      "Accompagnement individuel",
      "Certificat de fin de formation",
    ],
    popular: false,
    color: "bg-white",
  },
];

function OffersSection() {
  return (
    <section className="py-24 bg-white" data-testid="offers-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#1A7A4A]/10 text-[#1A7A4A] border-[#1A7A4A]/20">
            Nos offres
          </Badge>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F2A45] mb-4">
            Choisissez votre parcours
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trois formules adaptées à vos besoins et votre rythme
            d&apos;apprentissage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <Card
              key={index}
              className={`relative ${offer.color} border-2 ${
                offer.popular ? "border-[#B7860B]" : "border-gray-100"
              } rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl`}
              data-testid={`offer-card-${index}`}
            >
              {offer.popular && (
                <div className="absolute top-0 right-0 bg-[#B7860B] text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  Populaire
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="font-serif text-xl font-bold text-[#0F2A45] mb-1">
                  {offer.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6">{offer.subtitle}</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-[#0F2A45]">
                    {offer.price}€
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {offer.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#1A7A4A] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contactez-nous">
                  <Button
                    className={`w-full ${
                      offer.popular
                        ? "bg-[#B7860B] hover:bg-[#0F2A45]"
                        : "bg-[#0F2A45] hover:bg-[#B7860B]"
                    } text-white`}
                  >
                    Je me lance !
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
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
      title: "Méthode unique",
      description:
        "Une approche pédagogique révolutionnaire, spécialement conçue pour les francophones.",
    },
    {
      icon: Users,
      title: "Suivi personnalisé",
      description:
        "Accompagnement individuel et groupes WhatsApp pour ne jamais être seul(e).",
    },
    {
      icon: Award,
      title: "Résultats garantis",
      description:
        "Apprenez à lire l'arabe en seulement 10 leçons avec notre méthode éprouvée.",
    },
  ];

  return (
    <section className="py-24 bg-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-4 bg-[#B7860B]/10 text-[#B7860B] border-[#B7860B]/20">
              Notre approche
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F2A45] mb-6">
              Apprendre l&apos;arabe, c&apos;est possible pour tout le monde
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Que vous partiez de zéro ou que vous souhaitiez perfectionner
              votre lecture, notre méthode s&apos;adapte à votre niveau et à
              votre rythme. Rejoignez des centaines d&apos;étudiants qui ont
              déjà transformé leur relation avec la langue arabe.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-[#B7860B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-[#B7860B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F2A45] mb-1">
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
              <Button className="bg-[#0F2A45] hover:bg-[#B7860B] text-white">
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
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#B7860B] rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-[#0F2A45] rounded-2xl -z-10" />
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
          <h2 className="font-serif text-3xl font-bold text-[#0F2A45] mb-8">
            Apprendre l&apos;arabe : votre guide complet
          </h2>

          <p className="text-gray-600 leading-relaxed">
            L&apos;apprentissage de l&apos;arabe représente un voyage fascinant
            vers une langue riche de plus de 1400 ans d&apos;histoire.
            L&apos;alphabet arabe, composé de 28 lettres, peut sembler
            intimidant au premier abord, mais avec la bonne méthode, il devient
            accessible à tous.
          </p>

          <h3 className="font-serif text-2xl font-bold text-[#0F2A45] mt-12 mb-4">
            Pourquoi apprendre l&apos;arabe ?
          </h3>
          <p className="text-gray-600 leading-relaxed">
            L&apos;arabe est la cinquième langue la plus parlée au monde, avec
            plus de 420 millions de locuteurs natifs. C&apos;est également la
            langue du Coran, ce qui en fait une langue essentielle pour les
            musulmans du monde entier souhaitant comprendre les textes sacrés
            dans leur version originale.
          </p>

          <h3 className="font-serif text-2xl font-bold text-[#0F2A45] mt-12 mb-4">
            Notre méthode en 10 leçons
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Notre approche pédagogique unique permet d&apos;apprendre à lire
            l&apos;arabe en seulement 10 leçons. Chaque leçon est construite de
            manière progressive, vous permettant de maîtriser les lettres, les
            voyelles et les règles de lecture étape par étape.
          </p>

          <h3 className="font-serif text-2xl font-bold text-[#0F2A45] mt-12 mb-4">
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

// Main Page Component
export default function HomePage() {
  // Session du moment - expires dans 7 jours
  const sessionExpires = new Date();
  sessionExpires.setDate(sessionExpires.getDate() + 7);

  return (
    <div className="pt-20">
      <HeroSection />
      <SessionDuMomentSection expiresAt={sessionExpires} />
      <FeaturesSection />
      <OffersSection />
      <SEOContentSection />
    </div>
  );
}
