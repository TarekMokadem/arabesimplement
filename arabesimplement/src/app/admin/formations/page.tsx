import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formations = [
  { id: "1", titre: "Lire l'arabe en 10 leçons", prix: 8, prixPromo: null, statut: "ACTIVE", inscrits: 45, imageUrl: "https://images.unsplash.com/photo-1622228862102-d691d3e2a334?w=200&q=80" },
  { id: "2", titre: "Sessions Invocations", prix: 25, prixPromo: null, statut: "ACTIVE", inscrits: 22, imageUrl: "https://images.unsplash.com/photo-1756808862471-46ad2f6c6fc0?w=200&q=80" },
  { id: "3", titre: "Formation Tajwid", prix: 75, prixPromo: 49, statut: "ACTIVE", inscrits: 18, imageUrl: "https://images.unsplash.com/photo-1769428197773-e4adbe22aa8e?w=200&q=80" },
];

export default function FormationsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F2A45]">Formations</h1>
          <p className="text-gray-500 mt-1">Gérez vos formations</p>
        </div>
        <Button className="bg-[#B7860B] hover:bg-[#0F2A45] text-white">
          <Plus className="h-4 w-4 mr-2" />Nouvelle formation
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formations.map((f) => (
          <Card key={f.id} className="bg-white overflow-hidden">
            <div className="relative h-40">
              <Image src={f.imageUrl} alt={f.titre} fill className="object-cover" />
              <Badge className="absolute top-3 right-3 bg-[#1A7A4A]/10 text-[#1A7A4A]">Active</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-serif font-bold text-[#0F2A45] mb-2">{f.titre}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#0F2A45]">{f.prixPromo || f.prix}€</span>
                <span className="text-sm text-gray-500">{f.inscrits} inscrits</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Edit className="h-4 w-4 mr-2" />Modifier</Button>
                <Button variant="outline" size="sm"><Calendar className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
