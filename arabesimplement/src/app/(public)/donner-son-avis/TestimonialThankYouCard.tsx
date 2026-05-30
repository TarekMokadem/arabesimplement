import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TestimonialThankYouCard({ token }: { token: string }) {
  const formHref = `/donner-son-avis?token=${encodeURIComponent(token)}`;

  return (
    <Card className="max-w-lg mx-auto bg-white shadow-sm border border-gray-100">
      <CardContent className="p-8 sm:p-10 text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-accent mx-auto" aria-hidden />
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
          Merci pour votre témoignage
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Votre avis a bien été enregistré. Il sera publié sur le site après
          validation par l&apos;équipe ArabeSimplement.
        </p>
        <Link
          href={formHref}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex border-secondary text-secondary hover:bg-secondary/10"
          )}
        >
          Déposer un autre avis
        </Link>
      </CardContent>
    </Card>
  );
}
