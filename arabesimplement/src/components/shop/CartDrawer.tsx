"use client";

import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { CartItemDetailList } from "@/components/shop/CartItemDetailList";
import { formatPrice } from "@/lib/utils/format";

export function CartDrawer() {
  const { items, removeItem, getTotal } = useCart();

  return (
    <Sheet>
      <SheetTrigger
        className="fixed bottom-6 right-6 z-50 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-full w-14 h-14 shadow-lg lg:hidden flex items-center justify-center transition-colors"
        data-testid="cart-drawer-trigger"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-white">
        <SheetHeader>
          <SheetTitle className="font-serif text-primary">
            Votre panier ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-6">Votre panier est vide</p>
              <Link href="/boutique">
                <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                  Découvrir nos formations
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div
                    key={item.lineId}
                    className="flex gap-4 p-4 bg-surface rounded-lg"
                    data-testid={`cart-item-${item.lineId}`}
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.titre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/90 to-primary-light p-2">
                          <Image
                            src="/brand/logo-arabe-simplement.png"
                            alt=""
                            width={64}
                            height={64}
                            className="object-contain w-4/5 opacity-95"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-primary line-clamp-2">
                        {item.titre}
                      </h3>
                      <CartItemDetailList item={item} size="sm" />
                      <div className="flex items-center gap-2 mt-1">
                        {item.prixPromo ? (
                          <>
                            <span className="text-accent font-bold">
                              {formatPrice(item.prixPromo)}
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                              {formatPrice(item.prix)}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary font-bold">
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
                      data-testid={`remove-item-${item.lineId}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <Link href="/panier">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                    Voir le panier
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
