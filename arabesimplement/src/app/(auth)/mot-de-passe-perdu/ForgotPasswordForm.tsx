"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth.schema";
import { requestForgotPasswordEmail } from "@/app/(auth)/actions/password-reset.actions";

const FORGOT_CONFIRM =
  "Si un compte est associé à cette adresse, vous recevrez un e-mail avec un lien pour choisir un nouveau mot de passe. Le lien sera valable 24 heures.";

export function ForgotPasswordForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    const r = await requestForgotPasswordEmail(data.email);
    if (!r.success) {
      setServerError(r.error);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandLogoMark size={48} />
              <span className="font-serif font-bold text-2xl text-primary">
                ArabeSimplement
              </span>
            </Link>
          </div>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-primary text-center">
                Vérifiez votre boîte mail
              </CardTitle>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                {FORGOT_CONFIRM}
              </p>
            </CardHeader>
            <CardContent>
              <Link
                href="/connexion"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-surface"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandLogoMark size={48} />
            <span className="font-serif font-bold text-2xl text-primary">
              ArabeSimplement
            </span>
          </Link>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl text-primary">
              Mot de passe oublié
            </CardTitle>
            <p className="text-gray-600 text-sm mt-3 text-left leading-relaxed">
              Indiquez l’adresse e-mail de votre compte. Si elle existe, vous
              recevrez un lien pour définir un nouveau mot de passe (valable
              24&nbsp;h, une seule utilisation).
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">E-mail</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  className={errors.email ? "border-red-500" : ""}
                  {...register("email")}
                  placeholder="votre@email.com"
                  data-testid="forgot-email"
                />
                {errors.email ? (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                ) : null}
              </div>
              {serverError ? (
                <p className="text-red-600 text-sm">{serverError}</p>
              ) : null}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-6"
                data-testid="forgot-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi…
                  </>
                ) : (
                  "Envoyer le lien"
                )}
              </Button>
            </form>
            <Link
              href="/connexion"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
