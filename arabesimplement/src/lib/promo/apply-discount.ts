/** Arrondi monétaire à 2 décimales (euros). */
export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Plancher Stripe PaymentIntent (0,50 €). */
export const STRIPE_MIN_CHARGE_EUROS = 0.5;

export type AppliedCartDiscount = {
  subtotalEuros: number;
  discountEuros: number;
  payableEuros: number;
};

/**
 * Applique une réduction en montant fixe, sans jamais descendre sous `minPayableEuros`.
 */
export function applyFixedAmountOff(
  subtotalEuros: number,
  amountOffEuros: number,
  minPayableEuros: number
): AppliedCartDiscount {
  const subtotal = roundMoney(Math.max(0, subtotalEuros));
  const requested = roundMoney(Math.max(0, amountOffEuros));
  const floor = roundMoney(Math.max(0, minPayableEuros));
  const maxDiscount = roundMoney(Math.max(0, subtotal - floor));
  const discount = roundMoney(Math.min(requested, maxDiscount));
  return {
    subtotalEuros: subtotal,
    discountEuros: discount,
    payableEuros: roundMoney(subtotal - discount),
  };
}

export type CheckoutKindForDiscount = "hourly_only" | "standard";

export function minPayableForCheckoutKind(
  _checkoutKind: CheckoutKindForDiscount,
  stripeConfigured: boolean
): number {
  if (stripeConfigured) return STRIPE_MIN_CHARGE_EUROS;
  return 0;
}
