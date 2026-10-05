"use client";

import { useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminRecordedOrderSchema,
  type AdminRecordedOrderInput,
} from "@/lib/validations/admin-recorded-order.schema";
import {
  ADMIN_RECORDED_CHANNEL_IDS,
  adminRecordedChannelLabel,
} from "@/lib/orders/admin-recorded-channel";
import { HOURLY_SLOTS_PRICING } from "@/lib/scheduling-mode";
import { BILLING_COUNTRIES } from "@/lib/geo/billing-countries";
import { createRecordedOrderAsAdmin } from "./create-order-actions";
import type {
  ManualOrderFormationOption,
  ManualOrderUserOption,
} from "@/lib/data/admin-manual-order.catalog";

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AdminRecordedOrderForm({
  users,
  formations,
  defaultUserId,
}: {
  users: ManualOrderUserOption[];
  formations: ManualOrderFormationOption[];
  defaultUserId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<AdminRecordedOrderInput>({
    resolver: zodResolver(
      adminRecordedOrderSchema
    ) as Resolver<AdminRecordedOrderInput>,
    defaultValues: {
      userId: defaultUserId ?? "",
      formationId: "",
      creneauId: "",
      hourlyMinutes: 60,
      hourlyQuantity: 1,
      montantEuros: 0,
      statut: "PAID",
      channel: "virement",
      pays: "France",
    },
  });

  const { register, handleSubmit, watch, setValue } = form;
  const formationId = watch("formationId");
  const hourlyMinutes = watch("hourlyMinutes");
  const hourlyQuantity = watch("hourlyQuantity");

  const formation = useMemo(
    () => formations.find((f) => f.id === formationId) ?? null,
    [formations, formationId]
  );
  const isHourly = formation?.schedulingMode === "HOURLY_PURCHASE";

  useEffect(() => {
    if (!formation) return;
    if (formation.schedulingMode === "HOURLY_PURCHASE") {
      const minutes = Number(hourlyMinutes) || 60;
      const qty = Math.max(1, Number(hourlyQuantity) || 1);
      const unit =
        HOURLY_SLOTS_PRICING.find((r) => r.minutes === minutes)?.priceEuros ??
        0;
      setValue("montantEuros", unit * qty, { shouldValidate: false });
      return;
    }
    setValue("montantEuros", formation.prixPromo ?? formation.prix, {
      shouldValidate: false,
    });
    setValue("creneauId", "", { shouldValidate: false });
  }, [formation, hourlyMinutes, hourlyQuantity, setValue]);

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const res = await createRecordedOrderAsAdmin(data);
      if (res.success) {
        toast.success("Paiement enregistré.");
        router.push(`/admin/paiements/${res.orderId}`);
      } else {
        toast.error(res.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
      <Link
        href="/admin/paiements"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l’historique
      </Link>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="userId">Client</Label>
          <select id="userId" className={selectClass} {...register("userId")}>
            <option value="">Sélectionnez un client</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
          {form.formState.errors.userId && (
            <p className="text-sm text-red-600">
              {form.formState.errors.userId.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Pas encore de fiche ?{" "}
            <Link
              href="/admin/utilisateurs/nouveau"
              className="text-secondary underline"
            >
              Ajouter un client
            </Link>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="formationId">Formation</Label>
          <select
            id="formationId"
            className={selectClass}
            {...register("formationId")}
          >
            <option value="">Sélectionnez une formation</option>
            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.titre}
              </option>
            ))}
          </select>
          {form.formState.errors.formationId && (
            <p className="text-sm text-red-600">
              {form.formState.errors.formationId.message}
            </p>
          )}
        </div>

        {isHourly ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="hourlyMinutes">Durée d’une séance</Label>
              <select
                id="hourlyMinutes"
                className={selectClass}
                {...register("hourlyMinutes")}
              >
                {HOURLY_SLOTS_PRICING.map((row) => (
                  <option key={row.minutes} value={row.minutes}>
                    {row.durationLabel} — {row.priceEuros} €
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyQuantity">Volume (unités / semaine)</Label>
              <Input
                id="hourlyQuantity"
                type="number"
                min={1}
                max={40}
                {...register("hourlyQuantity")}
              />
            </div>
          </>
        ) : formation && formation.creneaux.length > 0 ? (
          <div className="space-y-2">
            <Label htmlFor="creneauId">Créneau (optionnel)</Label>
            <select
              id="creneauId"
              className={selectClass}
              {...register("creneauId")}
            >
              <option value="">Aucun / à définir plus tard</option>
              {formation.creneaux.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="montantEuros">Montant (€)</Label>
          <Input
            id="montantEuros"
            type="number"
            step="0.01"
            min="0.01"
            {...register("montantEuros")}
          />
          {form.formState.errors.montantEuros && (
            <p className="text-sm text-red-600">
              {form.formState.errors.montantEuros.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel">Moyen de paiement</Label>
          <select id="channel" className={selectClass} {...register("channel")}>
            {ADMIN_RECORDED_CHANNEL_IDS.map((id) => (
              <option key={id} value={id}>
                {adminRecordedChannelLabel(id)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="statut">Statut</Label>
          <select id="statut" className={selectClass} {...register("statut")}>
            <option value="PAID">Payé (inscrit l’élève)</option>
            <option value="PENDING">En attente</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pays">Pays (facturation)</Label>
          <select id="pays" className={selectClass} {...register("pays")}>
            {BILLING_COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        type="submit"
        className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
        disabled={pending}
      >
        <Save className="h-4 w-4 mr-2" />
        {pending ? "Enregistrement…" : "Enregistrer le paiement"}
      </Button>
    </form>
  );
}
