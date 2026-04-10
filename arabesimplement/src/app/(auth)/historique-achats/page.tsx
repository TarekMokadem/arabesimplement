import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LearnerAreaHeader } from "@/components/auth/LearnerAreaHeader";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "../actions";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { formatPrice } from "@/lib/utils/format";
import {
  getLearnerCanceledWeeklySubscriptions,
  getLearnerPurchaseOrders,
  groupWeeklyRowsByFormationId,
} from "@/lib/data/learner-purchase-history.service";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Historique d'achats",
  description:
    "Vos commandes et abonnements hebdomadaires terminés chez ArabeSimplement.",
};

function orderStatutLabel(
  s: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
): string {
  switch (s) {
    case "PAID":
      return "Payée";
    case "REFUNDED":
      return "Remboursée";
    case "FAILED":
      return "Échouée";
    default:
      return s;
  }
}

function weeklyLinesTotalMinutes(
  lines: { bundleQuantity: number; hourlyMinutes: number }[]
): number {
  return lines.reduce((s, l) => s + l.bundleQuantity * l.hourlyMinutes, 0);
}

function weeklyLinesDetailLabel(
  lines: { bundleQuantity: number; hourlyMinutes: number }[]
): string {
  return lines
    .map((l) =>
      l.bundleQuantity > 1
        ? `${l.bundleQuantity} × ${l.hourlyMinutes} min`
        : `${l.hourlyMinutes} min`
    )
    .join(" + ");
}

export default async function HistoriqueAchatsPage() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const user = {
    prenom: session.prenom,
    nom: session.nom,
    email: session.email,
  };

  const [orders, canceledWeeklyRaw] = isDatabaseConfigured()
    ? await Promise.all([
        getLearnerPurchaseOrders(session.id),
        getLearnerCanceledWeeklySubscriptions(session.id),
      ])
    : [[], []];

  const canceledGroups = [
    ...groupWeeklyRowsByFormationId(canceledWeeklyRaw).entries(),
  ];

  return (
    <div className="min-h-screen bg-surface">
      <LearnerAreaHeader prenom={user.prenom} nom={user.nom} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <Link
          href="/tableau-de-bord"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-primary mb-6 -ml-2 inline-flex items-center gap-1"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>

        <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-2">
          Historique d&apos;achats
        </h1>
        <p className="text-gray-600 mb-8">
          Commandes enregistrées sur votre compte ({user.email}) et abonnements
          « cours à la carte » terminés.
        </p>

        <section className="mb-10" aria-labelledby="titre-abos-termines">
          <h2
            id="titre-abos-termines"
            className="font-serif text-lg font-semibold text-primary mb-4"
          >
            Abonnements hebdomadaires terminés
          </h2>
          {canceledGroups.length === 0 ? (
            <Card className="bg-white border-dashed border-2 border-gray-200">
              <CardContent className="py-8 text-sm text-gray-600">
                Aucun abonnement résilié enregistré. Les abonnements que vous
                arrêtez apparaissent ici une fois le statut « arrêté » enregistré
                (immédiat ou après la dernière période payée).
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {canceledGroups.map(([formationId, lines]) => {
                const titre = lines[0]?.formation.titre ?? "";
                const totalMin = weeklyLinesTotalMinutes(lines);
                const detail = weeklyLinesDetailLabel(lines);
                const endedAt = lines.reduce(
                  (latest, row) =>
                    row.updatedAt > latest ? row.updatedAt : latest,
                  lines[0]!.updatedAt
                );
                return (
                  <Card key={formationId} className="bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <CardTitle className="font-serif text-base">
                          {titre}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0">
                          Arrêté
                        </Badge>
                      </div>
                      <CardDescription>
                        {totalMin} min / semaine
                        {detail !== `${totalMin} min` ? ` · ${detail}` : null}
                        {" · "}
                        Mis à jour le{" "}
                        {endedAt.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section aria-labelledby="titre-commandes">
          <h2
            id="titre-commandes"
            className="font-serif text-lg font-semibold text-primary mb-4"
          >
            Commandes
          </h2>
          {orders.length === 0 ? (
            <Card className="bg-white border-dashed border-2 border-gray-200">
              <CardContent className="py-8 text-sm text-gray-600">
                Aucune commande payée ou remboursée pour le moment.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <CardTitle className="font-serif text-base">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </CardTitle>
                      <Badge variant="outline" className="shrink-0">
                        {orderStatutLabel(order.statut)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Total :{" "}
                      <span className="font-semibold text-primary">
                        {formatPrice(Number(order.total))}
                      </span>
                      {order.stripeSubscriptionId ? (
                        <span className="block mt-1 text-xs">
                          Paiement récurrent (cours à la carte)
                        </span>
                      ) : null}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="text-sm text-gray-700 space-y-2 border-t pt-4">
                      {order.orderItems.map((item) => (
                        <li key={item.id}>
                          <span className="font-medium text-primary">
                            {item.formation.titre}
                          </span>
                          {item.creneau ? (
                            <span className="text-gray-600">
                              {" "}
                              — {item.creneau.nom}
                            </span>
                          ) : null}
                          {item.hourlyMinutes != null ? (
                            <span className="text-gray-600 block text-xs mt-0.5">
                              {item.hourlyQuantity > 1
                                ? `${item.hourlyQuantity} × ${item.hourlyMinutes} min / semaine`
                                : `${item.hourlyMinutes} min / semaine`}
                            </span>
                          ) : null}
                          <span className="text-gray-500 block text-xs">
                            {formatPrice(Number(item.prixUnitaire))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
