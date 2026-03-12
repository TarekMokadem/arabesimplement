"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth.schema";
import { toast } from "sonner";

export default function MotDePassePerduPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);

    try {
      // TODO: Implement Supabase password reset
      // const supabase = createSupabaseClient();
      // await supabase.auth.resetPasswordForEmail(data.email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      toast.success("Email de réinitialisation envoyé !");
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#B7860B] to-[#D4AF37] rounded-xl flex items-center justify-center">
              <span className="font-arabic text-white text-xl font-bold">ع</span>
            </div>
            <span className="font-serif font-bold text-2xl text-[#0F2A45]">
              ArabeSimplement
            </span>
          </Link>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl text-[#0F2A45]">
              {isSubmitted ? "Email envoyé !" : "Mot de passe oublié"}
            </CardTitle>
            <p className="text-gray-500 text-sm mt-2">
              {isSubmitted
                ? "Vérifiez votre boîte mail pour réinitialiser votre mot de passe."
                : "Entrez votre email pour recevoir un lien de réinitialisation."}
            </p>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[#1A7A4A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-[#1A7A4A]" />
                </div>
                <Link href="/connexion">
                  <Button className="bg-[#B7860B] hover:bg-[#0F2A45] text-white">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="votre@email.com"
                    className={errors.email ? "border-red-500" : ""}
                    data-testid="reset-email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#B7860B] hover:bg-[#0F2A45] text-white py-6"
                  data-testid="reset-submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le lien"
                  )}
                </Button>

                <Link
                  href="/connexion"
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#B7860B] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
