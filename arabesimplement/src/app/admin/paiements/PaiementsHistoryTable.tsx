"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  orderStatusBadgeClass,
  orderStatusLabel,
} from "@/lib/orders/order-status-display";
import { MarkOrderPaidButton } from "@/app/admin/paiements/MarkOrderPaidButton";
import { DeleteOrderButton } from "@/app/admin/paiements/DeleteOrderButton";
import { deleteOrdersAsAdmin } from "@/app/admin/paiements/delete-order-actions";

export type PaiementHistoryRow = {
  id: string;
  userLabel: string;
  formationLabel: string;
  montant: number;
  statut: OrderStatus;
  dateLabel: string;
  paymentChannelLabel: string;
  weeklySubscriptionHint: string | null;
};

const FILTERS: { id: "ALL" | OrderStatus; label: string }[] = [
  { id: "ALL", label: "Tous" },
  { id: "PAID", label: "Payés" },
  { id: "PENDING", label: "En attente" },
  { id: "FAILED", label: "Échoués" },
  { id: "REFUNDED", label: "Remboursés" },
];

export function PaiementsHistoryTable({
  paiements,
}: {
  paiements: PaiementHistoryRow[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("ALL");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? paiements
        : paiements.filter((p) => p.statut === filter),
    [filter, paiements]
  );

  const visibleIds = visible.map((p) => p.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of visibleIds) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };

  const selectedVisibleCount = visibleIds.filter((id) => selected.has(id)).length;

  const deleteSelected = () => {
    const ids = visibleIds.filter((id) => selected.has(id));
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `Retirer ${ids.length} ligne(s) de l’historique ? Les faux paiements / tests disparaîtront de la liste. Un paiement déjà encaissé n’est pas remboursé.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      const r = await deleteOrdersAsAdmin(ids);
      if (r.success) {
        const extra =
          r.failed > 0 ? ` (${r.failed} non supprimée${r.failed > 1 ? "s" : ""})` : "";
        toast.success(
          `${r.deleted} ligne${r.deleted > 1 ? "s" : ""} retirée${r.deleted > 1 ? "s" : ""} de l’historique.${extra}`
        );
        setSelected(new Set());
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              type="button"
              size="sm"
              variant={filter === f.id ? "secondary" : "outline"}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">
                {f.id === "ALL"
                  ? paiements.length
                  : paiements.filter((p) => p.statut === f.id).length}
              </span>
            </Button>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
          disabled={pending || selectedVisibleCount === 0}
          onClick={deleteSelected}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          {pending
            ? "Suppression…"
            : `Supprimer la sélection${selectedVisibleCount ? ` (${selectedVisibleCount})` : ""}`}
        </Button>
      </div>

      <Card className="bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 w-10">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={(v) => toggleAllVisible(v === true)}
                    aria-label="Sélectionner toutes les lignes visibles"
                    disabled={visible.length === 0}
                  />
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  N° Commande
                </th>
                <th className="text-left p-4 font-medium text-gray-600">Client</th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Formation
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Montant
                </th>
                <th className="text-left p-4 font-medium text-gray-600">Canal</th>
                <th className="text-left p-4 font-medium text-gray-600 min-w-[140px]">
                  Abonnement
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Statut
                </th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500 text-sm">
                    Aucune commande dans ce filtre.
                  </td>
                </tr>
              ) : (
                visible.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <Checkbox
                        checked={selected.has(p.id)}
                        onCheckedChange={(v) => toggleOne(p.id, v === true)}
                        aria-label={`Sélectionner ${p.userLabel}`}
                      />
                    </td>
                    <td className="p-4 font-mono text-xs max-w-[120px] truncate">
                      <Link
                        href={`/admin/paiements/${p.id}`}
                        className="text-primary hover:text-secondary hover:underline"
                        title={p.id}
                      >
                        {p.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/paiements/${p.id}`}
                        className="text-primary hover:text-secondary hover:underline"
                      >
                        {p.userLabel}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-600">{p.formationLabel}</td>
                    <td className="p-4 font-bold">{p.montant.toFixed(2)} €</td>
                    <td className="p-4 text-gray-700 text-sm whitespace-nowrap">
                      {p.paymentChannelLabel}
                    </td>
                    <td className="p-4 text-gray-600 text-xs max-w-[200px]">
                      {p.weeklySubscriptionHint ?? (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className={orderStatusBadgeClass(p.statut)}>
                        {orderStatusLabel(p.statut)}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {p.dateLabel}
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-1 flex-wrap">
                        <Link
                          href={`/admin/paiements/${p.id}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-sm" })
                          )}
                          aria-label={`Détail de la commande ${p.id.slice(0, 8)}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {p.statut === "PENDING" ? (
                          <MarkOrderPaidButton
                            orderId={p.id}
                            montantEuros={p.montant}
                            formationSummary={p.formationLabel}
                          />
                        ) : null}
                        <DeleteOrderButton
                          orderId={p.id}
                          label={`${p.userLabel} · ${p.montant.toFixed(2)} €`}
                          withLabel
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
