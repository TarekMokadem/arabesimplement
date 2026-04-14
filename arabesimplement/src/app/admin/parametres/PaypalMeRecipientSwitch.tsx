"use client";

import { useState, useTransition } from "react";
import type { PaypalMeRecipient } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAYPAL_ME_PROFILES } from "@/lib/paypal-me";
import { updatePaypalMeRecipientAction } from "@/app/admin/parametres/site-config-actions";

const OPTIONS: PaypalMeRecipient[] = ["YACINE_BOU18", "JANA_OKF"];

export function PaypalMeRecipientSwitch({
  initialRecipient,
}: {
  initialRecipient: PaypalMeRecipient;
}) {
  const [active, setActive] = useState(initialRecipient);
  const [pending, startTransition] = useTransition();

  const select = (recipient: PaypalMeRecipient) => {
    if (recipient === active) return;
    startTransition(() => {
      void updatePaypalMeRecipientAction(recipient).then((res) => {
        if (res.success) {
          setActive(recipient);
          toast.success("Compte PayPal.me utilisé pour les paiements directs mis à jour.");
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Sur la page de paiement (hors abonnement cours à la carte mensuel), le bouton PayPal.me
        envoie les clients vers le profil sélectionné ci-dessous.
      </p>
      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row sm:inline-flex rounded-xl border border-border p-1",
          "bg-muted/30 w-full sm:w-auto"
        )}
        role="group"
        aria-label="Choisir le compte PayPal.me"
      >
        {OPTIONS.map((key) => {
          const on = active === key;
          const p = PAYPAL_ME_PROFILES[key];
          return (
            <Button
              key={key}
              type="button"
              variant={on ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex-1 justify-center rounded-lg min-h-10",
                on &&
                  "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary"
              )}
              disabled={pending}
              onClick={() => select(key)}
            >
              <span className="font-medium">{p.shortLabel}</span>
              <span className="ml-1.5 text-xs opacity-80 tabular-nums">
                {p.pathSegment}
              </span>
            </Button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Actif : {PAYPAL_ME_PROFILES[active].description}
      </p>
    </div>
  );
}
