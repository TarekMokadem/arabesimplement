"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveTestimonial, deleteTestimonial } from "./actions";

type Props = { id: string; approuve: boolean };

export function TestimonialModerationButtons({ id, approuve }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const runDelete = () => {
    if (
      !window.confirm(
        "Supprimer définitivement ce témoignage ? Cette action est irréversible."
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteTestimonial(id);
      router.refresh();
    });
  };

  if (approuve) {
    return (
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200"
          disabled={pending}
          onClick={runDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 pt-4 border-t">
      <Button
        type="button"
        size="sm"
        className="bg-accent text-white"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await approveTestimonial(id);
            router.refresh();
          })
        }
      >
        <Check className="h-4 w-4 mr-1" />
        Approuver
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="text-red-600"
        disabled={pending}
        onClick={runDelete}
      >
        <X className="h-4 w-4 mr-1" />
        Refuser
      </Button>
    </div>
  );
}
