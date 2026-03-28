"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveTestimonial, deleteTestimonial } from "./actions";

type Props = { id: string; approuve: boolean };

export function TestimonialModerationButtons({ id, approuve }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (approuve) return null;

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
        onClick={() =>
          startTransition(async () => {
            await deleteTestimonial(id);
            router.refresh();
          })
        }
      >
        <X className="h-4 w-4 mr-1" />
        Refuser
      </Button>
    </div>
  );
}
