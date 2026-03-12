import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const paiements = [
  { id: "ORD-001", user: "Ahmed B.", formation: "Lire en 10 leçons", montant: 8, statut: "PAID", date: "2026-01-12" },
  { id: "ORD-002", user: "Fatima K.", formation: "Tajwid", montant: 49, statut: "PAID", date: "2026-01-11" },
  { id: "ORD-003", user: "Omar S.", formation: "Invocations", montant: 25, statut: "PAID", date: "2026-01-11" },
  { id: "ORD-004", user: "Khadija L.", formation: "Lire en 10 leçons", montant: 8, statut: "REFUNDED", date: "2026-01-10" },
];

export default function PaiementsPage() {
  const total = paiements.filter(p => p.statut === "PAID").reduce((sum, p) => sum + p.montant, 0);
  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#0F2A45]">Paiements</h1>
          <p className="text-gray-500 mt-1">Total : <span className="font-bold text-[#1A7A4A]">{total}€</span></p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exporter CSV</Button>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Rechercher..." className="pl-10 max-w-md" />
      </div>
      <Card className="bg-white">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">N° Commande</th>
                <th className="text-left p-4 font-medium text-gray-600">Client</th>
                <th className="text-left p-4 font-medium text-gray-600">Formation</th>
                <th className="text-left p-4 font-medium text-gray-600">Montant</th>
                <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">{p.id}</td>
                  <td className="p-4 text-[#0F2A45]">{p.user}</td>
                  <td className="p-4 text-gray-600">{p.formation}</td>
                  <td className="p-4 font-bold">{p.montant}€</td>
                  <td className="p-4">
                    <Badge className={p.statut === "PAID" ? "bg-[#1A7A4A]/10 text-[#1A7A4A]" : "bg-gray-100 text-gray-600"}>
                      {p.statut === "PAID" ? "Payé" : "Remboursé"}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
