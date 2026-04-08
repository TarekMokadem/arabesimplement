import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getOrCreateSiteConfig } from "@/lib/data/site-config";
import { PaypalMeRecipientSwitch } from "@/app/admin/parametres/PaypalMeRecipientSwitch";

export default async function ParametresPage() {
  const siteConfig = await getOrCreateSiteConfig();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          Paramètres
        </h1>
        <p className="text-gray-500 mt-1">Configuration du site</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-serif">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du site</Label>
              <Input defaultValue="ArabeSimplement" />
            </div>
            <div className="space-y-2">
              <Label>Email de contact</Label>
              <Input type="email" defaultValue="arabeen10@gmail.com" />
            </div>
            <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-serif">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email d&apos;envoi</Label>
              <Input defaultValue="noreply@arabesimplement.fr" />
            </div>
            <div className="space-y-2">
              <Label>Email admin</Label>
              <Input defaultValue="arabeen10@gmail.com" />
            </div>
            <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif">Paiement PayPal.me (direct)</CardTitle>
            <p className="text-sm text-muted-foreground font-normal">
              Deux profils disponibles : basculez pour choisir celui vers lequel les
              clients sont envoyés depuis le tunnel de commande (paiements ponctuels
              hors abonnement). Pour un PayPal entièrement automatisé au checkout,
              utilisez plutôt PayPal activé sur votre compte Stripe (Payment Element).
            </p>
          </CardHeader>
          <CardContent>
            <PaypalMeRecipientSwitch
              initialRecipient={siteConfig.paypalMeRecipient}
            />
          </CardContent>
        </Card>

        <Card className="bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif">Règlement intérieur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Version</Label>
              <Input defaultValue="1.0.0" className="max-w-xs" />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea rows={8} defaultValue="Article 1 : Objet..." />
            </div>
            <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Mettre à jour
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
