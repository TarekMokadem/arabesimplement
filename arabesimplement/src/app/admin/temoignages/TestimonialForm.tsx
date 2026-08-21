"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Mic, Save, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TestimonialAudioPlayer } from "@/components/testimonials/TestimonialAudioPlayer";
import {
  adminTestimonialWriteSchema,
  type AdminTestimonialWriteInput,
} from "@/lib/validations/admin-testimonial.schema";
import { createTestimonial, updateTestimonial } from "./actions";

type Props =
  | { mode: "create" }
  | { mode: "edit"; id: string };

export function TestimonialForm(
  props: Props & { defaultValues: AdminTestimonialWriteInput }
) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const form = useForm<AdminTestimonialWriteInput>({
    resolver: zodResolver(
      adminTestimonialWriteSchema
    ) as Resolver<AdminTestimonialWriteInput>,
    defaultValues: props.defaultValues,
  });

  const { register, control, handleSubmit, watch, setValue } = form;
  const kind = watch("kind");
  const audioUrl = watch("audioUrl");

  const onAudioFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/temoignages/upload-audio", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Échec du téléversement");
        return;
      }
      if (data.url) {
        setValue("audioUrl", data.url, { shouldValidate: true });
        toast.success("Audio ajouté");
      }
    } catch {
      toast.error("Échec du téléversement");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      if (props.mode === "create") {
        const res = await createTestimonial(data);
        if (res.success) {
          toast.success("Témoignage créé");
          form.reset({
            nom: "",
            kind: "TEXT",
            texte: "",
            audioUrl: "",
            note: 5,
            approuve: false,
          });
          router.refresh();
        } else toast.error(res.error);
      } else {
        const res = await updateTestimonial(props.id, data);
        if (res.success) {
          toast.success("Témoignage enregistré");
          router.refresh();
        } else toast.error(res.error);
      }
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-gray-200 bg-white p-6 space-y-4 mb-8"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-lg font-bold text-primary">
          {props.mode === "create"
            ? "Nouveau témoignage"
            : "Modifier le témoignage"}
        </h2>
        {props.mode === "edit" && (
          <Link
            href="/admin/temoignages"
            className="text-sm text-secondary hover:underline"
          >
            ← Retour liste
          </Link>
        )}
      </div>

      <div className="space-y-2">
        <Label>Type de témoignage</Label>
        <Controller
          name="kind"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => field.onChange("TEXT")}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  field.value === "TEXT"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-primary hover:bg-muted"
                }`}
              >
                <Type className="h-4 w-4" />
                Textuel
              </button>
              <button
                type="button"
                onClick={() => field.onChange("AUDIO")}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  field.value === "AUDIO"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-primary hover:bg-muted"
                }`}
              >
                <Mic className="h-4 w-4" />
                Audio
              </button>
            </div>
          )}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="t-nom">Nom affiché</Label>
          <Input id="t-nom" {...register("nom")} />
          {form.formState.errors.nom && (
            <p className="text-sm text-red-600">
              {form.formState.errors.nom.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="t-note">Note /5</Label>
          <Input
            id="t-note"
            type="number"
            min={1}
            max={5}
            {...register("note", { valueAsNumber: true })}
          />
        </div>
      </div>

      {kind === "AUDIO" ? (
        <div className="space-y-2">
          <Label htmlFor="t-audio">Fichier audio</Label>
          <Input
            id="t-audio"
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/webm,audio/ogg,audio/mp4,audio/x-m4a,audio/aac"
            onChange={onAudioFile}
            disabled={uploading}
          />
          <p className="text-xs text-gray-500">
            MP3, WAV, WebM, OGG ou M4A — 4 Mo max.
          </p>
          {audioUrl ? <TestimonialAudioPlayer src={audioUrl} /> : null}
          {form.formState.errors.audioUrl && (
            <p className="text-sm text-red-600">
              {form.formState.errors.audioUrl.message}
            </p>
          )}
          <div className="space-y-2 pt-2">
            <Label htmlFor="t-texte">Légende (optionnel)</Label>
            <Textarea id="t-texte" rows={3} {...register("texte")} />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="t-texte">Texte</Label>
          <Textarea id="t-texte" rows={5} {...register("texte")} />
          {form.formState.errors.texte && (
            <p className="text-sm text-red-600">
              {form.formState.errors.texte.message}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Controller
          name="approuve"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={(v) => field.onChange(!!v)}
            />
          )}
        />
        <Label className="font-normal cursor-pointer">
          Visible sur la page publique (approuvé)
        </Label>
      </div>
      <Button
        type="submit"
        disabled={pending || uploading}
        className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
      >
        <Save className="h-4 w-4 mr-2" />
        {props.mode === "create" ? "Ajouter" : "Enregistrer"}
      </Button>
    </form>
  );
}
