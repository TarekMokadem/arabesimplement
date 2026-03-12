import { Star, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const temoignages = [
  { id: "1", nom: "Fatima B.", texte: "Alhamdulillah, j'ai appris à lire l'arabe en quelques semaines !", note: 5, approuve: true },
  { id: "2", nom: "Youssef M.", texte: "Je recommande vivement cette formation !", note: 5, approuve: true },
  { id: "3", nom: "Nadia K.", texte: "Formation très complète. Barakallahu fik !", note: 5, approuve: false },
  { id: "4", nom: "Ibrahim T.", texte: "Excellent rapport qualité-prix.", note: 4, approuve: false },
];

export default function TemoignagesPage() {
  const pending = temoignages.filter(t => !t.approuve).length;
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#0F2A45]">Témoignages</h1>
        <p className="text-gray-500 mt-1">{pending} en attente</p>
      </div>
      <div className="flex gap-2 mb-6">
        <Button variant="default" size="sm" className="bg-[#0F2A45]">Tous</Button>
        <Button variant="outline" size="sm">En attente ({pending})</Button>
        <Button variant="outline" size="sm">Approuvés</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {temoignages.map((t) => (
          <Card key={t.id} className={`bg-white ${!t.approuve ? "border-l-4 border-l-[#B7860B]" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2A45]/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-[#0F2A45]">{t.nom[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#0F2A45]">{t.nom}</p>
                    <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= t.note ? "fill-[#B7860B] text-[#B7860B]" : "text-gray-300"}`} />)}</div>
                  </div>
                </div>
                <Badge className={t.approuve ? "bg-[#1A7A4A]/10 text-[#1A7A4A]" : "bg-[#B7860B]/10 text-[#B7860B]"}>
                  {t.approuve ? "Approuvé" : "En attente"}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">&ldquo;{t.texte}&rdquo;</p>
              {!t.approuve && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" className="bg-[#1A7A4A] text-white"><Check className="h-4 w-4 mr-1" />Approuver</Button>
                  <Button size="sm" variant="outline" className="text-red-600"><X className="h-4 w-4 mr-1" />Refuser</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
