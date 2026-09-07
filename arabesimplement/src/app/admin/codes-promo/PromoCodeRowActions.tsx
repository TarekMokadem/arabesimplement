"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deletePromoCode, togglePromoCodeActive } from "./actions";

type Props = {
  id: string;
  active: boolean;
};

export function PromoCodeRowActions({ id, active }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = await togglePromoCodeActive(id);
      if (res.success) {
        toast.success(active ? "Code désactivé" : "Code activé");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const remove = () => {
    if (!window.confirm("Supprimer ce code promo ?")) return;
    startTransition(async () => {
      const res = await deletePromoCode(id);
      if (res.success) {
        toast.success("Code supprimé");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={toggle}
      >
        {active ? "Désactiver" : "Activer"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending}
        className="text-red-600 hover:text-red-700"
        onClick={remove}
      >
        Supprimer
      </Button>
    </div>
  );
}
