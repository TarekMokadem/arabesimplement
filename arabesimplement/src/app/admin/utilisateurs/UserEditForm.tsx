"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminUserUpdateSchema,
  type AdminUserUpdateInput,
} from "@/lib/validations/admin-user.schema";
import { updateAdminUser, deleteAdminUser } from "./actions";

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type Props = {
  userId: string;
  defaultValues: AdminUserUpdateInput;
  commandesCount: number;
  inscriptionsCount: number;
};

export function UserEditForm({
  userId,
  defaultValues,
  commandesCount,
  inscriptionsCount,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<AdminUserUpdateInput>({
    resolver: zodResolver(
      adminUserUpdateSchema
    ) as Resolver<AdminUserUpdateInput>,
    defaultValues,
  });
  const { register, handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const res = await updateAdminUser(userId, data);
      if (res.success) {
        toast.success("Utilisateur mis à jour");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  });

  const supprimer = () => {
    if (commandesCount > 0 || inscriptionsCount > 0) {
      toast.error(
        "Ce compte a des commandes ou inscriptions : suppression impossible."
      );
      return;
    }
    if (!window.confirm("Supprimer définitivement cet utilisateur ?")) return;
    startTransition(async () => {
      const res = await deleteAdminUser(userId);
      if (res.success) {
        toast.success("Utilisateur supprimé");
        router.push("/admin/utilisateurs");
      } else {
        toast.error(res.error);
      }
    });
  };

  const canDelete = commandesCount === 0 && inscriptionsCount === 0;

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
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" {...register("telephone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <select id="role" className={selectClass} {...register("role")}>
            <option value="STUDENT">Étudiant</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Liens en base : {commandesCount} commande(s), {inscriptionsCount}{" "}
        inscription(s).
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
          disabled={pending}
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={pending || !canDelete}
          onClick={supprimer}
          title={
            !canDelete
              ? "Suppression impossible tant qu’il existe des commandes ou inscriptions"
              : undefined
          }
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>
    </form>
  );
}
