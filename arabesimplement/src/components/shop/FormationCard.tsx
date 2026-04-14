"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";
import type { FormationBoutiqueCard } from "@/types/domain.types";
import {
  hourlyMinPriceEuros,
  schedulingModeBoutiquePriceShort,
  schedulingModeShortLabel,
} from "@/lib/scheduling-mode";
import { formationCardCategoryVisual } from "@/lib/content/boutique-category-visual";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { cn } from "@/lib/utils";

interface FormationCardProps {
  formation: FormationBoutiqueCard;
}

export function FormationCard({ formation }: FormationCardProps) {
  const categoryVis = formationCardCategoryVisual(formation.theme);

  const getStatusBadge = () => {
    switch (formation.statut) {
      case "ACTIVE":
        if (!formation.boutiquePurchasable) {
          return (
            <Badge className="bg-red-600 text-white hover:bg-red-600">
              Rupture
            </Badge>
          );
        }
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
      className="group flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-200/90 transition-all duration-300 overflow-hidden"
      data-testid={`formation-card-${formation.slug}`}
    >
      <div
        className={cn(
          "h-[5.2px] min-h-[5.2px] w-full shrink-0 rounded-t-xl",
          categoryVis.accentClass
        )}
        aria-hidden
      />
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {formation.imageUrl ? (
          <Image
            src={formation.imageUrl}
            alt={formation.titre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center p-8">
            <BrandLogoMark size={152} className="shadow-md" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {getStatusBadge()}
          {formation.showLimitedBadge && (
            <Badge className="border border-amber-600/50 text-amber-900 bg-amber-50 hover:bg-amber-50">
              Limité
            </Badge>
          )}
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

      <CardContent className="p-4 sm:p-6 flex flex-col flex-1 relative overflow-hidden">
        <svg
          className="pointer-events-none absolute -right-4 -bottom-4 w-24 h-24 text-primary opacity-[0.04]"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <path d={categoryVis.watermarkPath} fill="currentColor" />
        </svg>
        <Link href={`/boutique/${formation.slug}`}>
          <h3 className="font-serif font-bold text-lg text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2 relative">
            {formation.titre}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-1.5 mb-2 relative">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full border",
              categoryVis.tagContainerClass
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                categoryVis.tagDotClass
              )}
            />
            <span>{categoryVis.tagFr}</span>
            <span className="opacity-80">·</span>
            <span className="font-arabic font-semibold" dir="rtl">
              {categoryVis.tagAr}
            </span>
          </span>
          <Badge
            variant="outline"
            className="text-[10px] font-normal border-primary/25 text-primary bg-primary/5"
          >
            {schedulingModeShortLabel(formation.schedulingMode)}
          </Badge>
        </div>
        <p className="text-[11px] text-gray-600 leading-snug mb-3">
          {schedulingModeBoutiquePriceShort(formation.schedulingMode)}
        </p>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 relative">
          {formation.descriptionCourte}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 relative">
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
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 gap-3 relative">
          <div className="flex items-center gap-2 min-w-0">
            {formation.schedulingMode === "HOURLY_PURCHASE" ? (
              <span className="text-lg font-bold text-primary truncate">
                Dès {formatPrice(hourlyMinPriceEuros())}{" "}
                <span className="text-sm font-normal text-gray-600">
                  / durée au choix
                </span>
              </span>
            ) : formation.prixPromo ? (
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
            formation.boutiquePurchasable ? (
              <Link
                href={`/boutique/${formation.slug}#achat`}
                data-testid={`add-to-cart-${formation.slug}`}
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-8 px-3 shrink-0 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Choisir
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <span
                className="text-sm font-medium text-red-600 shrink-0"
                aria-label="En rupture de stock"
              >
                Rupture
              </span>
            )
          ) : (
            <Button
              variant="outline"
              className="border-primary-light text-primary-light shrink-0"
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
