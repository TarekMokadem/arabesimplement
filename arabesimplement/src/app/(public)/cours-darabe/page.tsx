import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";

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

      {/* Method Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-[#B7860B]/10 text-[#B7860B] border-[#B7860B]/20">
                Notre méthode
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0F2A45] mb-6">
                Apprendre à lire l&apos;arabe, étape par étape
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Notre programme a été conçu spécifiquement pour les francophones qui partent de zéro. Chaque leçon s&apos;appuie sur la précédente, vous permettant de progresser naturellement sans jamais vous sentir submergé.
              </p>

              <div className="space-y-4">
                {methodSteps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-[#0F2A45] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[#B7860B] font-bold text-sm">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F2A45]">{step.title}</h3>
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
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#B7860B] rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-[#0F2A45] mb-4">
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
                  <CheckCircle className="h-6 w-6 text-[#1A7A4A] flex-shrink-0" />
                  <span className="text-[#0F2A45]">{benefit}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/boutique/lire-en-10-lecons">
              <Button className="bg-[#B7860B] hover:bg-[#0F2A45] text-white px-8 py-6 text-lg">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#0F2A45] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#B7860B] mb-2">500+</div>
              <p className="text-gray-300">Étudiants formés</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#B7860B] mb-2">10</div>
              <p className="text-gray-300">Leçons seulement</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#B7860B] mb-2">4.9/5</div>
              <p className="text-gray-300">Note moyenne</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#B7860B] mb-2">8€</div>
              <p className="text-gray-300">Prix accessible</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
