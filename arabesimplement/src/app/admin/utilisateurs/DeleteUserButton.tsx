"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAdminUser } from "./actions";

type Props = {
  userId: string;
  userLabel: string;
  disabled?: boolean;
};

export function DeleteUserButton({ userId, userLabel, disabled }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      disabled={disabled || pending}
      aria-label={`Supprimer ${userLabel}`}
      title="Supprimer l’utilisateur"
      onClick={() => {
        if (
          !window.confirm(
            `Supprimer définitivement le compte « ${userLabel} » ? Les abonnements Stripe seront résiliés, les inscriptions supprimées ; les commandes restent en base sans lien compte.`
          )
        ) {
          return;
        }
        startTransition(async () => {
          const r = await deleteAdminUser(userId);
          if (r.success) {
            toast.success("Utilisateur supprimé.");
            router.push("/admin/utilisateurs");
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
