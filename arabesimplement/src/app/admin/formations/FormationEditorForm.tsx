"use client";

import { useTransition, useEffect, useState } from "react";
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
import {
  CreneauManager,
  type CreneauListeItem,
} from "./CreneauManager";

type Props =
  | { mode: "create" }
  | {
      mode: "edit";
      formationId: string;
      slugAvant: string;
      creneaux: CreneauListeItem[];
    };

const selectClass =
  "flex h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function FormationEditorForm(
  props: Props & { defaultValues: FormationEditorDefaults }
) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<
    FormationEditorDefaults,
    unknown,
    FormationAdminInput
  >({
    resolver: zodResolver(formationAdminSchema) as never,
    defaultValues: props.defaultValues,
  });

  const { register, control, handleSubmit, watch, setValue, getValues } = form;
  const schedulingMode = watch("schedulingMode");
  const imageUrlWatch = watch("imageUrl");

  const onImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/formations/upload-image", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Échec du téléversement");
        return;
      }
      if (data.url) {
        setValue("imageUrl", data.url, { shouldValidate: true });
        toast.success("Image enregistrée");
      }
    } catch {
      toast.error("Échec du téléversement");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (schedulingMode === "HOURLY_PURCHASE") {
      setValue("prix", 0, { shouldValidate: true });
      setValue("prixPromo", undefined);
    }
  }, [schedulingMode, setValue]);

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
              <Label htmlFor="theme">Domaine</Label>
              <select
                id="theme"
                className={selectClass}
                {...register("theme")}
              >
                <option value="ARABE">Arabe (langue, lecture…)</option>
                <option value="RELIGION">
                  Religion (Coran, invocations, sciences…)
                </option>
                <option value="MIX">Pack mixte (arabe + religion)</option>
              </select>
              <p className="text-xs text-gray-500">
                Utilisé pour les filtres de la boutique. Un futur pack combinant
                les deux domaines pourra utiliser « Pack mixte ».
              </p>
              {form.formState.errors.theme && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.theme.message}
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
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="schedulingMode">Organisation des cours</Label>
              <select
                id="schedulingMode"
                className={selectClass}
                {...register("schedulingMode")}
              >
                <option value="FIXED_SLOTS">
                  Créneaux proposés — forfait unique, calendrier / créneaux à respecter
                </option>
                <option value="FLEXIBLE_FORMATION">
                  Paiement forfaitaire — forfait unique, organisation libre avec le prof
                </option>
                <option value="HOURLY_PURCHASE">
                  Cours à la carte — paiement à chaque cours, durée par séance (grille tarifs)
                </option>
              </select>
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong className="font-medium text-gray-700">Créneaux proposés</strong> et{" "}
                <strong className="font-medium text-gray-700">forfaitaire</strong> : un seul
                paiement à l’achat — la différence est que les créneaux imposent un
                calendrier.{" "}
                <strong className="font-medium text-gray-700">À la carte</strong> : même
                logique d’organisation qu’avec le prof, mais chaque séance se paie et a une
                durée définie. La section « Créneaux » plus bas s’adapte au mode choisi.
              </p>
            </div>
            {schedulingMode === "HOURLY_PURCHASE" ? (
              <div className="space-y-2 sm:col-span-2 rounded-lg border border-secondary/25 bg-secondary/5 px-3 py-3 text-sm text-gray-700">
                <p className="font-medium text-primary">Tarification à la séance</p>
                <p>
                  Pas de prix forfaitaire : sur la boutique, l’élève choisit la durée
                  (1 h / 40 min / 30 min) et éventuellement un créneau. Grille 10 € / 8 € / 5 €.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="prix">Prix forfaitaire (€)</Label>
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
              </>
            )}
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
              <Label htmlFor="imageFile">Image (fichier sur cet ordinateur)</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={uploadingImage || pending}
                className="cursor-pointer bg-white file:cursor-pointer file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                onChange={onImageFile}
              />
              <p className="text-muted-foreground text-xs">
                JPEG, PNG, WebP ou GIF — max. 5 Mo. Vous pouvez aussi coller une URL ci‑dessous.
              </p>
              <Label htmlFor="imageUrl" className="pt-1">
                Ou URL de l’image
              </Label>
              <Input
                id="imageUrl"
                type="text"
                placeholder="https://… ou laisser vide"
                className="bg-white"
                {...register("imageUrl")}
              />
              {form.formState.errors.imageUrl && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.imageUrl.message}
                </p>
              )}
              {imageUrlWatch?.trim() ? (
                <div className="pt-1">
                  <p className="text-muted-foreground mb-1 text-xs">Aperçu</p>
                  {/* eslint-disable-next-line @next/next/no-img-element -- URLs externes ou /uploads locales */}
                  <img
                    src={imageUrlWatch}
                    alt=""
                    className="max-h-40 max-w-full rounded-md border object-contain"
                  />
                </div>
              ) : null}
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

      {props.mode === "edit" && schedulingMode === "FIXED_SLOTS" && (
        <>
          <hr className="border-gray-200 my-10" />
          <CreneauManager
            formationId={props.formationId}
            creneaux={props.creneaux}
            schedulingMode={schedulingMode}
          />
        </>
      )}

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
