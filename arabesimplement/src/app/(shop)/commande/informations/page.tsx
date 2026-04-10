"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckoutStepper } from "@/components/shop/CheckoutStepper";
import { CartItemDetailList } from "@/components/shop/CartItemDetailList";
import { useCart } from "@/hooks/useCart";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { orderFormSchema, type OrderFormInput } from "@/lib/validations/order.schema";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";

const countries = [
  "France",
  "Belgique",
  "Suisse",
  "Canada",
  "Maroc",
  "Algérie",
  "Tunisie",
  "Égypte",
  "Émirats arabes unis",
  "Arabie saoudite",
  "Autre",
];

import { REGLEMENT_INTERIEUR_HTML } from "@/lib/content/reglement-interieur";
import {
  createOrder,
  getCheckoutPrefill,
} from "@/app/(shop)/actions/order.actions";

export default function InformationsPage() {
  const router = useRouter();
  const { items, getTotal, isHydrated: cartHydrated } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    mode: "onChange",
    defaultValues: {
      prenom: "",
      nom: "",
      sexe: undefined,
      email: "",
      telephone: "",
      pays: "",
      acceptReglement: false,
      acceptCgv: false,
    },
  });

  useEffect(() => {
    if (!cartHydrated) return;
    if (items.length === 0) {
      router.push("/panier");
    }
  }, [items, router, cartHydrated]);

  const [checkoutLoggedIn, setCheckoutLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCheckoutPrefill().then((p) => {
      if (cancelled) return;
      setCheckoutLoggedIn(p.isLoggedIn);
      reset(
        {
          prenom: p.prenom,
          nom: p.nom,
          email: p.email,
          telephone: p.telephone,
          pays: "",
          acceptReglement: false,
          acceptCgv: false,
        },
        { keepDefaultValues: false }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [reset]);

  const onSubmit = async (data: OrderFormInput) => {
    setIsLoading(true);

    try {
      const result = await createOrder(data, items);

      if (!result.success) {
        toast.error(result.error ?? "Une erreur est survenue.");
        return;
      }

      sessionStorage.setItem(
        "orderInfo",
        JSON.stringify({
          prenom: data.prenom,
          nom: data.nom,
          email: data.email,
          items,
          total: result.totalEuros ?? getTotal(),
          orderId: result.orderId,
          paymentMode: result.paymentMode,
          clientSecret: result.clientSecret,
          stripePublishableKey: result.stripePublishableKey,
          checkoutKind: result.checkoutKind,
          createdAt: new Date().toISOString(),
        })
      );

      toast.success("Informations enregistrées !");
      router.push("/commande/paiement");
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartHydrated) {
    return (
      <div className="pt-20 min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <CheckoutStepper currentStep={2} />

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
          Vos informations
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-serif text-lg font-bold text-primary">
                    Informations personnelles
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        {...register("prenom")}
                        placeholder="Votre prénom"
                        className={errors.prenom ? "border-red-500" : ""}
                        data-testid="input-prenom"
                      />
                      {errors.prenom && (
                        <p className="text-red-500 text-sm">
                          {errors.prenom.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        {...register("nom")}
                        placeholder="Votre nom"
                        className={errors.nom ? "border-red-500" : ""}
                        data-testid="input-nom"
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-sm">
                          {errors.nom.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sexe">Vous êtes *</Label>
                    <p className="text-muted-foreground text-xs">
                      Pour vous orienter vers l’interlocuteur WhatsApp adapté
                      (équipe féminine ou masculine).
                    </p>
                    <Select
                      value={watch("sexe") ?? ""}
                      onValueChange={(value) => {
                        setValue("sexe", value as OrderFormInput["sexe"], {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <SelectTrigger
                        className={
                          errors.sexe ? "border-red-500 w-full" : "w-full"
                        }
                        data-testid="select-sexe"
                      >
                        <SelectValue placeholder="Choisissez une option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FEMME">Femme</SelectItem>
                        <SelectItem value="HOMME">Homme</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexe && (
                      <p className="text-red-500 text-sm">
                        {errors.sexe.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <p className="text-muted-foreground text-xs">
                      Adresse valide : utilisée pour la confirmation et l’envoi de vos accès.
                    </p>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="votre@email.com"
                      className={errors.email ? "border-red-500" : ""}
                      data-testid="input-email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telephone">
                        WhatsApp ou téléphone *
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Numéro joignable : cours, rappels et suivi peuvent passer par WhatsApp.
                      </p>
                      <Input
                        id="telephone"
                        {...register("telephone")}
                        placeholder="+33 6 12 34 56 78"
                        className={errors.telephone ? "border-red-500" : ""}
                        data-testid="input-telephone"
                      />
                      {errors.telephone && (
                        <p className="text-red-500 text-sm">
                          {errors.telephone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pays">Pays *</Label>
                      <Select
                        value={watch("pays") ?? ""}
                        onValueChange={(value) => {
                          setValue("pays", value ?? "", {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <SelectTrigger
                          className={errors.pays ? "border-red-500 w-full" : "w-full"}
                          data-testid="select-pays"
                        >
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.pays && (
                        <p className="text-red-500 text-sm">
                          {errors.pays.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Règlement intérieur */}
              <Card className="bg-white">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-serif text-lg font-bold text-primary">
                    Règlement intérieur
                  </h2>

                  <ScrollArea className="h-64 border rounded-lg p-4">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: REGLEMENT_INTERIEUR_HTML }}
                    />
                  </ScrollArea>

                  <div className="flex items-start gap-3 pt-2">
                    <Controller
                      name="acceptReglement"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="acceptReglement"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                          data-testid="checkbox-reglement"
                        />
                      )}
                    />
                    <Label
                      htmlFor="acceptReglement"
                      className="text-sm text-gray-600 cursor-pointer leading-relaxed"
                    >
                      J&apos;ai lu et j&apos;accepte le règlement intérieur
                      d&apos;ArabeSimplement *
                    </Label>
                  </div>
                  {errors.acceptReglement && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {errors.acceptReglement.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-start gap-3 pt-4 border-t">
                    <Controller
                      name="acceptCgv"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="acceptCgv"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                          data-testid="checkbox-cgv"
                        />
                      )}
                    />
                    <Label
                      htmlFor="acceptCgv"
                      className="text-sm text-gray-600 cursor-pointer leading-relaxed"
                    >
                      J&apos;ai lu et j&apos;accepte les{" "}
                      <Link
                        href="/conditions-generales-de-vente"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary font-medium underline-offset-2 hover:underline"
                      >
                        conditions générales de vente (CGV)
                      </Link>{" "}
                      *
                    </Label>
                  </div>
                  {errors.acceptCgv && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {errors.acceptCgv.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="bg-white sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-serif text-lg font-bold text-primary mb-4">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.lineId}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <div className="text-gray-600 min-w-0 flex-1">
                          <span className="block font-medium text-primary">
                            {item.titre}
                          </span>
                          <CartItemDetailList item={item} size="sm" />
                        </div>
                        <span className="font-medium text-primary shrink-0">
                          {formatPrice(item.prixPromo ?? item.prix)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="continue-button"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        Continuer vers le paiement
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
