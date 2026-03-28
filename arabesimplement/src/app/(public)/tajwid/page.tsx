import Link from "next/link";
import { ArrowRight, BookOpen, Mic, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";

const tajwidRules = [
  {
    title: "Noun Sakin et Tanwin",
    rules: ["Idgham", "Iqlab", "Ikhfa", "Izhar"],
  },
  {
    title: "Mim Sakin",
    rules: ["Idgham Shafawi", "Ikhfa Shafawi", "Izhar Shafawi"],
  },
  {
    title: "Les Prolongations (Madd)",
    rules: ["Madd Tabii", "Madd Muttasil", "Madd Munfasil", "Madd Lazim"],
  },
  {
    title: "Autres règles",
    rules: ["Qalqala", "Ghunna", "Lam Shamsiyya et Qamariyya"],
  },
];

export default function TajwidPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Tajwid"
        subtitle="Maîtrisez les règles de récitation du Coran pour une lecture parfaite."
      />

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            Science de la récitation
          </Badge>
          <h2 className="font-serif text-3xl font-bold text-primary mb-6">
            Qu&apos;est-ce que le Tajwid ?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Le tajwid (تجويد) est l&apos;art de réciter le Coran correctement, en respectant les règles de prononciation et d&apos;articulation établies. Son apprentissage est considéré comme une obligation pour tout musulman souhaitant réciter le Livre d&apos;Allah comme il se doit.
          </p>
          <p className="font-arabic text-2xl text-secondary" dir="rtl">
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </p>
          <p className="text-gray-500 mt-2">
            &quot;Et récite le Coran lentement et clairement&quot; - Al-Muzzammil, 4
          </p>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-4">
              Les principales règles du Tajwid
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre formation couvre l&apos;ensemble des règles essentielles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tajwidRules.map((category, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-bold text-primary mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.rules.map((rule, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <span className="text-gray-600">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-2">
                Théorie complète
              </h3>
              <p className="text-gray-600 text-sm">
                Toutes les règles expliquées clairement avec des exemples tirés du Coran.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-2">
                Audio de qualité
              </h3>
              <p className="text-gray-600 text-sm">
                Écoute et répétition avec des enregistrements de récitateurs reconnus.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary mb-2">
                À votre rythme
              </h3>
              <p className="text-gray-600 text-sm">
                Progressez selon vos disponibilités, avec un accès à vie aux contenus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-6">
            Prêt à perfectionner votre récitation ?
          </h2>
          <Link href="/boutique/formation-tajwid">
            <Button className="bg-secondary text-secondary-foreground hover:bg-white hover:text-primary px-8 py-6 text-lg">
              Découvrir la formation Tajwid
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
