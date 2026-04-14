"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { syncPaidOrderFromStripe } from "@/app/(shop)/actions/order.actions";

type Props = {
  orderId: string;
  /** Si la commande est encore en attente côté BDD (webhook pas encore passé). */
  initialPending: boolean;
};

/**
 * Au premier rendu après paiement Stripe, la commande peut encore être PENDING
 * le temps du webhook : on interroge Stripe puis on rafraîchit la page serveur.
 */
export function ConfirmationPaymentSync({ orderId, initialPending }: Props) {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (!initialPending || !orderId || ran.current) return;
    ran.current = true;

    let cancelled = false;

    async function syncWithRetries() {
      for (let i = 0; i < 8; i++) {
        if (cancelled) return;
        const r = await syncPaidOrderFromStripe(orderId);
        if (
          r.success &&
          (r.statut === "PAID" || r.statut === "FINAL")
        ) {
          router.refresh();
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      if (!cancelled) router.refresh();
    }

    void syncWithRetries();
    return () => {
      cancelled = true;
    };
  }, [orderId, initialPending, router]);

  return null;
}
