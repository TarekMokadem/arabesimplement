"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteOrderAsAdmin } from "@/app/admin/paiements/delete-order-actions";

export function DeleteOrderButton({
  orderId,
  label,
  redirectToList = false,
}: {
  orderId: string;
  label: string;
  /** Après suppression depuis la fiche, revenir à la liste. */
  redirectToList?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
      disabled={pending}
      aria-label={`Supprimer le paiement ${label}`}
      title="Supprimer de l’historique"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (
          !window.confirm(
            `Supprimer définitivement le paiement « ${label} » de l’historique ? Les inscriptions et abonnements liés à cette commande seront retirés. Un abonnement Stripe lié sera résilié. Un paiement déjà encaissé n’est pas remboursé automatiquement.`
          )
        ) {
          return;
        }
        startTransition(async () => {
          const r = await deleteOrderAsAdmin(orderId);
          if (r.success) {
            toast.success("Paiement retiré de l’historique.");
            if (redirectToList) {
              router.push("/admin/paiements");
            }
            router.refresh();
          } else {
            toast.error(r.error);
          }
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
