import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { formatPrice, formatDateTime } from "@/lib/utils/format";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { getAdminOrderById } from "@/lib/data/admin.service";
import {
  orderStatusBadgeClass,
  orderStatusLabel,
} from "@/lib/orders/order-status-display";
import { studentSexLabel } from "@/lib/orders/billing-snapshot";
import { HOURLY_SLOTS_PRICING } from "@/lib/scheduling-mode";
import { MarkOrderPaidButton } from "@/app/admin/paiements/MarkOrderPaidButton";
import { DeleteOrderButton } from "@/app/admin/paiements/DeleteOrderButton";
import type { WeeklySubscriptionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function durationLabel(minutes: number): string {
  const row = HOURLY_SLOTS_PRICING.find((r) => r.minutes === minutes);
  return row?.durationLabel ?? `${minutes} min`;
}

function schedulingModeLabel(mode: string): string {
  switch (mode) {
    case "HOURLY_PURCHASE":
      return "Cours à la carte";
    case "FLEXIBLE_FORMATION":
      return "Forfait flexible";
    case "FIXED_SLOTS":
      return "Créneaux fixes";
    default:
      return mode;
  }
}

function weeklyStatusLabel(s: WeeklySubscriptionStatus): string {
  switch (s) {
    case "ACTIVE":
      return "Actif";
    case "PAUSED":
      return "En pause";
    case "CANCELED":
      return "Arrêté";
    case "PAST_DUE":
      return "Paiement en retard";
    default:
      return s;
  }
}

function displayValue(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "—";
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-primary font-medium break-words">{children}</dd>
    </div>
  );
}

