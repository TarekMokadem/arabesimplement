"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  deleteDiscoveryLead,
  setDiscoveryLeadTraite,
} from "@/app/admin/cours-decouverte/actions";

export function DiscoveryLeadDetailActions({
  leadId,
  fullName,
  traite,
}: {
  leadId: string;
  fullName: string;
  traite: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggleTraite = () => {
    startTransition(async () => {
      const r = await setDiscoveryLeadTraite(leadId, !traite);
      if (r.success) {
        toast.success(traite ? "Remis dans « à traiter »." : "Marqué traité.");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  const remove = () => {
    if (!window.confirm(`Supprimer la demande de ${fullName} ?`)) return;
    startTransition(async () => {
      const r = await deleteDiscoveryLead(leadId);
      if (r.success) {
        toast.success("Demande retirée.");
        router.push("/admin/cours-decouverte");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={toggleTraite}
      >
        {traite ? (
          <>
            <RotateCcw className="h-4 w-4 mr-2" />
            Remettre à traiter
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            Marquer traité
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200"
        disabled={pending}
        onClick={remove}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </Button>
    </div>
  );
}
