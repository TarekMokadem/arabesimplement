"use client";

import { useState, useTransition } from "react";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { markOrderPaidManuallyAsAdmin } from "@/app/admin/paiements/mark-paid-actions";

export function MarkOrderPaidButton({
  orderId,
  montantEuros,
  formationSummary,
  disabledReason,
}: {
  orderId: string;
  montantEuros: number;
  formationSummary: string;
  disabledReason?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (disabledReason) {
    return (
      <span className="text-xs text-muted-foreground max-w-[200px] inline-block">
        {disabledReason}
      </span>
    );
  }

  const confirm = () => {
    startTransition(() => {
      void markOrderPaidManuallyAsAdmin(orderId).then((r) => {
        if (r.success) {
          toast.success(
            "Commande marquée comme payée — inscriptions et e-mail déclenchés si besoin."
          );
          setOpen(false);
          window.location.reload();
        } else {
          toast.error(r.error);
        }
      });
    });
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="border-accent text-accent hover:bg-accent/10 shrink-0"
        onClick={() => setOpen(true)}
      >
        <CheckCircle className="h-3.5 w-3.5 mr-1" />
        Marquer payé
      </Button>
      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Confirmer le paiement reçu ?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              Vous confirmez avoir reçu le règlement (ex. PayPal.me, virement)
              pour cette commande en attente.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
              <li>
                <strong className="text-foreground">{formationSummary}</strong>
                <span className="text-foreground">
                  {" "}
                  — {montantEuros.toFixed(2)} €
                </span>
              </li>
              <li className="font-mono break-all">Réf. : {orderId}</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              Le système appliquera la même suite que pour un paiement Stripe
              validé : compte élève, inscriptions, créneaux et e-mail « prochaines
              étapes » si besoin.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Annuler
            </Button>
            <Button
              type="button"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={pending}
              onClick={confirm}
            >
              Oui, marquer comme payé
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