export default async function AdminPaiementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isDatabaseConfigured()) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
          Configurez DATABASE_URL pour afficher le détail du paiement.
        </p>
      </div>
    );
  }

  const order = await getAdminOrderById(id);
  if (!order) notFound();

  const billingName = order.billing
    ? `${order.billing.prenom} ${order.billing.nom}`.trim()
    : "";
  const formationSummary = order.lines.map((l) => l.formationTitre).join(", ");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/paiements"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-3 -ml-2 text-primary"
          )}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Paiements
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {billingName || "Commande"}
            </h1>
            <p className="text-gray-500 mt-1 font-mono text-xs break-all">
              {order.id}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Badge className={orderStatusBadgeClass(order.statut)}>
              {orderStatusLabel(order.statut)}
            </Badge>
            {order.statut === "PENDING" ? (
              <MarkOrderPaidButton
                orderId={order.id}
                montantEuros={order.totalEuros}
                formationSummary={formationSummary}
              />
            ) : null}
            <DeleteOrderButton
              orderId={order.id}
              label={`${billingName || "commande"} · ${formatPrice(order.totalEuros)}`}
              redirectToList
              withLabel
            />
          </div>
        </div>
      </div>

      <Card className="bg-white mb-6">
        <CardHeader className="border-b">
          <CardTitle className="font-serif text-lg text-primary">
            Informations renseignées par l’élève
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {order.billing ? (
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Prénom">
                {displayValue(order.billing.prenom)}
              </DetailField>
              <DetailField label="Nom">
                {displayValue(order.billing.nom)}
              </DetailField>
              <DetailField label="E-mail">
                {order.billing.email ? (
                  <a
                    href={`mailto:${order.billing.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-secondary hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {order.billing.email}
                  </a>
                ) : (
                  "—"
                )}
              </DetailField>
              <DetailField label="Téléphone">
                {order.billing.telephone ? (
                  <a
                    href={`tel:${order.billing.telephone}`}
                    className="inline-flex items-center gap-1.5 hover:text-secondary hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {order.billing.telephone}
                  </a>
                ) : (
                  "—"
                )}
              </DetailField>
              <DetailField label="Pays">
                {displayValue(order.billing.pays)}
              </DetailField>
              <DetailField label="Sexe">
                {studentSexLabel(order.billing.sexe)}
              </DetailField>
            </dl>
          ) : (
            <p className="text-sm text-gray-500">
              Aucune information de facturation enregistrée pour cette commande.
            </p>
          )}
        </CardContent>
      </Card>

      {order.linkedUser ? (
        <Card className="bg-white mb-6">
          <CardHeader className="border-b">
            <CardTitle className="font-serif text-lg text-primary">
              Compte lié
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">
              {order.linkedUser.prenom} {order.linkedUser.nom} —{" "}
              {order.linkedUser.email}
            </p>
            <Link
              href={`/admin/utilisateurs/${order.linkedUser.id}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3 inline-flex gap-2"
              )}
            >
              <UserCircle className="h-4 w-4" />
              Voir la fiche élève
            </Link>
          </CardContent>
        </Card>
      ) : (
        <p className="mb-6 text-sm text-gray-500">
          Aucun compte utilisateur rattaché (commande invitée non encore payée,
          ou compte non créé).
        </p>
      )}

      <Card className="bg-white mb-6">
        <CardHeader className="border-b">
          <CardTitle className="font-serif text-lg text-primary">
            Formations et créneaux
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {order.lines.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune ligne de commande.</p>
          ) : (
            <ul className="space-y-4">
              {order.lines.map((line) => (
                <li
                  key={line.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-primary">
                      {line.formationTitre}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {schedulingModeLabel(line.schedulingMode)}
                      {line.schedulingMode === "HOURLY_PURCHASE" &&
                      line.hourlyMinutes != null
                        ? ` — ${
                            line.hourlyQuantity > 1
                              ? `${line.hourlyQuantity} × ${durationLabel(line.hourlyMinutes)}`
                              : durationLabel(line.hourlyMinutes)
                          }`
                        : null}
                    </p>
                    {line.creneauLabel ? (
                      <p className="text-xs text-gray-500 mt-1">
                        {line.creneauLabel}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-semibold text-primary sm:text-right shrink-0">
                    {formatPrice(line.lineTotalEuros)}
                    {line.schedulingMode === "HOURLY_PURCHASE" ? (
                      <span className="font-normal text-gray-500"> / mois</span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white mb-6">
        <CardHeader className="border-b">
          <CardTitle className="font-serif text-lg text-primary">
            Paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            <DetailField label="Canal">{order.paymentChannelLabel}</DetailField>
            <DetailField label="Statut">
              {orderStatusLabel(order.statut)}
            </DetailField>
            {order.discountEuros > 0 ? (
              <>
                <DetailField label="Sous-total">
                  {formatPrice(order.subtotalEuros)}
                </DetailField>
                <DetailField label="Code promo">
                  {order.promoCode ? (
                    <span className="font-mono">{order.promoCode}</span>
                  ) : (
                    "—"
                  )}{" "}
                  <span className="text-accent">
                    (− {formatPrice(order.discountEuros)})
                  </span>
                </DetailField>
              </>
            ) : null}
            <DetailField label="Total">
              {formatPrice(order.totalEuros)}
            </DetailField>
          </dl>
          {order.weeklySubscriptions.length > 0 ? (
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                Abonnements cours à la carte
              </p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {order.weeklySubscriptions.map((s, i) => (
                  <li key={`${s.hourlyMinutes}-${s.status}-${i}`}>
                    {s.bundleQuantity} × {durationLabel(s.hourlyMinutes)} —{" "}
                    {weeklyStatusLabel(s.status)}
                    {s.currentPeriodEnd
                      ? ` (période jusqu’au ${s.currentPeriodEnd.toLocaleDateString("fr-FR")})`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader className="border-b">
          <CardTitle className="font-serif text-lg text-primary">
            Acceptation du règlement
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {order.reglement.signedAt ? (
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              <DetailField label="Accepté le">
                {formatDateTime(order.reglement.signedAt)}
              </DetailField>
              <DetailField label="Version">
                {displayValue(order.reglement.version)}
              </DetailField>
              <DetailField label="Adresse IP">
                {displayValue(order.reglement.ip)}
              </DetailField>
            </dl>
          ) : (
            <p className="text-sm text-gray-500">
              Aucune trace d’acceptation du règlement intérieur sur cette
              commande.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
