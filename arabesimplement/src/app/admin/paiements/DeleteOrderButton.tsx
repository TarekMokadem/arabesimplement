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
  withLabel = false,
}: {
  orderId: string;
  label: string;
  /** Après suppression depuis la fiche, revenir à la liste. */
  redirectToList?: boolean;
  /** Affiche le texte « Supprimer » (liste historique). */
  withLabel?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={withLabel ? "outline" : "ghost"}
      size={withLabel ? "sm" : "icon-sm"}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 border-red-200"
      disabled={pending}
      aria-label={`Supprimer le paiement ${label}`}
      title="Supprimer cette ligne de l’historique"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (
          !window.confirm(
            `Retirer « ${label} » de l’historique ? Utilisez cette action pour enlever un faux paiement ou un test. Les inscriptions et abonnements liés uniquement à cette commande seront aussi retirés. Un paiement déjà encaissé n’est pas remboursé.`
          )
        ) {
          return;
        }
        startTransition(async () => {
          const r = await deleteOrderAsAdmin(orderId);
          if (r.success) {
            toast.success("Ligne retirée de l’historique.");
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
      <Trash2 className={withLabel ? "h-3.5 w-3.5 mr-1" : "h-4 w-4"} />
      {withLabel ? (pending ? "Suppression…" : "Supprimer") : null}
    </Button>
  );
}
