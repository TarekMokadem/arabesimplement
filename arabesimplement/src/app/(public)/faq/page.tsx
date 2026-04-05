import Link from "next/link";
import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { PUBLIC_FAQ_ENTRIES } from "@/lib/content/public-faq";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes sur les formations ArabeSimplement : par où commencer, après l’achat, cours en ligne, contact.",
  openGraph: {
    title: "FAQ | ArabeSimplement",
    description:
      "Réponses aux questions les plus courantes sur nos parcours et notre organisation.",
    url: (() => {
      const b = getSiteUrl();
      return b ? `${b}/faq` : "/faq";
    })(),
  },
};

export default function FaqPage() {
  return (
    <div className="pt-20 pb-16">
      <PageHeader
        title="Foire aux questions"
        subtitle="Réponses courtes sur nos parcours, l’organisation des cours et la suite d’un achat."
      />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <Badge className="bg-secondary/10 text-secondary border-secondary/25">
            Aide
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HelpCircle className="h-4 w-4 text-secondary shrink-0" aria-hidden />
            Besoin d’un contact direct ?{" "}
            <Link
              href="/contactez-nous"
              className="text-secondary font-medium underline-offset-2 hover:underline"
            >
              Écrivez-nous
            </Link>
          </div>
        </div>

        <ul className="space-y-6">
          {PUBLIC_FAQ_ENTRIES.map((item) => (
            <li
              key={item.q}
              className="rounded-xl border border-gray-100 bg-white p-6 md:p-7 shadow-sm"
            >
              <h2 className="font-serif text-lg md:text-xl font-bold text-primary mb-3 leading-snug">
                {item.q}
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                {item.a}
              </p>
              {item.href && item.cta ? (
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-primary text-primary"
                  )}
                >
                  {item.cta}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-xl bg-surface border border-gray-100 p-6 text-center">
          <p className="text-gray-700 mb-4">
            Vous n’avez pas trouvé votre réponse ? Les pages suivantes peuvent
            aussi aider.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/par-ou-commencer"
              className={cn(buttonVariants({ size: "sm" }), "bg-primary text-primary-foreground")}
            >
              Par où commencer
            </Link>
            <Link
              href="/comment-ca-marche"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-primary text-primary"
              )}
            >
              Comment ça marche
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
