import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPromoCodesForAdmin } from "@/lib/data/promo-codes.service";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { formatPrice } from "@/lib/utils/format";
import { formatDateTime } from "@/lib/utils/format";
import { PromoCodeForm } from "./PromoCodeForm";
import { PromoCodeRowActions } from "./PromoCodeRowActions";

export const dynamic = "force-dynamic";

export default async function CodesPromoPage() {
  const db = isDatabaseConfigured();
  const codes = db ? await getPromoCodesForAdmin() : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
          Codes promo
        </h1>
        <p className="text-gray-500 mt-1">
          Réduction en euros appliquée au paiement (carte Stripe ou PayPal.me).
        </p>
      </div>
      {!db && (
        <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          Configurez DATABASE_URL pour gérer les codes promo.
        </p>
      )}
      {db && <PromoCodeForm />}
      {codes.length === 0 ? (
        <p className="text-gray-500 text-sm">
          {db ? "Aucun code promo pour le moment." : "—"}
        </p>
      ) : (
        <Card className="bg-white">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Réduction</th>
                  <th className="px-4 py-3 font-medium">Utilisations</th>
                  <th className="px-4 py-3 font-medium">Expiration</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => {
                  const expired =
                    c.expiresAt != null && c.expiresAt.getTime() < Date.now();
                  return (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-mono tracking-wide text-primary">
                        {c.code}
                      </td>
                      <td className="px-4 py-3">{formatPrice(c.amountOffEuros)}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {c.redemptionCount}
                        {c.maxRedemptions != null ? ` / ${c.maxRedemptions}` : ""}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {c.expiresAt ? formatDateTime(c.expiresAt) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {expired ? (
                          <Badge variant="secondary">Expiré</Badge>
                        ) : c.active ? (
                          <Badge className="bg-accent/10 text-accent">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <PromoCodeRowActions id={c.id} active={c.active} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
