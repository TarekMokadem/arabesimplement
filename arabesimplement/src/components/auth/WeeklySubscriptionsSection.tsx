"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { StudentSex } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  pauseMyWeeklySubscriptionsBatch,
  resumeMyWeeklySubscriptionsBatch,
  cancelMyWeeklySubscriptionsAtPeriodEndBatch,
  cancelMyWeeklySubscriptionsNowBatch,
} from "@/app/(auth)/actions/subscription.actions";
import type { SubscriptionActionResult } from "@/app/(auth)/actions/subscription.actions";
import {
  learnerFormationWhatsAppUrl,
  learnerWhatsAppCoachLabel,
} from "@/lib/contact/learner-whatsapp";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminCourseWeeklyLineForm } from "@/app/admin/utilisateurs/AdminCourseWeeklyLineForm";

export type WeeklyPanelRow = {
  id: string;
  formationId: string;
  stripeSubscriptionId: string;
  status: "ACTIVE" | "PAUSED" | "CANCELED" | "PAST_DUE";
  hourlyMinutes: number;
  bundleQuantity: number;
  currentPeriodEnd: string | null;
  formation: { titre: string };
};

type WeeklySubConfirmAction =
  | "pause"
  | "cancel_at_period_end"
  | "cancel_now";

function weeklyLinesTotalMinutes(lines: WeeklyPanelRow[]): number {
  return lines.reduce((s, l) => s + l.bundleQuantity * l.hourlyMinutes, 0);
}

function weeklyLinesDetailLabel(lines: WeeklyPanelRow[]): string {
  return lines
    .map((l) =>
      l.bundleQuantity > 1
        ? `${l.bundleQuantity} × ${l.hourlyMinutes} min`
        : `${l.hourlyMinutes} min`
    )
    .join(" + ");
}

function mergedWeeklyStatus(
  lines: WeeklyPanelRow[]
): WeeklyPanelRow["status"] {
  if (lines.some((l) => l.status === "PAST_DUE")) return "PAST_DUE";
  if (lines.some((l) => l.status === "ACTIVE")) return "ACTIVE";
  if (lines.some((l) => l.status === "PAUSED")) return "PAUSED";
  return "CANCELED";
}

function stripeIdsWithRowStatus(
  lines: WeeklyPanelRow[],
  status: WeeklyPanelRow["status"]
): string[] {
  const ids = new Set<string>();
  for (const l of lines) {
    if (l.status === status) ids.add(l.stripeSubscriptionId);
  }
  return [...ids];
}

function activeStripeIds(lines: WeeklyPanelRow[]): string[] {
  return stripeIdsWithRowStatus(lines, "ACTIVE");
}

function pausedStripeIds(lines: WeeklyPanelRow[]): string[] {
  return stripeIdsWithRowStatus(lines, "PAUSED");
}

function cancellableStripeIds(lines: WeeklyPanelRow[]): string[] {
  const ids = new Set<string>();
  for (const l of lines) {
    if (l.status !== "CANCELED") ids.add(l.stripeSubscriptionId);
  }
  return [...ids];
}

function maxPeriodEndIso(lines: WeeklyPanelRow[]): string | null {
  const times = lines
    .map((l) => l.currentPeriodEnd)
    .filter((d): d is string => d != null)
    .map((d) => new Date(d).getTime());
  if (times.length === 0) return null;
  return new Date(Math.max(...times)).toISOString();
}

