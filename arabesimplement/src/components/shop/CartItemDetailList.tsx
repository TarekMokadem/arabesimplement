"use client";

import type { CartItem } from "@/store/cart.store";
import { getCartItemDetailLines } from "@/lib/cart-item-details";
import { cn } from "@/lib/utils";

type Props = {
  item: CartItem;
  className?: string;
  /** Texte plus petit (récapitulatif colonne droite) */
  size?: "default" | "sm";
};

export function CartItemDetailList({ item, className, size = "default" }: Props) {
  const lines = getCartItemDetailLines(item);
  if (lines.length === 0) return null;

  return (
    <ul
      className={cn(
        "mt-2 space-y-1.5",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
      data-testid={`cart-item-details-${item.lineId}`}
    >
      {lines.map((line, i) => (
        <li
          key={`${item.lineId}-d-${i}`}
          className="text-gray-600 leading-snug pl-2.5 border-l-2 border-secondary/35"
        >
          {line}
        </li>
      ))}
    </ul>
  );
}
