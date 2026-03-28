import Link from "next/link";
import { CheckCircle, Mail, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutStepper } from "@/components/shop/CheckoutStepper";
import { ConfirmationCleanup } from "@/components/shop/ConfirmationCleanup";
import { getSession } from "@/app/(auth)/actions";

export default async function ConfirmationPage() {
  const session = await getSession();
  const espaceHref =
    session?.role === "ADMIN" ? "/admin" : "/tableau-de-bord";

  return (
    <div className="pt-20 min-h-screen bg-surface">
      <ConfirmationCleanup />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <CheckoutStepper currentStep={4} />

        <Card className="bg-white text-center">
          <CardContent className="p-12">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>

            <h1 className="font-serif text-3xl font-bold text-primary mb-4">
              Votre inscription est confirmée !
            </h1>

            <p className="text-gray-600 mb-8">
              Merci pour votre confiance. Votre paiement a bien été reçu.
            </p>

            {/* Next Steps */}
            <div className="bg-surface rounded-xl p-6 text-left mb-8">
              <h2 className="font-serif font-bold text-primary mb-4">
                Prochaines étapes
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">
                      Email de confirmation
                    </p>
                    <p className="text-sm text-gray-500">
                      Vous allez recevoir un email avec les détails de votre
                      commande et un lien pour choisir votre créneau.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">
                      Choix du créneau
                    </p>
                    <p className="text-sm text-gray-500">
                      Cliquez sur le lien dans l&apos;email pour sélectionner le
                      créneau qui vous convient le mieux.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arabic Quote */}
            <div className="mb-8">
              <p
                className="font-arabic text-2xl text-secondary mb-2"
                dir="rtl"
              >
                بارك الله فيكم
              </p>
              <p className="text-gray-500 text-sm">
                Qu&apos;Allah vous bénisse
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={espaceHref}>
                <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                  Accéder à mon espace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-primary text-primary"
                >
                  Retour à l&apos;accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
