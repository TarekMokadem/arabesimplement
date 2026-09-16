import { formatPrice } from "@/lib/utils/format";
import {
  cartLineCatalogEuros,
  cartLineFormationDiscountEuros,
  cartLinePayableEuros,
} from "@/lib/orders/cart-pricing";
import type { CartItem } from "@/store/cart.store";
import { cn } from "@/lib/utils";

type Props = {
  item: CartItem;
  size?: "default" | "sm";
  className?: string;
};

export function CartLinePrice({ item, size = "default", className }: Props) {
  const payable = cartLinePayableEuros(item);
  const catalog = cartLineCatalogEuros(item);
  const hasPromo = cartLineFormationDiscountEuros(item) > 0;
  const payableClass =
    size === "sm" ? "font-medium" : "text-lg font-bold";
  const catalogClass =
    size === "sm" ? "text-xs text-gray-400 line-through" : "text-sm text-gray-400 line-through";

  if (!hasPromo) {
    return (
      <span className={cn(payableClass, "text-primary", className)}>
        {formatPrice(payable)}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn(payableClass, "text-accent")}>{formatPrice(payable)}</span>
      <span className={catalogClass}>{formatPrice(catalog)}</span>
    </span>
  );
}
