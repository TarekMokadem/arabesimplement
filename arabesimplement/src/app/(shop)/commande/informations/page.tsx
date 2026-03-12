"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { useCartStore } from "@/store/cart.store";
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

// Mock règlement intérieur
const reglementInterieur = `
<h3>Règlement Intérieur - ArabeSimplement</h3>

<h4>Article 1 : Objet</h4>
<p>Le présent règlement intérieur définit les conditions d'utilisation des services de formation proposés par ArabeSimplement.</p>

<h4>Article 2 : Inscription</h4>
<p>L'inscription à une formation implique l'acceptation sans réserve du présent règlement. Le paiement de la formation vaut acceptation définitive.</p>

<h4>Article 3 : Accès aux cours</h4>
<p>L'accès aux cours en ligne est personnel et non cessible. Tout partage des identifiants de connexion est strictement interdit.</p>

<h4>Article 4 : Comportement</h4>
<p>Les apprenants s'engagent à adopter un comportement respectueux envers les formateurs et les autres apprenants. Tout comportement inapproprié pourra entraîner l'exclusion sans remboursement.</p>

<h4>Article 5 : Propriété intellectuelle</h4>
<p>Tous les contenus (vidéos, documents, supports) sont la propriété exclusive d'ArabeSimplement. Toute reproduction ou diffusion est interdite.</p>

<h4>Article 6 : Remboursement</h4>
<p>Conformément au droit de rétractation, vous disposez de 14 jours pour demander un remboursement, à condition de n'avoir pas accédé aux contenus de formation.</p>

<h4>Article 7 : Protection des données</h4>
<p>Vos données personnelles sont traitées conformément à notre politique de confidentialité et au RGPD.</p>
`;

export default function InformationsPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptReglement, setAcceptReglement] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    mode: "onChange",
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      pays: "",
      acceptReglement: false,
    },
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/panier");
    }
  }, [items, router]);

  // Sync acceptReglement with form
  useEffect(() => {
    setValue("acceptReglement", acceptReglement);
  }, [acceptReglement, setValue]);

  const onSubmit = async (data: OrderFormInput) => {
    setIsLoading(true);

    try {
      // TODO: Call createOrder Server Action
      // const result = await createOrder(data, items);

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store order info in session
      sessionStorage.setItem(
        "orderInfo",
        JSON.stringify({
          ...data,
          items,
          total: getTotal(),
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

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-[#F9F7F2]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <CheckoutStepper currentStep={2} />

        <h1 className="font-serif text-3xl font-bold text-[#0F2A45] mb-8">
          Vos informations
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white">
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-serif text-lg font-bold text-[#0F2A45]">
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
                    <Label htmlFor="email">Email *</Label>
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
                      <Label htmlFor="telephone">Téléphone *</Label>
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
                        value={watch("pays") || undefined}
                        onValueChange={(value) => {
                          if (value) setValue("pays", value);
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
                  <h2 className="font-serif text-lg font-bold text-[#0F2A45]">
                    Règlement intérieur
                  </h2>

                  <ScrollArea className="h-64 border rounded-lg p-4">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: reglementInterieur }}
                    />
                  </ScrollArea>

                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="acceptReglement"
                      checked={acceptReglement}
                      onCheckedChange={(checked) =>
                        setAcceptReglement(checked as boolean)
                      }
                      data-testid="checkbox-reglement"
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
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="bg-white sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-serif text-lg font-bold text-[#0F2A45] mb-4">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600 truncate max-w-[60%]">
                          {item.titre}
                        </span>
                        <span className="font-medium text-[#0F2A45]">
                          {formatPrice(item.prixPromo ?? item.prix)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#0F2A45]">Total</span>
                      <span className="text-2xl font-bold text-[#0F2A45]">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValid || !acceptReglement || isLoading}
                    className="w-full bg-[#B7860B] hover:bg-[#0F2A45] text-white py-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
