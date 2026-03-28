"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { setContactMessageLu, deleteContactMessage } from "./actions";

type Props = {
  messageId: string;
  lu: boolean;
  replyMailto: string;
};

export function ContactMessageActions({
  messageId,
  lu,
  replyMailto,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggleLu = () => {
    startTransition(async () => {
      const res = await setContactMessageLu(messageId, !lu);
      if (res.success) {
        toast.success(lu ? "Marqué non lu" : "Marqué lu");
        router.refresh();
      } else toast.error(res.error);
    });
  };

  const supprimer = () => {
    if (!window.confirm("Supprimer ce message ?")) return;
    startTransition(async () => {
      const res = await deleteContactMessage(messageId);
      if (res.success) {
        toast.success("Message supprimé");
        router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
      <a
        href={replyMailto}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <Mail className="h-4 w-4 mr-2" />
        Répondre
      </a>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={toggleLu}
      >
        {lu ? (
          <>
            <EyeOff className="h-4 w-4 mr-2" />
            Non lu
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-2" />
            Marquer lu
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-red-600 border-red-200"
        disabled={pending}
        onClick={supprimer}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </Button>
    </div>
  );
}
