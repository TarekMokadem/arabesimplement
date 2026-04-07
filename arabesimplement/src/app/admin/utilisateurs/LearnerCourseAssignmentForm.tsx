"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateLearnerCourseAssignmentAction } from "./learner-course-actions";
import { toast } from "sonner";

type Props = {
  userId: string;
  formationId: string;
  isHourlyGroup: boolean;
  creneauId: string | null;
  formationTitre: string;
  kindLabel: string;
  detailLines: string[];
  initialProfessor: string;
  initialWhatsapp: string;
};

export function LearnerCourseAssignmentForm({
  userId,
  formationId,
  isHourlyGroup,
  creneauId,
  formationTitre,
  kindLabel,
  detailLines,
  initialProfessor,
  initialWhatsapp,
}: Props) {
  const [prof, setProf] = useState(initialProfessor);
  const [wa, setWa] = useState(initialWhatsapp);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await updateLearnerCourseAssignmentAction({
      userId,
      formationId,
      isHourlyGroup,
      creneauId,
      assignedProfessorName: prof.trim() || null,
      assignedWhatsappUrl: wa.trim() || null,
    });
    setPending(false);
    if (res.ok) toast.success("Coordonnées enregistrées — visibles côté élève.");
    else toast.error(res.error);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-serif font-semibold text-lg text-primary">
            {formationTitre}
          </h3>
          <Badge variant="outline" className="mt-1 text-[10px] font-normal">
            {kindLabel}
          </Badge>
        </div>
      </div>
      {detailLines.length > 0 && (
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          {detailLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`prof-${formationId}-${creneauId ?? "h"}`}>
            Professeur assigné
          </Label>
          <Input
            id={`prof-${formationId}-${creneauId ?? "h"}`}
            value={prof}
            onChange={(e) => setProf(e.target.value)}
            placeholder="Prénom et nom affichés à l’élève"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`wa-${formationId}-${creneauId ?? "h"}`}>
            WhatsApp du groupe cours
          </Label>
          <Input
            id={`wa-${formationId}-${creneauId ?? "h"}`}
            value={wa}
            onChange={(e) => setWa(e.target.value)}
            placeholder="Lien invite (chat.whatsapp.com/…) ou https://wa.me/33…"
            autoComplete="off"
          />
          <p className="text-xs text-gray-500">
            Collez le lien du groupe ou le numéro avec indicatif (sans espaces).
            L’élève verra un bouton direct dans son espace.
          </p>
        </div>
      </div>
      <Button type="submit" disabled={pending} className="bg-secondary">
        {pending ? "Enregistrement…" : "Enregistrer pour cet élève"}
      </Button>
    </form>
  );
}
