import type Stripe from "stripe";

/** L’API Stripe renvoie encore `payment_intent` sur les factures ; les typings peuvent être incomplets selon la version du SDK. */
export function paymentIntentIdFromStripeInvoice(
  invoice: Stripe.Invoice
): string | null {
  const pit = (
    invoice as Stripe.Invoice & {
      payment_intent?: string | Stripe.PaymentIntent | null;
    }
  ).payment_intent;
  if (pit == null) return null;
  return typeof pit === "string" ? pit : pit.id;
}

/** Type du PaymentMethod lorsque `payment_intent` est déjà développé avec `payment_method`. */
export function stripePaymentMethodTypeFromExpandedPaymentIntent(
  pi: Stripe.PaymentIntent
): string | null {
  const pm = pi.payment_method;
  if (typeof pm === "object" && pm != null && "type" in pm) {
    const t = pm.type;
    return typeof t === "string" && t.length > 0 ? t : null;
  }
  return null;
}

/** Lit le type du PaymentMethod Stripe associé au PaymentIntent (ex. `card`, `paypal`). */
export async function stripePaymentMethodTypeFromPaymentIntent(
  stripe: Stripe,
  paymentIntentId: string
): Promise<string | null> {
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["payment_method"],
  });
  return stripePaymentMethodTypeFromExpandedPaymentIntent(pi);
}

/** Réglé hors Stripe (lien PayPal.me), confirmé à la main par l’admin. */
export const MANUAL_PAYPAL_ME_METHOD = "paypal_me";

function stripeTunnelPresent(o: {
  stripePaymentIntentId: string | null;
  stripeSubscriptionId: string | null;
}): boolean {
  if (o.stripePaymentIntentId != null && o.stripePaymentIntentId !== "") {
    return true;
  }
  const sid = o.stripeSubscriptionId;
  return sid != null && sid !== "" && !sid.startsWith("mock_sub_");
}

/** Libellé admin lisible pour la colonne « Canal » (paiements via Stripe Connect / Elements). */
export function stripeTunnelChannelLabel(pmType: string | null): string {
  if (!pmType) return "Stripe";
  switch (pmType) {
    case MANUAL_PAYPAL_ME_METHOD:
      return "PayPal.me";
    case "card":
      return "Stripe (carte)";
    case "paypal":
      return "Stripe (PayPal)";
    case "link":
      return "Stripe (Link)";
    case "ideal":
      return "Stripe (iDEAL)";
    case "sepa_debit":
      return "Stripe (SEPA)";
    default:
      return `Stripe (${pmType})`;
  }
}

/**
 * Canal affiché dans l’historique admin : PayPal.me n’est plus masqué
 * derrière un PaymentIntent Stripe créé au checkout.
 */
export function paymentChannelLabel(o: {
  statut: string;
  stripePaymentIntentId: string | null;
  stripeSubscriptionId: string | null;
  stripePaymentMethodType: string | null;
}): string {
  if (o.stripePaymentMethodType === MANUAL_PAYPAL_ME_METHOD) {
    return "PayPal.me";
  }
  if (o.stripePaymentMethodType === "paypal") {
    return "Stripe (PayPal)";
  }
  if (stripeTunnelPresent(o)) {
    if (o.statut === "PENDING" && !o.stripePaymentMethodType) {
      return "Stripe / PayPal.me";
    }
    return stripeTunnelChannelLabel(o.stripePaymentMethodType);
  }
  if (o.statut === "PAID") return "PayPal.me";
  if (o.statut === "PENDING") return "En attente de paiement";
  return "—";
}
