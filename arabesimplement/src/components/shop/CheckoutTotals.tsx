import { formatPrice } from "@/lib/utils/format";

type Props = {
  subtotalEuros: number;
  discountEuros?: number;
  payableEuros: number;
  promoCode?: string | null;
  /** Abonnement : la réduction ne porte que sur le premier mois. */
  firstPeriodOnly?: boolean;
};

export function CheckoutTotals({
  subtotalEuros,
  discountEuros = 0,
  payableEuros,
  promoCode,
  firstPeriodOnly = false,
}: Props) {
  const hasDiscount = discountEuros > 0;

  return (
    <div className="space-y-3">
      {hasDiscount ? (
        <>
          <div className="flex justify-between text-gray-600">
            <span>Sous-total</span>
            <span>{formatPrice(subtotalEuros)}</span>
          </div>
          <div className="flex justify-between text-accent">
            <span>
              Code promo
              {promoCode ? (
                <span className="font-mono text-xs ml-1.5 tracking-wide">
                  {promoCode}
                </span>
              ) : null}
            </span>
            <span>− {formatPrice(discountEuros)}</span>
          </div>
        </>
      ) : (
        <div className="flex justify-between text-gray-600">
          <span>Sous-total</span>
          <span>{formatPrice(subtotalEuros)}</span>
        </div>
      )}
      <div className="flex justify-between text-gray-600">
        <span>Frais</span>
        <span className="text-accent">Gratuit</span>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary">Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(payableEuros)}
          </span>
        </div>
        {hasDiscount && firstPeriodOnly ? (
          <p className="text-xs text-gray-500 mt-2">
            Réduction appliquée sur le premier mois ; les mensualités suivantes
            sont au tarif habituel.
          </p>
        ) : null}
      </div>
    </div>
  );
}
