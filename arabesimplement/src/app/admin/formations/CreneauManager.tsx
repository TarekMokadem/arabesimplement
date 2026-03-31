"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  creneauAdminSchema,
  type CreneauAdminInput,
} from "@/lib/validations/admin-formations.schema";
import type { CreneauStatus } from "@prisma/client";
import {
  createCreneau,
  updateCreneau,
  deleteCreneau,
} from "./actions";
import type { FormationSchedulingMode } from "@/types/domain.types";
import {
  schedulingModeAdminCreneauxIntro,
  schedulingModeAdminCreneauxTitle,
  schedulingModePaymentExplanation,
} from "@/lib/scheduling-mode";
import type { JourneeSlot } from "@/lib/creneau-display";
import { normalizeJourneeSlots } from "@/lib/creneau-display";

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export type CreneauListeItem = {
  id: string;
  nom: string;
  jours: string[];
  heureDebut: string;
  dureeMinutes: number;
  journeeSlots?: JourneeSlot[];
  placesMax: number;
  whatsappLink: string | null;
  statut: CreneauStatus;
};

function creneauDefaults(
  c?: CreneauListeItem | null
): CreneauAdminInput {
  if (!c) {
    return {
      nom: "",
      journeeSlots: [
        { jour: "Lundi", heureDebut: "10:00", dureeMinutes: 60 },
      ],
      placesMax: 12,
      whatsappLink: undefined,
      statut: "OPEN",
    };
  }
  const slots = normalizeJourneeSlots(c.journeeSlots, {
    jours: c.jours,
    heureDebut: c.heureDebut,
    dureeMinutes: c.dureeMinutes,
  }).map((s) => ({
    jour: s.jour,
    heureDebut: s.heureDebut.length >= 5 ? s.heureDebut.slice(0, 5) : s.heureDebut,
    dureeMinutes: s.dureeMinutes,
  }));
  return {
    nom: c.nom,
    journeeSlots: slots,
    placesMax: c.placesMax,
    whatsappLink: c.whatsappLink ?? undefined,
    statut: c.statut,
  };
}

