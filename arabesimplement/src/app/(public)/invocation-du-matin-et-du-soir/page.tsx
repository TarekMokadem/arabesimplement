import Link from "next/link";
import { ArrowRight, Sun, Moon, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";

const invocations = [
  {
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    transliteration: "Asbahnâ wa asbaha-l-mulku lillâh",
    translation: "Nous voilà au matin et le royaume appartient à Allah",
    time: "matin",
  },
  {
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    transliteration: "Amsaynâ wa amsa-l-mulku lillâh",
    translation: "Nous voilà au soir et le royaume appartient à Allah",
    time: "soir",
  },
  {
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
    transliteration: "Bismillâhi-lladhî lâ yadurru ma'a-smihi shay'un",
    translation: "Au nom d'Allah, avec le nom duquel rien ne peut nuire",
    time: "les deux",
  },
];

export default function InvocationsPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Invocations du matin et du soir"
        subtitle="Les adhkâr quotidiens pour protéger votre journée et votre nuit."
      />

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-arabic text-3xl text-secondary mb-6" dir="rtl">
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </p>
          <p className="text-gray-600 text-lg mb-8">
            &quot;N&apos;est-ce pas par l&apos;évocation d&apos;Allah que les cœurs se tranquillisent ?&quot;
            <br />
            <span className="text-sm">- Sourate Ar-Ra&apos;d, verset 28</span>
          </p>
          <p className="text-gray-600 leading-relaxed">
            Les invocations du matin et du soir (أذكار الصباح والمساء) sont une protection contre le mal et une source de bénédictions. Les réciter quotidiennement est une pratique recommandée par le Prophète ﷺ.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white text-center">
              <CardContent className="p-6">
                <Sun className="h-10 w-10 text-secondary mx-auto mb-4" />
                <h3 className="font-serif font-bold text-primary mb-2">
                  Protection du matin
                </h3>
                <p className="text-gray-600 text-sm">
                  Commencez votre journée sous la protection d&apos;Allah.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-center">
              <CardContent className="p-6">
                <Moon className="h-10 w-10 text-secondary mx-auto mb-4" />
                <h3 className="font-serif font-bold text-primary mb-2">
                  Sérénité du soir
                </h3>
                <p className="text-gray-600 text-sm">
                  Terminez votre journée en paix et gratitude.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-center">
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-secondary mx-auto mb-4" />
                <h3 className="font-serif font-bold text-primary mb-2">
                  Bouclier spirituel
                </h3>
                <p className="text-gray-600 text-sm">
                  Une protection contre le mal et les épreuves.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white text-center">
              <CardContent className="p-6">
                <Heart className="h-10 w-10 text-secondary mx-auto mb-4" />
                <h3 className="font-serif font-bold text-primary mb-2">
                  Apaisement du cœur
                </h3>
                <p className="text-gray-600 text-sm">
                  Le dhikr apporte paix et tranquillité intérieure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Invocations */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-primary text-center mb-12">
            Exemples d&apos;invocations
          </h2>

          <div className="space-y-6">
            {invocations.map((inv, index) => (
              <Card key={index} className="bg-surface border-l-4 border-secondary">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-primary text-white text-xs rounded-full">
                      {inv.time === "matin" ? "Matin" : inv.time === "soir" ? "Soir" : "Matin & Soir"}
                    </span>
                  </div>
                  <p className="font-arabic text-2xl text-primary text-right mb-4" dir="rtl">
                    {inv.arabic}
                  </p>
                  <p className="text-secondary italic mb-2">{inv.transliteration}</p>
                  <p className="text-gray-600">{inv.translation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Apprenez les invocations complètes
          </h2>
          <p className="text-gray-300 mb-8">
            Notre formation vous accompagne dans la mémorisation et la compréhension de chaque invocation.
          </p>
          <Link href="/boutique/sessions-invocations">
            <Button className="bg-secondary text-secondary-foreground hover:bg-white hover:text-primary px-8 py-6 text-lg">
              Rejoindre les sessions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
