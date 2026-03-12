"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutStepper } from "@/components/shop/CheckoutStepper";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";

export default function PaiementPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{
    prenom: string;
    nom: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Check for order info in session
    const storedInfo = sessionStorage.getItem("orderInfo");
    if (storedInfo) {
      setOrderInfo(JSON.parse(storedInfo));
    } else if (items.length === 0) {
      router.push("/panier");
    }
  }, [items, router]);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // TODO: Integrate real Stripe payment
      // This is a mock payment for demonstration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart and redirect to confirmation
      clearCart();
      sessionStorage.removeItem("orderInfo");
      
      toast.success("Paiement réussi !");
      router.push("/commande/confirmation");
    } catch (error) {
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderInfo && items.length === 0) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-[#F9F7F2]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <CheckoutStepper currentStep={3} />

        <h1 className="font-serif text-3xl font-bold text-[#0F2A45] mb-8">
          Paiement sécurisé
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Lock className="h-5 w-5 text-[#1A7A4A]" />
                  <span className="text-sm text-gray-600">
                    Paiement sécurisé par Stripe
                  </span>
                </div>

                {/* Mock Stripe Elements */}
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500 mb-4">
                      🔒 Interface de paiement Stripe
                    </p>
                    <div className="space-y-3">
                      <div className="h-12 bg-white border rounded-md flex items-center px-4">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-400">
                          4242 4242 4242 4242
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-12 bg-white border rounded-md flex items-center px-4">
                          <span className="text-gray-400">MM / AA</span>
                        </div>
                        <div className="h-12 bg-white border rounded-md flex items-center px-4">
                          <span className="text-gray-400">CVC</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Mode démonstration - Stripe sera intégré avec vos clés API
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-[#B7860B] hover:bg-[#0F2A45] text-white py-6 text-lg"
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
                      Payer {formatPrice(getTotal())}
                    </>
                  )}
                </Button>

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

          {/* Summary */}
          <div>
            <Card className="bg-white sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-serif text-lg font-bold text-[#0F2A45] mb-4">
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
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[60%]">
                        {item.titre}
                      </span>
                      <span className="font-medium text-[#0F2A45]">
                        {formatPrice(item.prixPromo ?? item.prix)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0F2A45]">Total</span>
                    <span className="text-2xl font-bold text-[#0F2A45]">
                      {formatPrice(getTotal())}
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
