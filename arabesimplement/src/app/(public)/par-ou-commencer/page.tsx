import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  HelpCircle,
  Library,
  MoonStar,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const suggestions = [
  {
    icon: BookOpen,
    title: "Apprendre à lire l’arabe",
    description:
      "Vous débutez ou voulez une base solide en lecture (alphabet, fusion, lecture de textes simples).",
    primary: { href: "/cours-darabe", label: "Présentation du parcours" },
    secondary: {
      href: "/boutique/lire-en-10-lecons",
      label: "Formation « Lire en 10 leçons »",
    },
  },
  {
    icon: MoonStar,
    title: "Tajwid et récitation",
    description:
      "Vous souhaitez mieux réciter le Coran et respecter les règles de récitation.",
    primary: { href: "/tajwid", label: "Découvrir le Tajwid" },
    secondary: {
      href: "/boutique/formation-tajwid",
      label: "Voir la formation Tajwid",
    },
  },
  {
    icon: Library,
    title: "Invocations et rappels du quotidien",
    description:
      "Mémoriser et comprendre les invocations du matin et du soir avec accompagnement.",
    primary: {
      href: "/invocation-du-matin-et-du-soir",
      label: "Présentation des invocations",
    },
    secondary: {
      href: "/boutique/sessions-invocations",
      label: "Sessions invocations",
    },
  },
  {
    icon: HelpCircle,
    title: "Je ne sais pas encore",
    description:
      "Vous hésitez entre plusieurs parcours ou avez un cas particulier (niveau, disponibilités).",
    primary: { href: "/contactez-nous", label: "Nous contacter" },
    secondary: { href: "/boutique", label: "Parcourir toute la boutique" },
  },
] as const;

const faqs = [
  {
    question: "Quelle est la différence entre les filtres Arabe et Religion ?",
    answer:
      "Arabe regroupe surtout l’apprentissage de la langue (lecture, méthode…). Religion regroupe les parcours orientés vers le Coran, le tajwid, les invocations ou les sciences religieuses. Un futur « pack mixte » réunira les deux sur une même offre.",
  },
  {
    question: "Comment savoir comment les cours seront organisés après l’achat ?",
    answer:
      "Sur chaque fiche formation, le mode d’organisation est expliqué : créneaux proposés, forfait avec organisation libre avec le professeur, ou cours à la carte avec abonnement hebdomadaire possible. Après paiement, votre tableau de bord centralise les prochaines étapes (créneau, contact WhatsApp, etc.).",
  },
  {
    question: "Je débute totalement en arabe, par où passer ?",
    answer:
      "En général par la lecture : consultez la page « Cours d’arabe » et la formation « Lire en 10 leçons ». Si vous hésitez encore, écrivez-nous via la page contact.",
  },
  {
    question: "Puis-je combiner plusieurs formations ?",
    answer:
      "Oui : ajoutez plusieurs formations au panier si elles sont proposées à l’achat. Pour un parcours sur mesure ou des contraintes horaires, le contact direct reste le plus simple.",
  },
] as const;

export default function ParOuCommencerPage() {
  return (
    <div className="pt-20">
      <PageHeader
        title="Par où commencer ?"
        subtitle="Quelques repères selon votre objectif. Chaque formation indique sur sa fiche comment les cours sont organisés (créneaux, flexible ou cours à la carte)."
      />

      <section className="py-14 bg-surface">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-8">
            {suggestions.map((item) => (
              <Card
                key={item.title}
                className="bg-white border-gray-100 shadow-sm overflow-hidden"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                      <item.icon className="h-6 w-6" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-xl font-bold text-primary mb-2">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                        {item.description}
                      </p>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        <Link href={item.primary.href}>
                          <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
                            {item.primary.label}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={item.secondary.href}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "border-primary text-primary w-full sm:w-auto"
                          )}
                        >
                          {item.secondary.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-600">
            Vous avez déjà une idée précise ? Parcourez les domaines{" "}
            <strong className="text-primary font-medium">Arabe</strong> et{" "}
            <strong className="text-primary font-medium">Religion</strong> depuis
            la{" "}
            <Link href="/boutique" className="text-secondary font-medium underline">
              boutique
            </Link>
            .
          </p>
        </div>
      </section>

      <section
        className="py-16 md:py-20 bg-white border-t border-gray-100"
        aria-labelledby="faq-par-ou-commencer"
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2
            id="faq-par-ou-commencer"
            className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2"
          >
            Questions fréquentes
          </h2>
          <p className="text-gray-600 text-sm mb-10">
            Réponses courtes ; pour un cas personnel, la{" "}
            <Link
              href="/contactez-nous"
              className="text-secondary font-medium underline"
            >
              page contact
            </Link>{" "}
            reste la plus adaptée.
          </p>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group py-4 md:py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-primary">
                  <span>{item.question}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed pr-8">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
