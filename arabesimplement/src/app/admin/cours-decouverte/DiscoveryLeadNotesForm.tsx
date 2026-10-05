"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateDiscoveryLeadNotes } from "@/app/admin/cours-decouverte/actions";

export function DiscoveryLeadNotesForm({
  leadId,
  initialNotes,
}: {
  leadId: string;
  initialNotes: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [pending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const r = await updateDiscoveryLeadNotes(leadId, notes);
      if (r.success) {
        toast.success("Notes enregistrées.");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="discovery-notes">Notes internes</Label>
      <Textarea
        id="discovery-notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        placeholder="Suivi, créneau confirmé, relance…"
      />
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={save}
      >
        {pending ? "Enregistrement…" : "Enregistrer les notes"}
      </Button>
    </div>
  );
}
