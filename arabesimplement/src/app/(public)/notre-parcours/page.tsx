import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NotreParcours() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Notre Parcours"
        subtitle="L'histoire d'ArabeSimplement et notre mission d'enseigner l'arabe à tous."
      />

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-3xl font-bold text-primary mb-8">
              D&apos;où vient ArabeSimplement ?
            </h2>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              Tout a commencé en Égypte, où notre fondateur s&apos;est installé pour approfondir ses connaissances de la langue arabe et des sciences islamiques. Face aux nombreuses demandes de francophones souhaitant apprendre l&apos;arabe, une évidence s&apos;est imposée : il fallait créer une méthode adaptée.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Après des années d&apos;enseignement et d&apos;expérimentation, la méthode &quot;Lire en 10 leçons&quot; est née. Son objectif ? Permettre à n&apos;importe quel francophone, même sans aucune connaissance préalable, d&apos;apprendre à lire l&apos;arabe en un temps record.
            </p>

            <div className="my-12 relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80"
                alt="Égypte - pyramides"
                fill
                className="object-cover"
              />
            </div>

            <h3 className="font-serif text-2xl font-bold text-primary mb-4">
              Notre mission
            </h3>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              Notre mission est simple : rendre l&apos;apprentissage de l&apos;arabe accessible à tous les francophones, quel que soit leur niveau de départ. Nous croyons fermement que chaque musulman devrait pouvoir lire le Coran dans sa langue originale.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              C&apos;est pourquoi nous proposons des formations à des prix accessibles, avec un accompagnement personnalisé pour ceux qui en ont besoin. Notre approche se veut bienveillante, progressive et efficace.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              Nos valeurs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                Bienveillance
              </h3>
              <p className="text-gray-600">
                Nous accompagnons chaque étudiant avec patience et encouragement, sans jugement.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                Excellence
              </h3>
              <p className="text-gray-600">
                Nous visons l&apos;excellence dans notre pédagogie et nos contenus de formation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                Accessibilité
              </h3>
              <p className="text-gray-600">
                L&apos;apprentissage de l&apos;arabe doit être accessible à tous, sans barrière financière.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="font-arabic text-3xl text-secondary mb-6" dir="rtl">
            وَعَلَّمَكَ مَا لَمْ تَكُن تَعْلَمُ
          </p>
          <p className="text-gray-300 mb-8">
            &quot;Et Il t&apos;a enseigné ce que tu ne savais pas&quot; - Sourate An-Nisa, verset 113
          </p>
          <Link href="/boutique">
            <Button className="bg-secondary text-secondary-foreground hover:bg-white hover:text-primary px-8 py-6 text-lg">
              Commencer mon apprentissage
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
