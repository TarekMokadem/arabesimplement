import { formatPrice } from "@/lib/utils/format";
import { roundMoney } from "@/lib/promo/apply-discount";
import { cn } from "@/lib/utils";

type Props = {
  /** Sous-total après promo formation, avant code promo. */
  subtotalEuros: number;
  /** Somme des prix catalogue (avant promo formation). */
  catalogSubtotalEuros?: number;
  /** Réduction liée au prix promo des formations. */
  formationDiscountEuros?: number;
  /** Réduction liée à un code promo. */
  discountEuros?: number;
  payableEuros: number;
  promoCode?: string | null;
  /** Abonnement : la réduction ne porte que sur le premier mois. */
  firstPeriodOnly?: boolean;
};

function savingsCopy(params: {
  saved: number;
  formationOff: number;
  codeOff: number;
  promoCode: string | null;
}): string {
  const amount = formatPrice(params.saved);
  if (params.formationOff > 0 && params.codeOff > 0) {
    return params.promoCode
      ? `Vous économisez ${amount} grâce à l’offre en cours et au code ${params.promoCode}.`
      : `Vous économisez ${amount} grâce à l’offre en cours et au code promo.`;
  }
  if (params.codeOff > 0) {
    return params.promoCode
      ? `Vous économisez ${amount} grâce au code promo ${params.promoCode}.`
      : `Vous économisez ${amount} grâce au code promo.`;
  }
  return `Vous économisez ${amount} grâce à l’offre en cours.`;
}

export function CheckoutTotals({
  subtotalEuros,
  catalogSubtotalEuros,
  formationDiscountEuros = 0,
  discountEuros = 0,
  payableEuros,
  promoCode,
  firstPeriodOnly = false,
}: Props) {
  const formationOff = roundMoney(Math.max(0, formationDiscountEuros));
  const codeOff = roundMoney(Math.max(0, discountEuros));
  const itemsSubtotal = roundMoney(subtotalEuros);
  const catalog = roundMoney(
    catalogSubtotalEuros ?? itemsSubtotal + formationOff
  );
  const saved = roundMoney(formationOff + codeOff);
  const hasFormationOff = formationOff > 0;
  const hasCodeOff = codeOff > 0;
  const hasAnyDiscount = saved > 0;

  return (
    <div className="space-y-3">
      {hasFormationOff ? (
        <>
          <div className="flex justify-between text-gray-600">
            <span>Prix habituel</span>
            <span className="line-through decoration-gray-400">
              {formatPrice(catalog)}
            </span>
          </div>
          <div className="flex justify-between text-accent font-medium">
            <span>Réduction promo</span>
            <span>− {formatPrice(formationOff)}</span>
          </div>
        </>
      ) : null}

      {hasCodeOff ||
      (!hasFormationOff &&
        roundMoney(itemsSubtotal) !== roundMoney(payableEuros)) ? (
        <div className="flex justify-between text-gray-600">
          <span>Sous-total</span>
          <span>{formatPrice(itemsSubtotal)}</span>
        </div>
      ) : null}

      {hasCodeOff ? (
        <div className="flex justify-between text-accent font-medium">
          <span>
            Code promo
            {promoCode ? (
              <span className="font-mono text-xs ml-1.5 tracking-wide">
                {promoCode}
              </span>
            ) : null}
          </span>
          <span>− {formatPrice(codeOff)}</span>
        </div>
      ) : null}

      <div className="flex justify-between text-gray-600">
        <span>Frais</span>
        <span className="text-accent">Gratuit</span>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-end gap-3">
          <span className="font-bold text-primary">Total</span>
          <div className="text-right">
            {hasAnyDiscount ? (
              <p className="text-sm text-gray-400 line-through leading-none mb-1">
                {formatPrice(catalog)}
              </p>
            ) : null}
            <p
              className={
                hasAnyDiscount
                  ? "text-2xl font-bold text-accent"
                  : "text-2xl font-bold text-primary"
              }
            >
              {formatPrice(payableEuros)}
            </p>
          </div>
        </div>
        {hasAnyDiscount ? (
          <p
            className={cn(
              "mt-3 rounded-lg px-3 py-2 text-sm font-medium bg-accent/10 text-accent"
            )}
          >
            {savingsCopy({
              saved,
              formationOff,
              codeOff,
              promoCode: promoCode ?? null,
            })}
          </p>
        ) : null}
        {hasAnyDiscount && firstPeriodOnly ? (
          <p className="text-xs text-gray-500 mt-2">
            Réduction appliquée sur le premier mois ; les mensualités suivantes
            sont au tarif habituel.
          </p>
        ) : null}
      </div>
    </div>
  );
}
