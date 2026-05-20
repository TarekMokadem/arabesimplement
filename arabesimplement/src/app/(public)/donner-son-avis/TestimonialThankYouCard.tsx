import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialThankYouCard() {
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
      </CardContent>
    </Card>
  );
}
