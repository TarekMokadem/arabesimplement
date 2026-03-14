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
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";
import { toast } from "sonner";
import { signIn } from "../actions";

export default function ConnexionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const result = await signIn(data.email, data.password);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.redirectTo) {
        toast.success("Connexion réussie !");
        router.push(result.redirectTo);
      }
    } catch (error) {
      toast.error("Email ou mot de passe incorrect");
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
              Connexion
            </CardTitle>
            <p className="text-gray-500 text-sm mt-2">
              Accédez à votre espace apprenant
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="votre@email.com"
                  className={errors.email ? "border-red-500" : ""}
                  data-testid="login-email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/mot-de-passe-perdu"
                    className="text-sm text-[#B7860B] hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    data-testid="login-password"
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
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#B7860B] hover:bg-[#0F2A45] text-white py-6"
                data-testid="login-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Pas encore de compte ?{" "}
                <Link
                  href="/inscription"
                  className="text-[#B7860B] font-medium hover:underline"
                >
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
