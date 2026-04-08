"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getPaypalMePaymentLink } from "@/app/(shop)/actions/paypal-me.actions";

type LinkState =
  | { status: "loading" }
  | {
      status: "ready";
      url: string;
      recipientShortLabel: string;
    }
  | { status: "error" };

export function PaypalMeCheckoutBlock({
  amountEuros,
  orderId,
}: {
  amountEuros: number;
  orderId: string;
}) {
  const [state, setState] = useState<LinkState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    void getPaypalMePaymentLink(amountEuros).then((r) => {
      if (cancelled) return;
      if (r.success) {
        setState({
          status: "ready",
          url: r.url,
          recipientShortLabel: r.recipientShortLabel,
        });
      } else {
        setState({ status: "error" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [amountEuros]);

  if (state.status === "loading" || state.status === "error") {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 p-4 text-sm text-gray-600">
        <p className="font-medium text-primary mb-1">Payer avec PayPal.me</p>
        {state.status === "loading" ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement du lien…
          </div>
        ) : (
          <p className="text-xs">Lien PayPal.me temporairement indisponible.</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-secondary/40 bg-secondary/5 p-4 space-y-3">
      <div>
        <p className="font-medium text-primary">Payer avec PayPal.me</p>
        <p className="text-sm text-gray-600 mt-1">
          Redirection vers le compte <strong>{state.recipientShortLabel}</strong>{" "}
          (montant prérempli). Après votre paiement sur PayPal, l’équipe valide
          la commande depuis l’admin — indiquez bien la référence ci-dessous dans
          la note PayPal.
        </p>
      </div>
      <p className="text-xs font-mono bg-white border rounded-md px-2 py-1.5 text-primary break-all">
        Réf. commande : {orderId}
      </p>
      <a
        href={state.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "default" }),
          "w-full inline-flex items-center justify-center gap-2 min-h-10",
          "border-[#0070ba] text-[#0070ba] hover:bg-[#0070ba]/10"
        )}
      >
        <ExternalLink className="h-4 w-4 shrink-0" />
        Ouvrir PayPal.me
      </a>
      <p className="text-xs text-gray-500">
        Si vous avez déjà payé par carte sur Stripe ci-dessus, ignorez ce bloc.
      </p>
    </div>
  );
}
