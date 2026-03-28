"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export type CreneauListeItem = {
  id: string;
  nom: string;
  jours: string[];
  heureDebut: string;
  dureeMinutes: number;
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
      joursTexte: "",
      heureDebut: "10:00",
      dureeMinutes: 60,
      placesMax: 12,
      whatsappLink: undefined,
      statut: "OPEN",
    };
  }
  const h =
    c.heureDebut.length >= 5 ? c.heureDebut.slice(0, 5) : c.heureDebut;
  return {
    nom: c.nom,
    joursTexte: c.jours.join(", "),
    heureDebut: h,
    dureeMinutes: c.dureeMinutes,
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
  const { register, handleSubmit, reset } = form;

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
    <form
      onSubmit={submit}
      className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 space-y-3"
    >
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
          {form.formState.errors.nom && (
            <p className="text-xs text-red-600">{form.formState.errors.nom.message}</p>
          )}
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Jours (séparés par des virgules)</Label>
          <Input
            placeholder="Lundi, Mercredi"
            {...register("joursTexte")}
          />
          {form.formState.errors.joursTexte && (
            <p className="text-xs text-red-600">
              {form.formState.errors.joursTexte.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label>Heure de début</Label>
          <Input type="time" step={60} {...register("heureDebut")} />
          {form.formState.errors.heureDebut && (
            <p className="text-xs text-red-600">
              {form.formState.errors.heureDebut.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label>Durée (minutes)</Label>
          <Input
            type="number"
            min={1}
            {...register("dureeMinutes", { valueAsNumber: true })}
          />
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
          {form.formState.errors.whatsappLink && (
            <p className="text-xs text-red-600">
              {form.formState.errors.whatsappLink.message}
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={pending}
        className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
      >
        <Save className="h-4 w-4 mr-2" />
        {isEdit ? "Enregistrer ce créneau" : "Ajouter le créneau"}
      </Button>
    </form>
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
  const [, bump] = useTransition();
  const refresh = () => {
    bump(() => {
      window.dispatchEvent(new Event("creneau-saved"));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-secondary" />
        <h2 className="font-serif text-xl font-bold text-primary">
          Créneaux ({creneaux.length})
        </h2>
      </div>
      {schedulingMode !== "FIXED_SLOTS" && (
        <p className="text-sm rounded-lg border border-amber-200 bg-amber-50 text-amber-950 px-3 py-2">
          Mode «{" "}
          {schedulingMode === "HOURLY_PURCHASE"
            ? "cours à la carte"
            : "formation flexible"}{" "}
          » : les créneaux ci-dessous servent surtout d’information ou de
          réservation optionnelle ; précisez vos règles dans la description de
          la formation.
        </p>
      )}
      <p className="text-sm text-gray-500">
        Chaque créneau correspond à une session récurrente (jours + horaire),
        surtout pour les formations avec choix d’horaires fixes.
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
