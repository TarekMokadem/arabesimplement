"use client";

import { useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { stripeReturnAbsoluteUrl } from "@/lib/site-url";

const stripePromises = new Map<string, Promise<Stripe | null>>();

function getStripe(publishableKey: string) {
  if (!stripePromises.has(publishableKey)) {
    stripePromises.set(publishableKey, loadStripe(publishableKey));
  }
  return stripePromises.get(publishableKey)!;
}

type PaymentFormProps = {
  amountLabel: string;
  onPaid: () => void | Promise<void>;
  confirmationSearchParams: string;
};

function PaymentForm({
  amountLabel,
  onPaid,
  confirmationSearchParams,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  /** Le Payment Element peut être monté avant d’être prêt à confirmer un paiement. */
  const [paymentElementReady, setPaymentElementReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !paymentElementReady) return;

    setLoading(true);
    try {
      const returnUrl = stripeReturnAbsoluteUrl(
        `/commande/confirmation?${confirmationSearchParams}`
      );
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Paiement refusé");
        return;
      }

      await onPaid();
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    Boolean(stripe) && Boolean(elements) && paymentElementReady && !loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        onReady={() => setPaymentElementReady(true)}
        options={{
          /** Ordre des moyens de paiement (PayPal avant carte si activé sur le compte Stripe). */
          paymentMethodOrder: ["paypal", "card"],
        }}
      />
      {!paymentElementReady ? (
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin shrink-0 text-secondary" />
          Chargement des moyens de paiement…
        </p>
      ) : (
        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-6 text-lg"
          data-testid="stripe-pay-button"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-5 w-5" />
              Payer {amountLabel}
            </>
          )}
        </Button>
      )}
    </form>
  );
}

export type StripePaymentSectionProps = {
  publishableKey: string;
  clientSecret: string;
  amountLabel: string;
  onPaid: () => void | Promise<void>;
  /** Query string (sans « ? ») : orderId et email pour afficher le récap après retour Stripe. */
  confirmationSearchParams: string;
};

export function StripePaymentSection({
  publishableKey,
  clientSecret,
  amountLabel,
  onPaid,
  confirmationSearchParams,
}: StripePaymentSectionProps) {
  const stripePromise = useMemo(
    () => getStripe(publishableKey),
    [publishableKey]
  );

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: { colorPrimary: "#324530" },
      },
    }),
    [clientSecret]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        key={clientSecret}
        amountLabel={amountLabel}
        onPaid={onPaid}
        confirmationSearchParams={confirmationSearchParams}
      />
    </Elements>
  );
}
