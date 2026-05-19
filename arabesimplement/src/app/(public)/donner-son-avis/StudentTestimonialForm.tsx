"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  studentTestimonialSchema,
  type StudentTestimonialInput,
} from "@/lib/validations/student-testimonial.schema";
import { submitStudentTestimonial } from "@/app/(public)/actions/testimonial-invite.actions";

type Props = {
  token: string;
  defaultNom?: string;
};

export function StudentTestimonialForm({ token, defaultNom = "" }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentTestimonialInput>({
    resolver: zodResolver(
      studentTestimonialSchema
    ) as Resolver<StudentTestimonialInput>,
    defaultValues: {
      token,
      nom: defaultNom,
      texte: "",
      note: 5,
    },
  });

  const onSubmit = async (data: StudentTestimonialInput) => {
    setLoading(true);
    try {
      const result = await submitStudentTestimonial({ ...data, token });
      if (result.success) {
        setSubmitted(true);
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-lg mx-auto bg-white">
        <CardContent className="p-8 text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-accent mx-auto" />
          <h2 className="font-serif text-xl font-bold text-primary">
            Merci pour votre témoignage
          </h2>
          <p className="text-gray-600 text-sm">
            Votre avis a bien été enregistré. Il sera publié sur le site après
            validation par l&apos;équipe ArabeSimplement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto bg-white">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...register("token")} />

          <div className="space-y-2">
            <Label htmlFor="nom">Votre prénom (affiché sur le site)</Label>
            <Input id="nom" {...register("nom")} autoComplete="given-name" />
            {errors.nom && (
              <p className="text-sm text-red-600">{errors.nom.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <div className="flex gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                      onClick={() => field.onChange(n)}
                      aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          n <= field.value
                            ? "fill-secondary text-secondary"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.note && (
              <p className="text-sm text-red-600">{errors.note.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="texte">Votre témoignage</Label>
            <Textarea
              id="texte"
              rows={5}
              placeholder="Partagez votre expérience avec ArabeSimplement…"
              {...register("texte")}
            />
            {errors.texte && (
              <p className="text-sm text-red-600">{errors.texte.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi…
              </>
            ) : (
              "Envoyer mon avis"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
