"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  learnerProfileSchema,
  type LearnerProfileInput,
} from "@/lib/validations/learner-profile.schema";
import { updateLearnerProfile } from "@/app/(auth)/actions/learner-profile.actions";

type Props = {
  initialPrenom: string;
  initialNom: string;
  initialTelephone: string;
  disabled?: boolean;
};

export function LearnerProfileForm({
  initialPrenom,
  initialNom,
  initialTelephone,
  disabled,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LearnerProfileInput>({
    resolver: zodResolver(learnerProfileSchema),
    defaultValues: {
      prenom: initialPrenom,
      nom: initialNom,
      telephone: initialTelephone ?? "",
    },
  });

  const busy = disabled || pending;

  const onSubmit = (data: LearnerProfileInput) => {
    setMessage(null);
    startTransition(async () => {
      const r = await updateLearnerProfile(data);
      if (r.ok) {
        setMessage({ type: "ok", text: "Profil enregistré." });
        router.refresh();
      } else {
        setMessage({ type: "err", text: r.error });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profile-prenom">Prénom</Label>
        <Input
          id="profile-prenom"
          disabled={busy}
          className={errors.prenom ? "border-red-500" : ""}
          {...register("prenom")}
          data-testid="learner-profile-prenom"
        />
        {errors.prenom ? (
          <p className="text-xs text-red-600">{errors.prenom.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-nom">Nom</Label>
        <Input
          id="profile-nom"
          disabled={busy}
          className={errors.nom ? "border-red-500" : ""}
          {...register("nom")}
          data-testid="learner-profile-nom"
        />
        {errors.nom ? (
          <p className="text-xs text-red-600">{errors.nom.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-tel">Téléphone / WhatsApp</Label>
        <Input
          id="profile-tel"
          type="tel"
          placeholder="Ex. +33 6 12 34 56 78"
          disabled={busy}
          className={errors.telephone ? "border-red-500" : ""}
          {...register("telephone")}
          data-testid="learner-profile-telephone"
        />
        {errors.telephone ? (
          <p className="text-xs text-red-600">{errors.telephone.message}</p>
        ) : (
          <p className="text-xs text-gray-500">
            Laissez vide pour effacer. Au moins 8 chiffres si renseigné.
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={busy}
        size="sm"
        className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
        data-testid="learner-profile-submit"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement…
          </>
        ) : (
          "Enregistrer mes informations"
        )}
      </Button>
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
    </form>
  );
}
