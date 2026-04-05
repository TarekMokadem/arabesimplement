import Link from "next/link";
import {
  BookOpenCheck,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ShoppingBag,
    title: "Choisir et régler sur la boutique",
    description:
      "Vous ajoutez la formation au panier, renseignez vos coordonnées, acceptez le règlement intérieur et payez en ligne de façon sécurisée.",
  },
  {
    icon: BookOpenCheck,
    title: "Confirmation et accès",
    description:
      "Après paiement, vous obtenez une confirmation ; un compte élève peut être créé pour suivre vos achats et votre historique.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord",
    description:
      "Retrouvez vos formations, choisissez votre créneau si nécessaire, gérez un abonnement « cours à la carte » et contactez l’équipe par WhatsApp (selon votre profil).",
  },
  {
    icon: Sparkles,
    title: "Cours et organisation",
    description:
      "Chaque fiche formation précise le mode : créneaux proposés, organisation flexible avec le professeur, ou séances à la carte avec durée et tarif adaptés.",
  },
] as const;

/** Explique le déroulé réel après achat — réassurance sans promesse type « LMS complet ». */
export function AfterPurchaseJourneySection() {
  return (
    <section
      id="apres-votre-achat"
      className="py-20 md:py-24 bg-white border-y border-gray-100 scroll-mt-24"
      aria-labelledby="titre-apres-achat"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-12 md:mb-14">
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/25">
            Déroulé
          </Badge>
          <h2
            id="titre-apres-achat"
            className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4"
          >
            Après votre achat, comment ça se passe ?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Pas de surprise : voici les étapes concrètes, de la commande à la
            mise en route avec nos enseignants.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-gray-100 bg-surface/80 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-serif font-bold text-sm">
                  {index + 1}
                </span>
                <step.icon className="h-6 w-6 text-secondary shrink-0" aria-hidden />
              </div>
              <h3 className="font-semibold text-primary mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
          <Link
            href="/par-ou-commencer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            Par où commencer selon mon objectif ?
          </Link>
          <Link
            href="/boutique"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    </section>
  );
}
