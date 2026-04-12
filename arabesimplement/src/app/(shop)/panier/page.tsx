"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutStepper } from "@/components/shop/CheckoutStepper";
import { useCart } from "@/hooks/useCart";
import { CartItemDetailList } from "@/components/shop/CartItemDetailList";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { formatPrice } from "@/lib/utils/format";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function PanierPage() {
  const { items, removeItem, getTotal, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="pt-20 min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-16 sm:pt-20 min-h-screen bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <CheckoutStepper currentStep={1} />

          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="h-12 w-12 text-gray-300" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-500 mb-8">
              Découvrez nos formations pour commencer votre apprentissage de
              l&apos;arabe.
            </p>
            <Link href="/boutique">
              <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                Voir les formations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <CheckoutStepper currentStep={1} />

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
          Votre panier
        </h1>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card
                key={item.lineId}
                className="bg-white"
                data-testid={`cart-item-${item.lineId}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.titre}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <BrandLogoMark size={104} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/boutique/${item.slug}`}
                        className="font-serif font-bold text-primary hover:text-secondary transition-colors line-clamp-2"
                      >
                        {item.titre}
                      </Link>

                      <CartItemDetailList item={item} className="max-w-xl" />

                      <div className="flex items-center gap-2 mt-2">
                        {item.prixPromo ? (
                          <>
                            <span className="text-lg font-bold text-accent">
                              {formatPrice(item.prixPromo)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(item.prix)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(item.prix)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.lineId)}
                      className="text-gray-400 hover:text-red-500"
                      data-testid={`remove-${item.lineId}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div>
            <Card className="bg-white sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-serif text-lg font-bold text-primary mb-6">
                  Récapitulatif
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frais</span>
                    <span className="text-accent">Gratuit</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>

                <Link href="/commande/informations">
                  <Button
                    className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-6"
                    data-testid="proceed-to-checkout"
                  >
                    Procéder au paiement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link
                  href="/boutique"
                  className="block text-center text-sm text-gray-500 hover:text-secondary mt-4 transition-colors"
                >
                  Continuer mes achats
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
