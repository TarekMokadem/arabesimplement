import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminOrdersList } from "@/lib/data/admin.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { PaiementsHistoryTable } from "@/app/admin/paiements/PaiementsHistoryTable";

export const dynamic = "force-dynamic";

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
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Cochez les lignes pour retirer les faux paiements ou les tests de
            l’historique. Un paiement PayPal.me reste « en attente » jusqu’à{" "}
            <strong>Marquer payé</strong>.
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
      {paiements.length === 0 ? (
        <p className="p-8 text-center text-gray-500 text-sm bg-white rounded-xl ring-1 ring-foreground/10">
          {db ? "Aucune commande." : "Données non disponibles."}
        </p>
      ) : (
        <PaiementsHistoryTable
          paiements={paiements.map((p) => ({
            id: p.id,
            userLabel: p.userLabel,
            formationLabel: p.formationLabel,
            montant: p.montant,
            statut: p.statut,
            dateLabel: p.date.toLocaleDateString("fr-FR"),
            paymentChannelLabel: p.paymentChannelLabel,
            weeklySubscriptionHint: p.weeklySubscriptionHint,
          }))}
        />
      )}
    </div>
  );
}
