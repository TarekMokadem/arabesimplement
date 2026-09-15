"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markOrderPaidManuallyAsAdmin } from "@/app/admin/paiements/mark-paid-actions";

export function MarkOrderPaidButton({
  orderId,
  montantEuros,
  formationSummary,
}: {
  orderId: string;
  montantEuros: number;
  formationSummary: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(() => {
      void markOrderPaidManuallyAsAdmin(orderId).then((r) => {
        if (r.success) {
          toast.success(
            "Commande marquée comme payée — inscriptions et e-mail déclenchés si besoin."
          );
          setConfirming(false);
          router.refresh();
        } else {
          toast.error(r.error);
        }
      });
    });
  };

  if (confirming) {
    return (
      <div className="space-y-2 min-w-[11rem]">
        <p className="text-xs text-gray-600 leading-snug">
          Confirmer {montantEuros.toFixed(2)} € reçu
          {formationSummary ? ` — ${formationSummary}` : ""} ?
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            disabled={pending}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={confirm}
          >
            {pending ? "Validation…" : "Oui, valider"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => setConfirming(false)}
          >
            Annuler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-accent text-accent hover:bg-accent/10 shrink-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirming(true);
      }}
    >
      <CheckCircle className="h-3.5 w-3.5 mr-1" />
      Marquer payé
    </Button>
  );
}