function statusLabel(s: WeeklyPanelRow["status"]): string {
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

export function WeeklySubscriptionsSection({
  rows,
  learnerSexe,
  readOnly = false,
  adminMode = false,
  showAdminLineEditors = false,
}: {
  rows: WeeklyPanelRow[];
  learnerSexe: StudentSex | null;
  /** Élève : affichage informatif uniquement (pas de pause / résiliation). */
  readOnly?: boolean;
  /** Admin : affiche les actions Stripe (pause, etc.). */
  adminMode?: boolean;
  /** Admin uniquement : formulaires quantité / durée par ligne (composant client, pas de fonction passée depuis le serveur). */
  showAdminLineEditors?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    stripeSubscriptionIds: string[];
    action: WeeklySubConfirmAction;
  } | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, WeeklyPanelRow[]>();
    for (const r of rows) {
      const list = m.get(r.formationId) ?? [];
      list.push(r);
      m.set(r.formationId, list);
    }
    return [...m.entries()];
  }, [rows]);

  if (groups.length === 0) return null;

  const run = (fn: () => Promise<SubscriptionActionResult>) => {
    startTransition(() => {
      void fn().then((r) => {
        if (r.success) {
          toast.success("Enregistré.");
          window.location.reload();
        } else {
          toast.error(r.error);
        }
      });
    });
  };

  const openConfirm = (
    stripeSubscriptionIds: string[],
    action: WeeklySubConfirmAction
  ) => {
    if (stripeSubscriptionIds.length === 0) return;
    setConfirmTarget({ stripeSubscriptionIds, action });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  };

  const executeConfirm = () => {
    if (!confirmTarget) return;
    const { stripeSubscriptionIds, action } = confirmTarget;
    closeConfirm();
    if (action === "pause") {
      run(() => pauseMyWeeklySubscriptionsBatch(stripeSubscriptionIds));
      return;
    }
    if (action === "cancel_at_period_end") {
      run(() =>
        cancelMyWeeklySubscriptionsAtPeriodEndBatch(stripeSubscriptionIds)
      );
      return;
    }
    run(() => cancelMyWeeklySubscriptionsNowBatch(stripeSubscriptionIds));
  };

  const confirmCopy = (action: WeeklySubConfirmAction | null) => {
    switch (action) {
      case "pause":
        return {
          title: "Mettre en pause cet abonnement ?",
          body:
            "Aucun nouveau prélèvement n’aura lieu tant que l’abonnement reste en pause. Vous gardez l’accès aux indications déjà communiquées ; pour la suite du cours, reprenez l’abonnement ici quand vous êtes prêt·e. La pause limite les clics accidentels mais engage votre suivi : ne l’utilisez que si c’est voulu.",
        };
      case "cancel_at_period_end":
        return {
          title: "Arrêter à la fin de la période en cours ?",
          body:
            "L’abonnement reste actif jusqu’à la date de fin de période affichée, puis s’arrête sans nouveau prélèvement. Les sommes déjà prélevées ne sont pas remboursées. Vous pourrez souscrire à nouveau depuis la boutique plus tard.",
        };
      case "cancel_now":
        return {
          title: "Arrêter l’abonnement tout de suite ?",
          body:
            "Résiliation immédiate : l’abonnement s’arrête sans attendre la fin de la période de facturation en cours. Le dernier prélèvement déjà encaissé n’est pas remboursé. À utiliser seulement si vous êtes sûr·e — en cas de doute, préférez « Arrêter en fin de période ».",
        };
      default:
        return { title: "", body: "" };
    }
  };

  const cc = confirmCopy(confirmTarget?.action ?? null);

  const showActions = !readOnly && adminMode;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="font-serif">
          Cours à la carte — prélèvement mensuel
        </CardTitle>
        <CardDescription>
          {readOnly ? (
            <>
              Vos abonnements sont visibles ci-dessous. La gestion (pause, arrêt,
              volume) est assurée par l’équipe : écrivez-nous via WhatsApp ou la
              page contact si vous souhaitez un changement.
            </>
          ) : (
            <>
              Pause des prélèvements, reprise ou arrêt en fin de période /
              immédiat. Les changements passent par notre prestataire de
              paiement (Stripe).
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {groups.map(([formationId, lines]) => {
          const st = mergedWeeklyStatus(lines);
          const titre = lines[0]?.formation.titre ?? "";
          const totalMin = weeklyLinesTotalMinutes(lines);
          const detail = weeklyLinesDetailLabel(lines);
          const periodEnd = maxPeriodEndIso(lines);
          const waUrl = learnerFormationWhatsAppUrl(learnerSexe, titre);
          const waLabel = learnerWhatsAppCoachLabel(learnerSexe);
          const toPause = activeStripeIds(lines);
          const toResume = pausedStripeIds(lines);
          const toCancel = cancellableStripeIds(lines);

          return (
            <div key={formationId} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <Badge
                  variant="outline"
                  className={
                    st === "ACTIVE"
                      ? "border-secondary text-secondary"
                      : undefined
                  }
                >
                  {statusLabel(st)}
                </Badge>
                {periodEnd ? (
                  <span className="text-sm text-gray-600">
                    Période en cours jusqu’au{" "}
                    {new Date(periodEnd).toLocaleDateString("fr-FR")}
                  </span>
                ) : null}
              </div>
              <div className="text-sm space-y-2 text-primary">
                <p className="font-medium">
                  {titre} — {totalMin} min / semaine (volume créneau)
                </p>
                {detail !== `${totalMin} min` ? (
                  <p className="text-gray-600 text-xs">{detail}</p>
                ) : null}
                {showAdminLineEditors
                  ? lines.map((line) => (
                      <div key={line.id} className="space-y-2">
                        <AdminCourseWeeklyLineForm
                          courseWeeklySubscriptionId={line.id}
                          initialBundleQuantity={line.bundleQuantity}
                          initialHourlyMinutes={line.hourlyMinutes}
                        />
                      </div>
                    ))
                  : null}
                {waUrl ? (
                  <Link
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({
                        size: "sm",
                        variant: "outline",
                      }),
                      "border-emerald-600 text-emerald-700 hover:bg-emerald-50 inline-flex items-center gap-1.5 w-fit"
                    )}
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                    WhatsApp — {waLabel}
                  </Link>
                ) : learnerSexe ? (
                  <span className="text-xs text-amber-800">
                    WhatsApp : configuration à compléter ou{" "}
                    <Link href="/contactez-nous" className="underline">
                      contact
                    </Link>
                    .
                  </span>
                ) : (
                  <span className="text-xs text-gray-600">
                    Indiquez votre sexe (prochain achat) pour le lien WhatsApp
                    adapté, ou{" "}
                    <Link
                      href="/contactez-nous"
                      className="underline text-secondary"
                    >
                      contactez-nous
                    </Link>
                    .
                  </span>
                )}
              </div>
              {showActions ? (
                <div className="flex flex-wrap gap-2">
                  {toPause.length > 0 ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary"
                      disabled={pending}
                      onClick={() => openConfirm(toPause, "pause")}
                    >
                      Mettre en pause
                    </Button>
                  ) : null}
                  {toResume.length > 0 ? (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                      disabled={pending}
                      onClick={() =>
                        run(() => resumeMyWeeklySubscriptionsBatch(toResume))
                      }
                    >
                      Reprendre
                    </Button>
                  ) : null}
                  {toCancel.length > 0 ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          openConfirm(toCancel, "cancel_at_period_end")
                        }
                      >
                        Arrêter en fin de période
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={pending}
                        onClick={() => openConfirm(toCancel, "cancel_now")}
                      >
                        Arrêter maintenant
                      </Button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </CardContent>

      {showActions ? (
      <Dialog open={confirmOpen} onOpenChange={(o) => !o && closeConfirm()}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{cc.title}</DialogTitle>
            <DialogDescription className="text-left text-gray-700">
              {cc.body}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={closeConfirm}
              disabled={pending}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant={
                confirmTarget?.action === "cancel_now"
                  ? "destructive"
                  : "default"
              }
              className={
                confirmTarget?.action === "cancel_now"
                  ? undefined
                  : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              }
              disabled={pending}
              onClick={executeConfirm}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      ) : null}
    </Card>
  );
}
