import Link from "next/link";
import { CheckCircle, Mail, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutStepper } from "@/components/shop/CheckoutStepper";
import { ConfirmationCleanup } from "@/components/shop/ConfirmationCleanup";
import { OrderConfirmationRecap } from "@/components/shop/OrderConfirmationRecap";
import { getSession } from "@/app/(auth)/actions";
import { getOrderConfirmationView } from "@/lib/data/order-confirmation.service";
import { Badge } from "@/components/ui/badge";

const SUBS_ANCHOR = "/tableau-de-bord#abonnements-hebdo";

type PageProps = {
  searchParams: Promise<{ orderId?: string; email?: string }>;
};

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const session = await getSession();

  const espaceHref =
    session?.role === "ADMIN" ? "/admin" : "/tableau-de-bord";

  const view = await getOrderConfirmationView(sp.orderId, {
    viewerEmail: sp.email,
    viewerUserId: session?.id ?? null,
  });

  const subscriptionsManageHref =
    session?.role === "STUDENT" || session?.role === "ADMIN"
      ? SUBS_ANCHOR
      : `/connexion?redirect=${encodeURIComponent(SUBS_ANCHOR)}`;

  const genericDetailHint =
    sp.orderId &&
    !view &&
    "Nous n’avons pas pu afficher le détail de cette commande. Vérifiez le lien reçu après paiement ou connectez-vous avec le compte utilisé pour l’achat.";

  return (
    <div className="pt-20 min-h-screen bg-surface">
      <ConfirmationCleanup />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <CheckoutStepper currentStep={4} />

        <Card className="bg-white text-center">
          <CardContent className="p-12">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>

            <h1 className="font-serif text-3xl font-bold text-primary mb-4">
              Votre inscription est confirmée !
            </h1>

            <p className="text-gray-600 mb-2">
              Merci pour votre confiance. Votre paiement a bien été reçu.
            </p>

            {view?.statut === "PAID" ? (
              <div className="flex justify-center mb-6">
                <Badge className="bg-accent/15 text-accent border-accent/30">
                  Paiement confirmé
                </Badge>
              </div>
            ) : null}

            {genericDetailHint ? (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-left">
                {genericDetailHint}
              </p>
            ) : null}

            {view ? (
              <OrderConfirmationRecap
                view={view}
                subscriptionsManageHref={subscriptionsManageHref}
              />
            ) : null}

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
                      Courriel de confirmation
                    </p>
                    <p className="text-sm text-gray-500">
                      Vous recevez les détails de la commande et, si besoin, vos
                      identifiants pour accéder à l&apos;espace apprenant.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">
                      Abonnements cours à la carte
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Mettez en pause, reprenez ou arrêtez vos prélèvements
                      hebdomadaires depuis votre tableau de bord.
                    </p>
                    <Link
                      href={subscriptionsManageHref}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "border-primary text-primary inline-flex"
                      )}
                    >
                      Gérer mes abonnements
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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
