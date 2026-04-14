"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutStepper } from "@/components/shop/CheckoutStepper";
import { CartItemDetailList } from "@/components/shop/CartItemDetailList";
import { StripePaymentSection } from "@/components/shop/StripePaymentSection";
import { PaypalMeCheckoutBlock } from "@/components/shop/PaypalMeCheckoutBlock";
import { PaymentExperiencePreface } from "@/components/shop/PaymentExperiencePreface";
import { useCart } from "@/hooks/useCart";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";
import type { StoredCheckoutOrder } from "@/types/checkout.types";
import { migrateRawCartItem, type CartItem } from "@/store/cart.store";
import { finalizeMockPayment } from "@/app/(shop)/actions/order.actions";

function parseOrderInfo(raw: string | null): StoredCheckoutOrder | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredCheckoutOrder;
  } catch {
    return null;
  }
}

export default function PaiementPage() {
  const router = useRouter();
  const { items, getTotal, isHydrated: cartHydrated } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<StoredCheckoutOrder | null>(null);

  useEffect(() => {
    if (!cartHydrated) return;
    const raw = sessionStorage.getItem("orderInfo");
    const parsed = parseOrderInfo(raw);
    if (!parsed) {
      if (items.length === 0) {
        router.push("/panier");
      } else {
        router.push("/commande/informations");
      }
      return;
    }
    setOrderInfo(parsed);
  }, [items.length, router, cartHydrated]);

  const displayItems: CartItem[] = useMemo(() => {
    const raw = items.length > 0 ? items : orderInfo?.items ?? [];
    return raw.map((row) => migrateRawCartItem(row));
  }, [items, orderInfo]);

  const total = useMemo(() => {
    if (orderInfo?.total != null) return orderInfo.total;
    return getTotal();
  }, [orderInfo, getTotal]);

  const amountLabel = formatPrice(total);

  const useStripeCheckout =
    orderInfo?.paymentMode === "stripe" &&
    !!orderInfo.clientSecret &&
    !!orderInfo.stripePublishableKey;

  const confirmationQuery = useMemo(() => {
    if (!orderInfo?.orderId || !orderInfo?.email) return "";
    return new URLSearchParams({
      orderId: orderInfo.orderId,
      email: orderInfo.email,
    }).toString();
  }, [orderInfo]);

  const handleMockPayment = async () => {
    setIsLoading(true);
    try {
      if (orderInfo?.orderId) {
        const result = await finalizeMockPayment(orderInfo.orderId);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
      }
      toast.success("Paiement enregistré !");
      router.push(
        confirmationQuery
          ? `/commande/confirmation?${confirmationQuery}`
          : "/commande/confirmation"
      );
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ne pas vider le panier ni sessionStorage ici : le useEffect de cette page
   * redirigerait vers /panier (course avec router.push). Le nettoyage est fait
   * sur /commande/confirmation via ConfirmationCleanup.
   */
  const handleStripePaid = () => {
    toast.success("Paiement réussi !");
    router.push(
      confirmationQuery
        ? `/commande/confirmation?${confirmationQuery}`
        : "/commande/confirmation"
    );
  };

  if (!cartHydrated) {
    return (
      <div className="pt-20 min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!orderInfo && items.length === 0) {
    return null;
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <CheckoutStepper currentStep={3} />

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
          Paiement sécurisé
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          {orderInfo?.checkoutKind === "hourly_only"
            ? "Abonnement : règlement via Stripe uniquement (carte ou PayPal intégré au formulaire Stripe si activé)."
            : "Règlement par carte ou PayPal via Stripe, ou virement direct PayPal.me selon votre choix ci-dessous."}
        </p>

        {orderInfo?.checkoutKind === "hourly_only" ? (
          <div className="mb-6 p-4 rounded-lg border border-secondary/40 bg-secondary/5 text-sm text-gray-700">
            <p className="font-medium text-primary mb-1">
              Abonnement mensuel (cours à la carte)
            </p>
            <p>
              Le montant affiché correspond à votre première période mensuelle.
              Le même prélèvement est renouvelé automatiquement chaque mois pour
              chaque ligne du panier, jusqu’à résiliation ou ajustement avec
              l’équipe après la création du compte.
            </p>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Lock className="h-5 w-5 text-accent" />
                  <span className="text-sm text-gray-600">
                    Paiement sécurisé (Stripe — carte ou PayPal selon affichage)
                  </span>
                </div>

                {useStripeCheckout &&
                orderInfo.stripePublishableKey &&
                orderInfo.clientSecret &&
                confirmationQuery ? (
                  <>
                    <PaymentExperiencePreface />
                    <StripePaymentSection
                      publishableKey={orderInfo.stripePublishableKey}
                      clientSecret={orderInfo.clientSecret}
                      amountLabel={amountLabel}
                      onPaid={handleStripePaid}
                      confirmationSearchParams={confirmationQuery}
                    />
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-500 mb-4">
                        {orderInfo?.paymentMode === "mock"
                          ? "Mode démonstration : finalisez sans carte lorsque Stripe n’est pas configuré."
                          : "Préparez votre moyen de paiement."}
                      </p>
                      <div className="space-y-3">
                        <div className="h-12 bg-white border rounded-md flex items-center px-4">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-400">
                            4242 4242 4242 4242 (avec Stripe activé)
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleMockPayment}
                      disabled={isLoading}
                      className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-6 text-lg"
                      data-testid="pay-button"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" />
                          Payer {amountLabel}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {orderInfo &&
                orderInfo.checkoutKind !== "hourly_only" &&
                orderInfo.orderId ? (
                  <>
                    <div className="relative py-2">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden
                      >
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-gray-500 uppercase tracking-wide">
                          ou
                        </span>
                      </div>
                    </div>
                    <PaypalMeCheckoutBlock
                      amountEuros={total}
                      orderId={orderInfo.orderId}
                    />
                  </>
                ) : null}

                <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-400">
                  <span>Paiement sécurisé</span>
                  <span>•</span>
                  <span>Données chiffrées</span>
                  <span>•</span>
                  <span>SSL/TLS</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-serif text-lg font-bold text-primary mb-4">
                  Récapitulatif
                </h2>

                {orderInfo && (
                  <div className="mb-6 pb-4 border-b text-sm">
                    <p className="text-gray-600">
                      {orderInfo.prenom} {orderInfo.nom}
                    </p>
                    <p className="text-gray-500">{orderInfo.email}</p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {displayItems.map((item) => (
                    <div
                      key={item.lineId}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <div className="text-gray-600 min-w-0 flex-1">
                        <span className="block font-medium text-primary">
                          {item.titre}
                        </span>
                        <CartItemDetailList item={item} size="sm" />
                      </div>
                      <span className="font-medium text-primary shrink-0">
                        {formatPrice(item.prixPromo ?? item.prix)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {amountLabel}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
