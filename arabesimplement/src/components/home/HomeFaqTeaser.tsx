import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const items = [
  {
    q: "Par où commencer si je ne sais pas quelle formation choisir ?",
    a: "La page « Par où commencer » vous oriente selon votre objectif (lire le Coran, débuter, renforcer la lecture, etc.).",
    href: "/par-ou-commencer",
    cta: "Voir le guide",
  },
  {
    q: "Que se passe-t-il après le paiement ?",
    a: "Vous accédez à votre espace apprenant, aux créneaux ou contacts prévus par la formation, et à WhatsApp selon votre profil — le tout est détaillé étape par étape.",
    href: "/comment-ca-marche",
    cta: "Comment ça marche",
  },
  {
    q: "Les cours sont-ils en ligne uniquement ?",
    a: "Oui : inscription et organisation via le site ; les séances se font en visio avec nos enseignants, selon le mode indiqué sur chaque fiche formation.",
    href: "/boutique",
    cta: "Voir la boutique",
  },
] as const;

export function HomeFaqTeaser() {
  return (
    <section
      className="py-20 md:py-24 bg-white border-y border-gray-100"
      aria-labelledby="titre-faq-accueil"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10 md:mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Questions fréquentes
          </Badge>
          <h2
            id="titre-faq-accueil"
            className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3 flex items-center gap-3"
          >
            <HelpCircle
              className="h-8 w-8 md:h-9 md:w-9 text-secondary shrink-0"
              aria-hidden
            />
            Une question avant de vous lancer ?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Trois réponses courtes ; la page dédiée « Par où commencer » va
            plus loin si besoin.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.q}
              className="rounded-xl border border-gray-100 bg-surface/80 p-6 shadow-sm flex flex-col"
            >
              <h3 className="font-semibold text-primary mb-2 leading-snug">
                {item.q}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
                {item.a}
              </p>
              <Link
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-primary text-primary w-fit"
                )}
              >
                {item.cta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
