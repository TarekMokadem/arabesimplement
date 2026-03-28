"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  formationAdminSchema,
  type FormationAdminInput,
  type FormationEditorDefaults,
} from "@/lib/validations/admin-formations.schema";
import { slugify } from "@/lib/utils/format";
import {
  createFormation,
  updateFormation,
  deleteFormation,
} from "./actions";

type Props =
  | { mode: "create" }
  | {
      mode: "edit";
      formationId: string;
      slugAvant: string;
    };

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function FormationEditorForm(
  props: Props & { defaultValues: FormationEditorDefaults }
) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<
    FormationEditorDefaults,
    unknown,
    FormationAdminInput
  >({
    resolver: zodResolver(formationAdminSchema) as never,
    defaultValues: props.defaultValues,
  });

  const { register, control, handleSubmit, watch, setValue, getValues } = form;
  const slugBoutique =
    watch("slug")?.trim() ||
    (props.mode === "edit" ? props.slugAvant : "");

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      if (props.mode === "create") {
        const res = await createFormation(data);
        if (res.success && res.id) {
          toast.success("Formation créée");
          router.push(`/admin/formations/${res.id}`);
        } else {
          toast.error("error" in res ? res.error : "Erreur");
        }
      } else {
        const res = await updateFormation(props.formationId, data);
        if (res.success) {
          toast.success("Formation enregistrée");
          router.refresh();
        } else {
          toast.error(res.error);
        }
      }
    });
  });

  const genererSlug = () => {
    const t = getValues("titre");
    if (!t?.trim()) {
      toast.message("Renseignez d’abord le titre");
      return;
    }
    setValue("slug", slugify(t), { shouldValidate: true });
  };

  const supprimer = () => {
    if (props.mode !== "edit") return;
    if (
      !window.confirm(
        "Supprimer définitivement cette formation ? (impossible s’il existe des commandes ou inscriptions.)"
      )
    ) {
      return;
    }
    startTransition(async () => {
      const res = await deleteFormation(props.formationId);
      if (res.success) {
        toast.success("Formation supprimée");
        router.push("/admin/formations");
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/formations"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-primary">
            Informations générales
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="titre">Titre</Label>
              <Input id="titre" {...register("titre")} />
              {form.formState.errors.titre && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.titre.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <div className="flex gap-2">
                <Input id="slug" {...register("slug")} className="flex-1" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={genererSlug}
                  className="shrink-0"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              {form.formState.errors.slug && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie</Label>
              <Input id="categorie" {...register("categorie")} />
              {form.formState.errors.categorie && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.categorie.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <select id="statut" className={selectClass} {...register("statut")}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="COMING_SOON">Bientôt disponible</option>
                <option value="ARCHIVED">Archivée</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (€)</Label>
              <Input
                id="prix"
                type="number"
                step="0.01"
                min="0"
                {...register("prix", { valueAsNumber: true })}
              />
              {form.formState.errors.prix && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.prix.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prixPromo">Prix promo (€, optionnel)</Label>
              <Input
                id="prixPromo"
                type="number"
                step="0.01"
                min="0"
                placeholder="—"
                {...register("prixPromo", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placesMax">Places max. (optionnel)</Label>
              <Input
                id="placesMax"
                type="number"
                min="1"
                placeholder="—"
                {...register("placesMax", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="imageUrl">URL de l’image</Label>
              <Input id="imageUrl" type="url" placeholder="https://…" {...register("imageUrl")} />
              {form.formState.errors.imageUrl && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Label htmlFor="descriptionCourte">Description courte (boutique)</Label>
          <Textarea id="descriptionCourte" rows={3} {...register("descriptionCourte")} />
          {form.formState.errors.descriptionCourte && (
            <p className="text-sm text-red-600">
              {form.formState.errors.descriptionCourte.message}
            </p>
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Label htmlFor="description">Description détaillée (HTML autorisé)</Label>
          <Textarea id="description" rows={12} {...register("description")} className="font-mono text-sm" />
        </div>

        <div className="space-y-4 lg:col-span-2 rounded-lg border border-secondary/30 bg-white p-4">
          <h2 className="font-serif text-xl font-bold text-primary">
            Mise en avant (accueil)
          </h2>
          <div className="flex items-center gap-2">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(!!v)}
                />
              )}
            />
            <Label className="font-normal cursor-pointer">Formation mise en avant</Label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="featuredTitre">Titre affiché</Label>
              <Input id="featuredTitre" {...register("featuredTitre")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredBadge">Badge</Label>
              <Input id="featuredBadge" {...register("featuredBadge")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="featuredContent">Texte court</Label>
              <Textarea id="featuredContent" rows={3} {...register("featuredContent")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredExpiresAt">Fin de l’offre (optionnel)</Label>
              <Input
                id="featuredExpiresAt"
                type="datetime-local"
                {...register("featuredExpiresAt")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
        >
          <Save className="h-4 w-4 mr-2" />
          {props.mode === "create" ? "Créer la formation" : "Enregistrer"}
        </Button>
        {props.mode === "edit" && (
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={supprimer}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        )}
        {slugBoutique ? (
          <Link href={`/boutique/${slugBoutique}`}>
            <Button type="button" variant="outline">
              Voir en boutique
            </Button>
          </Link>
        ) : (
          <Button type="button" variant="outline" disabled>
            Voir en boutique
          </Button>
        )}
      </div>
    </form>
  );
}
