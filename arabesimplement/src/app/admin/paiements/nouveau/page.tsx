import Link from "next/link";
import { AdminRecordedOrderForm } from "../AdminRecordedOrderForm";
import { getManualOrderCatalog } from "@/lib/data/admin-manual-order.catalog";
import { isDatabaseConfigured } from "@/lib/utils/database";

export const dynamic = "force-dynamic";

export default async function NouveauPaiementPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const sp = await searchParams;
  const db = isDatabaseConfigured();
  const catalog = db
    ? await getManualOrderCatalog()
    : { users: [], formations: [] };
  const defaultUserId =
    typeof sp.userId === "string" &&
    catalog.users.some((u) => u.id === sp.userId)
      ? sp.userId
      : undefined;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
        Ajouter un paiement
      </h1>
      <p className="text-gray-500 mb-6 max-w-xl">
        Enregistrez un règlement reçu hors du site (virement, espèces, PayPal.me,
        etc.). S’il est marqué payé, l’élève est inscrit à la formation.
      </p>
      {!db ? (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Configurez DATABASE_URL pour enregistrer un paiement.
        </p>
      ) : catalog.users.length === 0 ? (
        <p className="text-sm text-gray-600">
          Aucun client pour l’instant.{" "}
          <Link
            href="/admin/utilisateurs/nouveau"
            className="text-secondary underline"
          >
            Ajoutez d’abord un client
          </Link>
          .
        </p>
      ) : (
        <AdminRecordedOrderForm
          users={catalog.users}
          formations={catalog.formations}
          defaultUserId={defaultUserId}
        />
      )}
    </div>
  );
}
