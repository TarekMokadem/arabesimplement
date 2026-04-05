import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const sessionHighlights = [
  {
    title: "J'apprends à lire l'arabe — module 1",
    description:
      "Première brique de notre parcours lecture : alphabet, sons et premiers pas pour déchiffrer l'arabe avec une méthode progressive, pensée pour les francophones.",
    imageSrc: "/images/sessions/module-lire-arabe-1.png",
    imageAlt:
      "Couverture du module 1 « J'apprends à lire l'arabe », ArabeSimplement",
    href: "/boutique/lire-en-10-lecons",
    cta: "Voir la formation",
    imageBgClass:
      "bg-[radial-gradient(ellipse_95%_85%_at_50%_35%,#e8f6fc_0%,#d5f0f0_42%,#fceeeb_88%)] ring-1 ring-teal-900/10",
    imagePadClass: "p-5 md:p-7",
  },
  {
    title: "Session invocations — groupe femmes",
    description:
      "Accompagnement structuré sur les invocations du matin et du soir : cadre bienveillant, rappels utiles et pratique régulière entre sœurs.",
    imageSrc: "/images/sessions/session-invocations-femme.png",
    imageAlt:
      "Visuel « Session invocations du matin et du soir », groupe femmes, ArabeSimplement",
    href: "/boutique/sessions-invocations",
    cta: "Découvrir la session",
    imageBgClass:
      "bg-[radial-gradient(ellipse_90%_75%_at_50%_45%,#5c4478_0%,#3d2a52_38%,#1a0f24_100%)] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.12)]",
    imagePadClass: "p-3 md:p-4",
  },
  {
    title: "Session invocations — groupe hommes",
    description:
      "Même parcours d'invocations du matin et du soir, dans un groupe réservé aux hommes, pour avancer sereinement avec un enseignant adapté.",
    imageSrc: "/images/sessions/session-invocations-homme.png",
    imageAlt:
      "Visuel « Session invocations du matin et du soir », groupe hommes, ArabeSimplement",
    href: "/boutique/sessions-invocations",
    cta: "Découvrir la session",
    imageBgClass:
      "bg-[radial-gradient(ellipse_90%_75%_at_50%_45%,#2a8a7e_0%,#1a5c54_40%,#0c2522_100%)] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1)]",
    imagePadClass: "p-3 md:p-4",
  },
] as const;

const methodSteps = [
  {
    number: "01",
    title: "Les lettres isolées",
    description: "Apprenez à reconnaître et prononcer chaque lettre de l'alphabet arabe.",
  },
  {
    number: "02",
    title: "Les voyelles courtes",
    description: "Maîtrisez les trois voyelles de base : fatha, kasra et damma.",
  },
  {
    number: "03",
    title: "Les lettres attachées",
    description: "Découvrez comment les lettres se transforment selon leur position.",
  },
  {
    number: "04",
    title: "Les voyelles longues",
    description: "Perfectionnez votre lecture avec les prolongations.",
  },
  {
    number: "05",
    title: "La lecture fluide",
    description: "Lisez vos premiers textes en arabe avec confiance.",
  },
];

const benefits = [
  "Méthode progressive adaptée aux débutants",
  "Vidéos HD avec sous-titres français",
  "Exercices pratiques après chaque leçon",
  "Support PDF téléchargeable",
  "Accès illimité à vie",
  "Groupe WhatsApp pour les questions",
];

export default function CoursDarabePage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Cours d'arabe"
        subtitle="Découvrez notre méthode unique pour apprendre à lire l'arabe en seulement 10 leçons."
      />

      <section className="py-16 md:py-20 bg-surface border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
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
                    "relative aspect-[4/3] w-full",
                    session.imageBgClass
                  )}
                >
                  <Image
                    src={session.imageSrc}
                    alt={session.imageAlt}
                    fill
                    className={cn(
                      "object-contain drop-shadow-md",
                      session.imagePadClass
                    )}
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

      {/* Method Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                Notre méthode
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">
                Apprendre à lire l&apos;arabe, étape par étape
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Notre programme a été conçu spécifiquement pour les francophones qui partent de zéro. Chaque leçon s&apos;appuie sur la précédente, vous permettant de progresser naturellement sans jamais vous sentir submergé.
              </p>

              <div className="space-y-4">
                {methodSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary font-bold text-sm">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1622228862102-d691d3e2a334?w=800&q=80"
                  alt="Apprentissage de l'arabe"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              Ce qui est inclus
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour réussir votre apprentissage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6 flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-primary">{benefit}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/boutique/lire-en-10-lecons">
              <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
