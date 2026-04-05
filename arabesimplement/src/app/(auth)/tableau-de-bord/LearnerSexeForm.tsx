"use client";

import { useState, useTransition } from "react";
import type { StudentSex } from "@prisma/client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEARNER_SEXE_UNSET } from "@/lib/auth/learner-sexe";
import { updateLearnerSexe } from "../actions";

type Props = {
  initialSexe: StudentSex | null;
  disabled?: boolean;
};

export function LearnerSexeForm({ initialSexe, disabled }: Props) {
  const [value, setValue] = useState<string>(
    initialSexe ?? LEARNER_SEXE_UNSET
  );
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [pending, startTransition] = useTransition();

  const busy = disabled || pending;

  return (
    <div className="space-y-2">
      <Label htmlFor="learner-sexe-dashboard">Sexe (contact WhatsApp)</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          const v = next ?? LEARNER_SEXE_UNSET;
          setValue(v);
          setMessage(null);
          startTransition(async () => {
            const r = await updateLearnerSexe(v);
            if (r.ok) {
              setMessage({
                type: "ok",
                text: "Enregistré. Le lien WhatsApp de vos formations est mis à jour.",
              });
            } else {
              setMessage({
                type: "err",
                text: r.error ?? "Échec de l’enregistrement.",
              });
            }
          });
        }}
        disabled={busy}
      >
        <SelectTrigger
          id="learner-sexe-dashboard"
          className="w-full"
          data-testid="dashboard-learner-sexe"
        >
          <SelectValue placeholder="Choisir…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={LEARNER_SEXE_UNSET}>Non renseigné</SelectItem>
          <SelectItem value="FEMME">Femme</SelectItem>
          <SelectItem value="HOMME">Homme</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        Permet d’afficher le bon canal WhatsApp (équipe féminine ou masculine)
        sur vos formations.
      </p>
      {message ? (
        <p
          className={
            message.type === "ok"
              ? "text-xs text-emerald-700"
              : "text-xs text-red-600"
          }
          role="status"
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
