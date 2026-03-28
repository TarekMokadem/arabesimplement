"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutStepper } from "@/components/shop/CheckoutStepper";
import { StripePaymentSection } from "@/components/shop/StripePaymentSection";
import { PaymentExperiencePreface } from "@/components/shop/PaymentExperiencePreface";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";
import type { StoredCheckoutOrder } from "@/types/checkout.types";
import type { CartItem } from "@/store/cart.store";
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
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<StoredCheckoutOrder | null>(null);

  useEffect(() => {
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
  }, [items.length, router]);

  const displayItems: CartItem[] = useMemo(() => {
    if (items.length > 0) return items;
    return orderInfo?.items ?? [];
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
      clearCart();
      sessionStorage.removeItem("orderInfo");
      toast.success("Paiement enregistré !");
      router.push("/commande/confirmation");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripePaid = () => {
    clearCart();
    sessionStorage.removeItem("orderInfo");
    toast.success("Paiement réussi !");
    router.push("/commande/confirmation");
  };

  if (!orderInfo && items.length === 0) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <CheckoutStepper currentStep={3} />

        <h1 className="font-serif text-3xl font-bold text-primary mb-2">
          Paiement sécurisé
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Règlement via notre prestataire Stripe — cartes bancaires et PayPal
          selon ce qui est proposé dans le formulaire.
        </p>

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
                orderInfo.clientSecret ? (
                  <>
                    <PaymentExperiencePreface />
                    <StripePaymentSection
                      publishableKey={orderInfo.stripePublishableKey}
                      clientSecret={orderInfo.clientSecret}
                      amountLabel={amountLabel}
                      onPaid={handleStripePaid}
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
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[60%]">
                        {item.titre}
                      </span>
                      <span className="font-medium text-primary">
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
