"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

  const form = useForm<AdminTestimonialWriteInput>({
    resolver: zodResolver(
      adminTestimonialWriteSchema
    ) as Resolver<AdminTestimonialWriteInput>,
    defaultValues: props.defaultValues,
  });

  const { register, control, handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      if (props.mode === "create") {
        const res = await createTestimonial(data);
        if (res.success) {
          toast.success("Témoignage créé");
          form.reset({
            nom: "",
            texte: "",
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
      <div className="space-y-2">
        <Label htmlFor="t-texte">Texte</Label>
        <Textarea id="t-texte" rows={5} {...register("texte")} />
        {form.formState.errors.texte && (
          <p className="text-sm text-red-600">
            {form.formState.errors.texte.message}
          </p>
        )}
      </div>
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
        disabled={pending}
        className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
      >
        <Save className="h-4 w-4 mr-2" />
        {props.mode === "create" ? "Ajouter" : "Enregistrer"}
      </Button>
    </form>
  );
}
