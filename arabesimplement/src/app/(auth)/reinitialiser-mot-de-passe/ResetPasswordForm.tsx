"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { BrandLogoMark } from "@/components/layout/BrandLogoMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormInput,
} from "@/lib/validations/password-reset-completion.schema";
import { completePasswordReset } from "@/app/(auth)/actions/password-reset.actions";

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormInput) => {
    setServerError(null);
    const r = await completePasswordReset(
      token,
      data.password,
      data.confirmPassword
    );
    if (!r.success) {
      setServerError(r.error);
      return;
    }
    router.push("/connexion?reset=ok");
  };

  if (!token || token.length < 20) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-primary">
                Lien invalide
              </CardTitle>
              <p className="text-sm text-gray-600">
                Le lien est incomplet ou a été modifié. Demandez un nouveau lien
                depuis la page « Mot de passe oublié ».
              </p>
            </CardHeader>
            <CardContent>
              <Link
                href="/mot-de-passe-perdu"
                className="text-secondary underline text-sm"
              >
                Mot de passe oublié
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
              Nouveau mot de passe
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Choisissez un mot de passe d’au moins 8 caractères.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    {...register("password")}
                    data-testid="reset-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={
                    errors.confirmPassword ? "border-red-500" : ""
                  }
                  {...register("confirmPassword")}
                  data-testid="reset-password-confirm"
                />
                {errors.confirmPassword ? (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>
              {serverError ? (
                <p className="text-red-600 text-sm">{serverError}</p>
              ) : null}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  "Enregistrer le mot de passe"
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
