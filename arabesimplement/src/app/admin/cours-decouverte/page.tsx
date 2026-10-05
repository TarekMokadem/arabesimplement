import { getDiscoveryLeadsForAdmin } from "@/lib/data/discovery-leads.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { DiscoveryLeadsTable } from "@/app/admin/cours-decouverte/DiscoveryLeadsTable";

export const dynamic = "force-dynamic";

export default async function CoursDecouvertePage() {
  const db = isDatabaseConfigured();
  const leads = db ? await getDiscoveryLeadsForAdmin() : [];
  const aTraiter = leads.filter((l) => !l.traite).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          Cours découverte
        </h1>
        <p className="text-gray-500 mt-1">
          Toutes les demandes du formulaire (coordonnées, pays, niveau, créneau
          Calendly).
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {leads.length} demande{leads.length > 1 ? "s" : ""}
          {aTraiter > 0
            ? ` · ${aTraiter} à traiter`
            : leads.length > 0
              ? " · tout est traité"
              : ""}
        </p>
      </div>
      {!db && (
        <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Configurez DATABASE_URL pour enregistrer les cours découverte.
        </p>
      )}
      {leads.length === 0 ? (
        <p className="p-8 text-center text-gray-500 text-sm bg-white rounded-xl ring-1 ring-foreground/10">
          {db
            ? "Aucune demande pour le moment. Elles apparaissent ici dès qu’un élève remplit le formulaire."
            : "Données non disponibles."}
        </p>
      ) : (
        <DiscoveryLeadsTable
          leads={leads.map((l) => ({
            id: l.id,
            fullName: l.fullName,
            email: l.email,
            whatsapp: l.whatsapp,
            pays: l.pays,
            niveauLabel: l.niveauLabel,
            hasCalendly: Boolean(l.calendlyEventUri),
            traite: l.traite,
            dateLabel: l.createdAt.toLocaleString("fr-FR"),
          }))}
        />
      )}
    </div>
  );
}
