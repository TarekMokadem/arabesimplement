import { roundMoney } from "@/lib/promo/apply-discount";
import { sumHourlyBundleEuros } from "@/lib/scheduling-mode";
import { printedBookletSurchargeEuros } from "@/lib/shop/printed-booklet";
import type { CartItem } from "@/store/cart.store";

function bookletExtra(item: CartItem): number {
  if (item.schedulingMode === "HOURLY_PURCHASE") return 0;
  return printedBookletSurchargeEuros(item.printedBooklet === true);
}

export function cartLinePayableEuros(item: CartItem): number {
  if (
    item.schedulingMode === "HOURLY_PURCHASE" &&
    item.hourlyBundle &&
    Object.keys(item.hourlyBundle).length > 0
  ) {
    return roundMoney(sumHourlyBundleEuros(item.hourlyBundle));
  }
  const promo = item.prixPromo;
  const base =
    promo != null && promo > 0 && promo < item.prix ? promo : item.prix;
  return roundMoney(base + bookletExtra(item));
}

export function cartLineCatalogEuros(item: CartItem): number {
  if (item.schedulingMode === "HOURLY_PURCHASE") {
    return cartLinePayableEuros(item);
  }
  return roundMoney(item.prix + bookletExtra(item));
}

export function cartLineFormationDiscountEuros(item: CartItem): number {
  return roundMoney(
    Math.max(0, cartLineCatalogEuros(item) - cartLinePayableEuros(item))
  );
}

export type CartPricingSummary = {
  catalogSubtotalEuros: number;
  itemsSubtotalEuros: number;
  formationDiscountEuros: number;
};

export function summarizeCartPricing(items: CartItem[]): CartPricingSummary {
  let catalogSubtotalEuros = 0;
  let itemsSubtotalEuros = 0;
  for (const item of items) {
    catalogSubtotalEuros = roundMoney(
      catalogSubtotalEuros + cartLineCatalogEuros(item)
    );
    itemsSubtotalEuros = roundMoney(
      itemsSubtotalEuros + cartLinePayableEuros(item)
    );
  }
  return {
    catalogSubtotalEuros,
    itemsSubtotalEuros,
    formationDiscountEuros: roundMoney(
      Math.max(0, catalogSubtotalEuros - itemsSubtotalEuros)
    ),
  };
}
