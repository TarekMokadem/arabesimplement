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
  pauseMyWeeklySubscription,
  resumeMyWeeklySubscription,
  cancelMyWeeklySubscriptionAtPeriodEnd,
  cancelMyWeeklySubscriptionNow,
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

export type WeeklyPanelRow = {
  id: string;
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
}: {
  rows: WeeklyPanelRow[];
  learnerSexe: StudentSex | null;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    subId: string;
    action: WeeklySubConfirmAction;
  } | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, WeeklyPanelRow[]>();
    for (const r of rows) {
      const list = m.get(r.stripeSubscriptionId) ?? [];
      list.push(r);
      m.set(r.stripeSubscriptionId, list);
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

  const openConfirm = (subId: string, action: WeeklySubConfirmAction) => {
    setConfirmTarget({ subId, action });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  };

  const executeConfirm = () => {
    if (!confirmTarget) return;
    const { subId, action } = confirmTarget;
    closeConfirm();
    if (action === "pause") {
      run(() => pauseMyWeeklySubscription(subId));
      return;
    }
    if (action === "cancel_at_period_end") {
      run(() => cancelMyWeeklySubscriptionAtPeriodEnd(subId));
      return;
    }
    run(() => cancelMyWeeklySubscriptionNow(subId));
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
            "Résiliation immédiate : l’abonnement s’arrête sans attendre la fin de la semaine en cours. Le dernier prélèvement déjà encaissé n’est pas remboursé. À utiliser seulement si vous êtes sûr·e — en cas de doute, préférez « Arrêter en fin de période ».",
        };
      default:
        return { title: "", body: "" };
    }
  };

  const cc = confirmCopy(confirmTarget?.action ?? null);

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="font-serif">
          Cours à la carte — prélèvement chaque semaine
        </CardTitle>
        <CardDescription>
          Gérez vous-même vos abonnements : pause des prélèvements, reprise ou
          arrêt en fin de période / immédiat. Les changements passent par notre
          prestataire de paiement (Stripe).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {groups.map(([subId, lines]) => {
          const st = lines[0]?.status ?? "ACTIVE";
          return (
            <div key={subId} className="border rounded-lg p-4 space-y-3">
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
                {lines[0]?.currentPeriodEnd ? (
                  <span className="text-sm text-gray-600">
                    Période en cours jusqu’au{" "}
                    {new Date(lines[0].currentPeriodEnd).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                ) : null}
              </div>
              <ul className="text-sm space-y-2 text-primary">
                {lines.map((l) => {
                  const waUrl = learnerFormationWhatsAppUrl(
                    learnerSexe,
                    l.formation.titre
                  );
                  const waLabel = learnerWhatsAppCoachLabel(learnerSexe);
                  return (
                    <li key={l.id} className="space-y-1">
                      <div>
                        {l.formation.titre} —{" "}
                        {l.bundleQuantity > 1
                          ? `${l.bundleQuantity} × ${l.hourlyMinutes} min`
                          : `${l.hourlyMinutes} min`}{" "}
                        / semaine
                      </div>
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
                          Indiquez votre sexe (prochain achat) pour le lien
                          WhatsApp adapté, ou{" "}
                          <Link
                            href="/contactez-nous"
                            className="underline text-secondary"
                          >
                            contactez-nous
                          </Link>
                          .
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap gap-2">
                {st === "ACTIVE" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary"
                    disabled={pending}
                    onClick={() => openConfirm(subId, "pause")}
                  >
                    Mettre en pause
                  </Button>
                ) : null}
                {st === "PAUSED" ? (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                    disabled={pending}
                    onClick={() => run(() => resumeMyWeeklySubscription(subId))}
                  >
                    Reprendre
                  </Button>
                ) : null}
                {st !== "CANCELED" ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={pending}
                      onClick={() =>
                        openConfirm(subId, "cancel_at_period_end")
                      }
                    >
                      Arrêter en fin de période
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={pending}
                      onClick={() => openConfirm(subId, "cancel_now")}
                    >
                      Arrêter maintenant
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </CardContent>

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
    </Card>
  );
}
