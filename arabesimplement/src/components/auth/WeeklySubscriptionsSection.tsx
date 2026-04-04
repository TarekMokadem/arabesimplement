"use client";

import { useMemo, useTransition } from "react";
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

export type WeeklyPanelRow = {
  id: string;
  stripeSubscriptionId: string;
  status: "ACTIVE" | "PAUSED" | "CANCELED" | "PAST_DUE";
  hourlyMinutes: number;
  bundleQuantity: number;
  currentPeriodEnd: string | null;
  formation: { titre: string };
};

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
                    onClick={() => run(() => pauseMyWeeklySubscription(subId))}
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
                        run(() =>
                          cancelMyWeeklySubscriptionAtPeriodEnd(subId)
                        )
                      }
                    >
                      Arrêter en fin de période
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={pending}
                      onClick={() =>
                        run(() => cancelMyWeeklySubscriptionNow(subId))
                      }
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
    </Card>
  );
}
