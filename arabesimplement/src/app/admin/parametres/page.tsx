import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ParametresPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">Paramètres</h1>
        <p className="text-gray-500 mt-1">Configuration du site</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white">
          <CardHeader><CardTitle className="font-serif">Informations générales</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom du site</Label>
              <Input defaultValue="ArabeSimplement" />
            </div>
            <div className="space-y-2">
              <Label>Email de contact</Label>
              <Input type="email" defaultValue="arabeen10@gmail.com" />
            </div>
            <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"><Save className="h-4 w-4 mr-2" />Enregistrer</Button>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader><CardTitle className="font-serif">Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email d&apos;envoi</Label>
              <Input defaultValue="noreply@arabesimplement.fr" />
            </div>
            <div className="space-y-2">
              <Label>Email admin</Label>
              <Input defaultValue="arabeen10@gmail.com" />
            </div>
            <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"><Save className="h-4 w-4 mr-2" />Enregistrer</Button>
          </CardContent>
        </Card>
        <Card className="bg-white lg:col-span-2">
          <CardHeader><CardTitle className="font-serif">Règlement intérieur</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Version</Label>
              <Input defaultValue="1.0.0" className="max-w-xs" />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea rows={8} defaultValue="Article 1 : Objet..." />
            </div>
            <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"><Save className="h-4 w-4 mr-2" />Mettre à jour</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
