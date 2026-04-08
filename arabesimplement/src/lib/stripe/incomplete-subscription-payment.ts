import type Stripe from "stripe";

function paymentIntentIdFromPiClientSecret(clientSecret: string): string | null {
  if (!clientSecret.startsWith("pi_")) return null;
  const idx = clientSecret.indexOf("_secret_");
  if (idx <= 0) return null;
  return clientSecret.slice(0, idx);
}

/**
 * Abonnement avec `payment_behavior: default_incomplete` : récupère le secret
 * et l’id du PaymentIntent depuis la première facture. Les API Stripe récentes
 * exposent le secret sur `confirmation_secret.client_secret`.
 */
export async function resolveIncompleteSubscriptionInvoicePayment(
  stripe: Stripe,
  subscription: Stripe.Subscription
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const li = subscription.latest_invoice;
  const invoiceId =
    typeof li === "string"
      ? li
      : li && typeof li === "object" && "id" in li
        ? (li as Stripe.Invoice).id
        : null;

  if (!invoiceId) {
    throw new Error("Stripe : facture d'abonnement manquante");
  }

  const invoice = await stripe.invoices.retrieve(invoiceId, {
    expand: ["confirmation_secret"],
  });

  const clientSecret = invoice.confirmation_secret?.client_secret ?? null;
  if (!clientSecret) {
    throw new Error("Stripe : client_secret manquant (abonnement)");
  }

  const paymentIntentId = paymentIntentIdFromPiClientSecret(clientSecret);
  if (!paymentIntentId) {
    throw new Error("Stripe : payment_intent id manquant (abonnement)");
  }

  return { clientSecret, paymentIntentId };
}
