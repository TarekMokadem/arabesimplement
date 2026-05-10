"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getPaypalMePaymentLink } from "@/app/(shop)/actions/paypal-me.actions";

type LinkState =
  | { status: "loading" }
  | { status: "ready"; url: string }
  | { status: "error" };

export function PaypalMeCheckoutBlock({
  amountEuros,
  orderId,
  /** Après paiement sur PayPal.me : lien vers la confirmation (récap + statut « en attente » tant que l’admin n’a pas validé). */
  confirmationHref,
}: {
  amountEuros: number;
  orderId: string;
  confirmationHref?: string;
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
          PayPal.me <strong className="font-medium text-primary">ne prévient pas</strong>{" "}
          automatiquement ce site : tant que l’équipe n’a pas vérifié le virement,
          votre commande reste affichée comme{" "}
          <strong className="font-medium text-primary">en attente</strong>. Indiquez la
          référence ci-dessous dans la note sur PayPal pour qu’on puisse vous
          rattacher rapidement.
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
      {confirmationHref ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-3 space-y-2">
          <p className="text-sm text-amber-950">
            Une fois le paiement envoyé sur PayPal, ouvrez votre{" "}
            <strong>récapitulatif de commande</strong> sur notre site — ce n’est pas
            mis à jour automatiquement sur cette page.
          </p>
          <Link
            href={confirmationHref}
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "w-full inline-flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            J’ai payé sur PayPal — voir ma commande
          </Link>
        </div>
      ) : null}
      <p className="text-xs text-gray-500">
        Si vous avez déjà payé par carte sur Stripe ci-dessus, ignorez ce bloc.
      </p>
    </div>
  );
}
