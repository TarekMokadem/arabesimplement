import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CoursDeDinPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Cours de din"
        subtitle="Sciences religieuses : apprentissage structuré, en petit groupe ou selon les parcours proposés sur la boutique."
      />

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-gray-600 leading-relaxed space-y-6">
          <p>
            Les cours de din couvrent les fondements de la religion (fiqh, aqida,
            sira, etc.) selon les parcours proposés par l&apos;équipe. Les
            modalités (créneaux, groupe, organisation) précisent sur chaque fiche
            formation de la boutique.
          </p>
          <p>
            Pour un enseignement à la carte avec abonnement hebdomadaire, les
            formations concernées sont indiquées sur leur page avec le mode « cours
            à la carte ».
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/boutique">
              <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                <BookOpen className="mr-2 h-4 w-4" />
                Voir la boutique
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contactez-nous">
              <Button variant="outline" className="border-primary text-primary">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
