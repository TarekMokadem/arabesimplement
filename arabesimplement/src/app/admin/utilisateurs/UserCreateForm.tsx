"use client";

import { useState, useTransition } from "react";
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
  adminUserCreateSchema,
  type AdminUserCreateInput,
} from "@/lib/validations/admin-user.schema";
import { createAdminUser } from "./actions";

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function UserCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [created, setCreated] = useState<{
    userId: string;
    plainPassword: string;
    emailed: boolean;
  } | null>(null);

  const form = useForm<AdminUserCreateInput>({
    resolver: zodResolver(
      adminUserCreateSchema
    ) as Resolver<AdminUserCreateInput>,
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      role: "STUDENT",
      sendCredentials: true,
    },
  });
  const { register, handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const res = await createAdminUser(data);
      if (res.success) {
        setCreated({
          userId: res.userId,
          plainPassword: res.plainPassword,
          emailed: res.emailed,
        });
        toast.success("Client ajouté.");
      } else {
        toast.error(res.error);
      }
    });
  });

  if (created) {
    return (
      <div className="space-y-6 max-w-xl">
        <Link
          href="/admin/utilisateurs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Link>
        <div className="rounded-xl border bg-white p-6 space-y-3">
          <p className="font-medium text-primary">Client créé.</p>
          <p className="text-sm text-gray-600">
            Mot de passe provisoire (notez-le, il ne sera plus affiché) :
          </p>
          <code className="block rounded-lg bg-gray-50 border px-3 py-2 text-sm">
            {created.plainPassword}
          </code>
          <p className="text-sm text-gray-500">
            {created.emailed
              ? "Un e-mail avec ces identifiants a été envoyé."
              : "L’e-mail n’a pas pu être envoyé. Transmettez le mot de passe au client."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => router.push(`/admin/utilisateurs/${created.userId}`)}
            className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            Voir la fiche
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                `/admin/paiements/nouveau?userId=${encodeURIComponent(created.userId)}`
              )
            }
          >
            Ajouter un paiement
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
      <Link
        href="/admin/utilisateurs"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la liste
      </Link>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" {...register("prenom")} />
          {form.formState.errors.prenom && (
            <p className="text-sm text-red-600">
              {form.formState.errors.prenom.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" {...register("nom")} />
          {form.formState.errors.nom && (
            <p className="text-sm text-red-600">
              {form.formState.errors.nom.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone / WhatsApp</Label>
          <Input id="telephone" {...register("telephone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sexe">Sexe (optionnel)</Label>
          <select id="sexe" className={selectClass} {...register("sexe")}>
            <option value="">—</option>
            <option value="FEMME">Femme</option>
            <option value="HOMME">Homme</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <select id="role" className={selectClass} {...register("role")}>
            <option value="STUDENT">Étudiant</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" {...register("sendCredentials")} />
          Envoyer les identifiants par e-mail
        </label>
      </div>

      <Button
        type="submit"
        className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
        disabled={pending}
      >
        <Save className="h-4 w-4 mr-2" />
        {pending ? "Création…" : "Ajouter le client"}
      </Button>
    </form>
  );
}
