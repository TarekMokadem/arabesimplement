"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signupSchema, type SignupInput } from "@/lib/validations/auth.schema";
import { toast } from "sonner";
import { signUp } from "../actions";

export default function InscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);

    try {
      const result = await signUp(data.email, data.password, data.prenom, data.nom);
      if (result?.redirectTo) {
        toast.success("Inscription réussie ! Bienvenue sur ArabeSimplement.");
        router.push(result.redirectTo);
      }
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
        {/* Retour accueil */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#0F2A45] hover:text-[#B7860B] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>

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
              Créer un compte
            </CardTitle>
            <p className="text-gray-500 text-sm mt-2">
              Rejoignez la communauté ArabeSimplement
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    {...register("prenom")}
                    placeholder="Votre prénom"
                    className={errors.prenom ? "border-red-500" : ""}
                    data-testid="signup-prenom"
                  />
                  {errors.prenom && (
                    <p className="text-red-500 text-xs">
                      {errors.prenom.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    {...register("nom")}
                    placeholder="Votre nom"
                    className={errors.nom ? "border-red-500" : ""}
                    data-testid="signup-nom"
                  />
                  {errors.nom && (
                    <p className="text-red-500 text-xs">{errors.nom.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="votre@email.com"
                  className={errors.email ? "border-red-500" : ""}
                  data-testid="signup-email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    data-testid="signup-password"
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
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  data-testid="signup-confirm-password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#B7860B] hover:bg-[#0F2A45] text-white py-6"
                data-testid="signup-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Déjà un compte ?{" "}
                <Link
                  href="/connexion"
                  className="text-[#B7860B] font-medium hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
