import Link from "next/link";
import { Receipt, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import type { OrderConfirmationView } from "@/lib/data/order-confirmation.service";
import { HOURLY_SLOTS_PRICING } from "@/lib/scheduling-mode";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

function durationLabel(minutes: number): string {
  const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === minutes);
  return row?.durationLabel ?? `${minutes} min`;
}

type Props = {
  view: OrderConfirmationView;
  subscriptionsManageHref: string;
};

export function OrderConfirmationRecap({
  view,
  subscriptionsManageHref,
}: Props) {
  const pending = view.statut === "PENDING";

  return (
    <div className="bg-surface rounded-xl p-6 text-left mb-8 border border-gray-100">
      <div className="flex items-start gap-3 mb-4">
        <Receipt className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
        <div>
          <h2 className="font-serif font-bold text-primary text-lg">
            Récapitulatif de votre commande
          </h2>
          <p className="text-sm text-gray-500">
            Commande n° <span className="font-mono text-xs">{view.orderId}</span>
          </p>
        </div>
      </div>

      {pending ? (
        <div className="mb-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <RefreshCw className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Finalisation du paiement en cours</p>
            <p className="text-amber-800/90 mt-1">
              Si le récapitulatif n’indique pas « payé » sous quelques instants,
              rechargez la page. Vous recevrez aussi un courriel de confirmation.
            </p>
            <Link
              href={`/commande/confirmation?orderId=${encodeURIComponent(view.orderId)}&email=${encodeURIComponent(view.billing.email)}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3 inline-flex border-amber-700 text-amber-900"
              )}
            >
              Rafraîchir cette page
            </Link>
          </div>
        </div>
      ) : null}

      <div className="text-sm border-b border-gray-200 pb-4 mb-4">
        <p className="font-medium text-primary">
          {view.billing.prenom} {view.billing.nom}
        </p>
        <p className="text-gray-600">{view.billing.email}</p>
      </div>

      <ul className="space-y-4 mb-6">
        {view.lines.map((line) => (
          <li
            key={line.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 text-sm border-b border-gray-100 pb-3 last:border-0"
          >
            <div className="min-w-0">
              <p className="font-medium text-primary">{line.formationTitre}</p>
              {line.schedulingMode === "HOURLY_PURCHASE" &&
              line.hourlyMinutes != null ? (
                <p className="text-gray-600 mt-1">
                  {line.hourlyQuantity > 1
                    ? `${line.hourlyQuantity} × ${durationLabel(line.hourlyMinutes)}`
                    : durationLabel(line.hourlyMinutes)}
                  {" · "}
                  {formatPrice(line.unitPriceEuros)} / unité et / semaine
                </p>
              ) : (
                <p className="text-gray-600 mt-1">
                  {line.schedulingMode === "FLEXIBLE_FORMATION"
                    ? "Forfait — paiement unique"
                    : line.schedulingMode === "FIXED_SLOTS"
                      ? "Forfait — créneau choisi"
                      : null}
                </p>
              )}
              {line.creneauLabel ? (
                <p className="text-gray-500 text-xs mt-1">
                  Créneau : {line.creneauLabel}
                </p>
              ) : null}
            </div>
            <p className="font-semibold text-primary sm:text-right shrink-0">
              {formatPrice(line.lineTotalEuros)}
              {line.schedulingMode === "HOURLY_PURCHASE" ? (
                <span className="font-normal text-gray-500"> / sem.</span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="font-bold text-primary">Total de la commande</span>
        <span className="text-xl font-bold text-primary">
          {formatPrice(view.totalEuros)}
        </span>
      </div>

      {view.hasWeeklySubscription ? (
        <div className="mt-6 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="font-medium text-primary text-sm mb-1">
            Abonnement hebdomadaire
          </p>
          <p className="text-sm text-gray-700 mb-3">
            Le montant ci-dessus correspond à chaque semaine d’engagement pour
            les lignes « cours à la carte ». Vous pouvez mettre en pause ou
            arrêter cet abonnement quand vous le souhaitez.
          </p>
          <Link
            href={subscriptionsManageHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "inline-flex bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            Gérer mes abonnements
          </Link>
        </div>
      ) : null}
    </div>
  );
}
