"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { type CartItem } from "@/store/cart.store";
import { toast } from "sonner";
import type { Formation } from "@/types/domain.types";

interface AddToCartButtonProps {
  formation: Formation;
}

export function AddToCartButton({ formation }: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const isAlreadyInCart = isInCart(formation.id);

  const handleAddToCart = () => {
    if (isAlreadyInCart) {
      toast.info("Cette formation est déjà dans votre panier");
      return;
    }

    const cartItem: CartItem = {
      id: formation.id,
      titre: formation.titre,
      prix: Number(formation.prix),
      prixPromo: formation.prixPromo ? Number(formation.prixPromo) : undefined,
      imageUrl: formation.imageUrl || undefined,
      slug: formation.slug,
    };
    addItem(cartItem);
    toast.success("Formation ajoutée au panier !");
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAlreadyInCart}
      className={`w-full py-6 text-lg ${
        isAlreadyInCart
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-[#B7860B] hover:bg-[#0F2A45] text-white"
      }`}
      data-testid="add-to-cart-detail"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {isAlreadyInCart ? "Déjà dans le panier" : "Ajouter au panier"}
    </Button>
  );
}
