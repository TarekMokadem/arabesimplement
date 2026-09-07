import type Stripe from "stripe";

/** Coupon Stripe unique : réduction du premier paiement uniquement. */
export async function createStripeOnceAmountOffCoupon(
  stripe: Stripe,
  params: { discountEuros: number; orderId: string; promoCode: string }
): Promise<string> {
  const amountOffCents = Math.max(1, Math.round(params.discountEuros * 100));
  const coupon = await stripe.coupons.create({
    amount_off: amountOffCents,
    currency: "eur",
    duration: "once",
    name: `Promo ${params.promoCode}`.slice(0, 40),
    metadata: {
      orderId: params.orderId,
      promoCode: params.promoCode,
    },
  });
  return coupon.id;
}
