"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminPromoCodeCreateSchema,
  type AdminPromoCodeCreateInput,
} from "@/lib/validations/promo-code.schema";
import { createPromoCode } from "./actions";

export function PromoCodeForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<AdminPromoCodeCreateInput>({
    resolver: zodResolver(
      adminPromoCodeCreateSchema
    ) as Resolver<AdminPromoCodeCreateInput>,
    defaultValues: {
      code: "",
      amountOffEuros: 10,
      expiresAt: "",
      maxRedemptions: undefined,
    },
  });

  const { register, handleSubmit, reset } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const res = await createPromoCode(data);
      if (res.success) {
        toast.success("Code promo créé");
        reset({
          code: "",
          amountOffEuros: 10,
          expiresAt: "",
          maxRedemptions: undefined,
        });
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-gray-200 bg-white p-6 space-y-4 mb-8"
    >
      <h2 className="font-serif text-lg font-bold text-primary">
        Nouveau code promo
      </h2>
      <p className="text-sm text-gray-500">
        Réduction en montant fixe (€), appliquée au paiement (Stripe et
        PayPal.me). Pour un abonnement mensuel, elle ne porte que sur le premier
        mois.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            placeholder="RAMADAN10"
            className="font-mono tracking-wide uppercase"
            {...register("code")}
          />
          {form.formState.errors.code ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.code.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="amountOffEuros">Réduction (€)</Label>
          <Input
            id="amountOffEuros"
            type="number"
            step="0.01"
            min="0.01"
            {...register("amountOffEuros", { valueAsNumber: true })}
          />
          {form.formState.errors.amountOffEuros ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.amountOffEuros.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiration (optionnel)</Label>
          <Input id="expiresAt" type="datetime-local" {...register("expiresAt")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxRedemptions">Utilisations max. (optionnel)</Label>
          <Input
            id="maxRedemptions"
            type="number"
            min="1"
            placeholder="Illimité"
            {...register("maxRedemptions")}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
      >
        <Save className="h-4 w-4 mr-2" />
        {pending ? "Enregistrement…" : "Créer le code"}
      </Button>
    </form>
  );
}
