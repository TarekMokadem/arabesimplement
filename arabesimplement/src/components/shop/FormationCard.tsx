"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { type CartItem } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/format";
import type { FormationBoutiqueCard } from "@/types/domain.types";
import { schedulingModeShortLabel } from "@/lib/scheduling-mode";
import { toast } from "sonner";

interface FormationCardProps {
  formation: FormationBoutiqueCard;
}

export function FormationCard({ formation }: FormationCardProps) {
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

  const getStatusBadge = () => {
    switch (formation.statut) {
      case "ACTIVE":
        return (
          <Badge className="bg-accent text-white hover:bg-accent">
            Disponible
          </Badge>
        );
      case "COMING_SOON":
        return (
          <Badge className="bg-primary-light text-white hover:bg-primary-light">
            Bientôt
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge className="bg-red-500 text-white hover:bg-red-500">
            Complet
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      data-testid={`formation-card-${formation.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {formation.imageUrl ? (
          <Image
            src={formation.imageUrl}
            alt={formation.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="font-arabic text-5xl text-white/80">ع</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          {getStatusBadge()}
          {formation.prixPromo && (
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
              Promo
            </Badge>
          )}
        </div>

        {/* Quick View Button */}
        <Link
          href={`/boutique/${formation.slug}`}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white"
          >
            <Eye className="h-4 w-4 text-primary" />
          </Button>
        </Link>
      </div>

      <CardContent className="p-6">
        <Link href={`/boutique/${formation.slug}`}>
          <h3 className="font-serif font-bold text-lg text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">
            {formation.titre}
          </h3>
        </Link>
        <Badge
          variant="outline"
          className="mb-3 text-[10px] font-normal border-primary/25 text-primary bg-primary/5"
        >
          {schedulingModeShortLabel(formation.schedulingMode)}
        </Badge>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {formation.descriptionCourte}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {formation.placesMax && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{formation.placesMax} places max</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Accès immédiat</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {formation.prixPromo ? (
              <>
                <span className="text-xl font-bold text-accent">
                  {formatPrice(formation.prixPromo)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(formation.prix)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">
                {formatPrice(formation.prix)}
              </span>
            )}
          </div>

          {formation.statut === "ACTIVE" ? (
            <Button
              onClick={handleAddToCart}
              disabled={isAlreadyInCart}
              className={
                isAlreadyInCart
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              }
              size="sm"
              data-testid={`add-to-cart-${formation.slug}`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAlreadyInCart ? "Dans le panier" : "Ajouter"}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-primary-light text-primary-light"
              size="sm"
            >
              S&apos;inscrire à la liste
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
