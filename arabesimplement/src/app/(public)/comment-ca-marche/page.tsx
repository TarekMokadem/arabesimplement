import type { Metadata } from "next";
import Link from "next/link";
import { AfterPurchaseJourneySection } from "@/components/home/AfterPurchaseJourneySection";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Après votre achat : confirmation, accès au tableau de bord, créneaux, WhatsApp et organisation des cours — étapes concrètes chez ArabeSimplement.",
  openGraph: {
    title: "Comment ça marche | ArabeSimplement",
    description:
      "Le déroulé après achat : de la commande à la mise en route avec nos enseignants.",
    url: (() => {
      const b = getSiteUrl();
      return b ? `${b}/comment-ca-marche` : "/comment-ca-marche";
    })(),
  },
};

export default function CommentCaMarchePage() {
  return (
    <div className="pt-20 bg-surface min-h-screen">
      <header className="bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
          <p className="text-secondary font-medium text-sm uppercase tracking-wide mb-3">
            ArabeSimplement
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 max-w-3xl">
            Comment ça marche ?
          </h1>
          <p className="text-gray-200 max-w-2xl text-lg leading-relaxed">
            Pas de jargon : voici ce qui se passe après un achat, de la
            validation du paiement à l’organisation de vos cours en ligne.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/par-ou-commencer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-secondary text-secondary-foreground hover:bg-white hover:text-primary"
              )}
            >
              Par où commencer selon mon objectif ?
            </Link>
            <Link
              href="/boutique"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white text-white hover:bg-white/15"
              )}
            >
              Boutique
            </Link>
          </div>
        </div>
      </header>

      <AfterPurchaseJourneySection />

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gray-600 leading-relaxed mb-6">
            Une question précise sur une formation ou un créneau ? Écrivez-nous
            ou consultez la page contact — nous vous répondons dans les
            meilleurs délais.
          </p>
          <Link
            href="/contactez-nous"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
