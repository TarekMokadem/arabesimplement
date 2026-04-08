import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { HOME_FAQ_TEASER_ITEMS } from "@/lib/content/public-faq";

export function HomeFaqTeaser() {
  return (
    <section
      className="py-20 md:py-24 bg-white border-y border-gray-100"
      aria-labelledby="titre-faq-accueil"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
            Trois réponses courtes — la{" "}
            <Link href="/faq" className="text-secondary font-medium underline-offset-2 hover:underline">
              FAQ complète
            </Link>{" "}
            regroupe d&apos;autres questions fréquentes.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {HOME_FAQ_TEASER_ITEMS.map((item) => (
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
              {item.href != null && item.cta != null ? (
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-primary text-primary w-fit"
                  )}
                >
                  {item.cta}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
