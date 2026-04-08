import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminOrdersList } from "@/lib/data/admin.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function paiementStatutLabel(s: OrderStatus): string {
  switch (s) {
    case "PAID":
      return "Payé";
    case "PENDING":
      return "En attente";
    case "FAILED":
      return "Échoué";
    case "REFUNDED":
      return "Remboursé";
    default:
      return s;
  }
}

function paiementStatutClass(s: OrderStatus): string {
  switch (s) {
    case "PAID":
      return "bg-accent/10 text-accent";
    case "PENDING":
      return "bg-amber-100 text-amber-900";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default async function PaiementsPage() {
  const db = isDatabaseConfigured();
  const paiements = db ? await getAdminOrdersList() : [];
  const total = paiements
    .filter((p) => p.statut === "PAID")
    .reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Paiements
          </h1>
          <p className="text-gray-500 mt-1">
            Total commandes payées (liste affichée) :{" "}
            <span className="font-bold text-accent">{total.toFixed(2)} €</span>
          </p>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>
      {!db && (
        <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Configurez DATABASE_URL pour afficher les paiements.
        </p>
      )}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Recherche (bientôt)..."
          className="pl-10 max-w-md"
          disabled
        />
      </div>
      <Card className="bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  N° Commande
                </th>
                <th className="text-left p-4 font-medium text-gray-600">Client</th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Formation
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Montant
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Statut
                </th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {paiements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">
                    {db ? "Aucune commande." : "Données non disponibles."}
                  </td>
                </tr>
              ) : (
                paiements.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs max-w-[120px] truncate" title={p.id}>
                      {p.id.slice(0, 8)}…
                    </td>
                    <td className="p-4 text-primary">{p.userLabel}</td>
                    <td className="p-4 text-gray-600">{p.formationLabel}</td>
                    <td className="p-4 font-bold">{p.montant.toFixed(2)} €</td>
                    <td className="p-4">
                      <Badge className={paiementStatutClass(p.statut)}>
                        {paiementStatutLabel(p.statut)}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {p.date.toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