function CreneauFormBloc(props: {
  formationId: string;
  creneau?: CreneauListeItem | null;
}) {
  const { formationId, creneau } = props;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEdit = !!creneau;

  const form = useForm<CreneauAdminInput>({
    resolver: zodResolver(creneauAdminSchema) as Resolver<CreneauAdminInput>,
    defaultValues: creneauDefaults(creneau),
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "journeeSlots",
  });

  const submit = handleSubmit((data) => {
    startTransition(async () => {
      const res = isEdit
        ? await updateCreneau(creneau!.id, data)
        : await createCreneau(formationId, data);
      if (res.success) {
        toast.success(isEdit ? "Créneau mis à jour" : "Créneau ajouté");
        if (!isEdit) reset(creneauDefaults(null));
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  });

  const supprimer = () => {
    if (!creneau) return;
    if (!window.confirm("Supprimer ce créneau ?")) return;
    startTransition(async () => {
      const res = await deleteCreneau(creneau.id);
      if (res.success) {
        toast.success("Créneau supprimé");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium text-primary">
          {isEdit ? creneau.nom : "Nouveau créneau"}
        </h3>
        {isEdit && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200"
            disabled={pending}
            onClick={supprimer}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1 sm:col-span-2">
          <Label>Nom du créneau</Label>
          <Input {...register("nom")} />
          {errors.nom && (
            <p className="text-xs text-red-600">{errors.nom.message}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <Label>Jours et horaires (chaque ligne = un jour avec heure et durée)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() =>
                append({ jour: "", heureDebut: "10:00", dureeMinutes: 60 })
              }
            >
              Ajouter un jour
            </Button>
          </div>
          {errors.journeeSlots?.root?.message && (
            <p className="text-xs text-red-600">
              {errors.journeeSlots.root.message}
            </p>
          )}
          {typeof errors.journeeSlots?.message === "string" && (
            <p className="text-xs text-red-600">{errors.journeeSlots.message}</p>
          )}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white/60 p-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid sm:grid-cols-12 gap-2 items-end border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1 sm:col-span-4">
                  <Label className="text-xs">Jour</Label>
                  <Input
                    placeholder="ex. Lundi"
                    {...register(`journeeSlots.${index}.jour`)}
                  />
                  {errors.journeeSlots?.[index]?.jour && (
                    <p className="text-xs text-red-600">
                      {errors.journeeSlots[index]?.jour?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <Label className="text-xs">Heure</Label>
                  <Input
                    type="time"
                    step={60}
                    {...register(`journeeSlots.${index}.heureDebut`)}
                  />
                  {errors.journeeSlots?.[index]?.heureDebut && (
                    <p className="text-xs text-red-600">
                      {errors.journeeSlots[index]?.heureDebut?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <Label className="text-xs">Durée (min)</Label>
                  <Input
                    type="number"
                    min={1}
                    {...register(`journeeSlots.${index}.dureeMinutes`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.journeeSlots?.[index]?.dureeMinutes && (
                    <p className="text-xs text-red-600">
                      {errors.journeeSlots[index]?.dureeMinutes?.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      disabled={pending}
                      onClick={() => remove(index)}
                    >
                      Retirer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <Label>Places max.</Label>
          <Input
            type="number"
            min={1}
            {...register("placesMax", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1">
          <Label>Statut</Label>
          <select className={selectClass} {...register("statut")}>
            <option value="OPEN">Ouvert</option>
            <option value="FULL">Complet</option>
            <option value="CLOSED">Fermé</option>
          </select>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Lien WhatsApp (optionnel)</Label>
          <Input type="url" placeholder="https://…" {...register("whatsappLink")} />
          {errors.whatsappLink && (
            <p className="text-xs text-red-600">
              {errors.whatsappLink.message}
            </p>
          )}
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() => void submit()}
        className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
      >
        <Save className="h-4 w-4 mr-2" />
        {isEdit ? "Enregistrer ce créneau" : "Ajouter le créneau"}
      </Button>
    </div>
  );
}

type Props = {
  formationId: string;
  creneaux: CreneauListeItem[];
  refreshKey?: number;
  schedulingMode?: FormationSchedulingMode;
};

export function CreneauManager({
  formationId,
  creneaux,
  schedulingMode = "FIXED_SLOTS",
}: Props) {
  const modeStyles: Record<
    FormationSchedulingMode,
    { border: string; bg: string; accent: string }
  > = {
    FIXED_SLOTS: {
      border: "border-primary/25",
      bg: "bg-primary/5",
      accent: "text-primary",
    },
    FLEXIBLE_FORMATION: {
      border: "border-secondary/30",
      bg: "bg-secondary/5",
      accent: "text-primary",
    },
    HOURLY_PURCHASE: {
      border: "border-amber-200",
      bg: "bg-amber-50",
      accent: "text-amber-950",
    },
  };
  const ms = modeStyles[schedulingMode];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-secondary" />
        <h2 className="font-serif text-xl font-bold text-primary">
          {schedulingModeAdminCreneauxTitle(schedulingMode, creneaux.length)}
        </h2>
      </div>

      <div
        className={`rounded-lg border px-3 py-2.5 space-y-2 text-sm leading-snug ${ms.border} ${ms.bg} ${ms.accent}`}
      >
        <p className="font-medium">Paiement côté élève</p>
        <p className="opacity-95">{schedulingModePaymentExplanation(schedulingMode)}</p>
      </div>

      <p className="text-sm text-gray-600">{schedulingModeAdminCreneauxIntro(schedulingMode)}</p>
      <p className="text-sm text-gray-500">
        {schedulingMode === "FIXED_SLOTS"
          ? "Chaque fiche = une session récurrente : ajoutez une ligne par jour (jour, heure de début, durée de la séance ce jour-là)."
          : schedulingMode === "FLEXIBLE_FORMATION"
            ? "Si vous ajoutez des fiches, elles servent d’exemple sur la boutique ; l’élève n’a pas à « choisir » un créneau obligatoire."
            : "Les fiches peuvent illustrer durées types, groupes ou liens WhatsApp ; le règlement se fait à la séance."}
      </p>
      <div className="space-y-4">
        {creneaux.map((c) => (
          <CreneauFormBloc
            key={c.id}
            formationId={formationId}
            creneau={c}
          />
        ))}
        <CreneauFormBloc formationId={formationId} />
      </div>
    </div>
  );
}
