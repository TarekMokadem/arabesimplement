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

const stripePromises = new Map<string, Promise<Stripe | null>>();

function getStripe(publishableKey: string) {
  if (!stripePromises.has(publishableKey)) {
    stripePromises.set(publishableKey, loadStripe(publishableKey));
  }
  return stripePromises.get(publishableKey)!;
}

type PaymentFormProps = {
  amountLabel: string;
  onPaid: () => void;
};

function PaymentForm({ amountLabel, onPaid }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/commande/confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Paiement refusé");
        return;
      }

      onPaid();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || loading}
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
    </form>
  );
}

export type StripePaymentSectionProps = {
  publishableKey: string;
  clientSecret: string;
  amountLabel: string;
  onPaid: () => void;
};

export function StripePaymentSection({
  publishableKey,
  clientSecret,
  amountLabel,
  onPaid,
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
      <PaymentForm amountLabel={amountLabel} onPaid={onPaid} />
    </Elements>
  );
}
