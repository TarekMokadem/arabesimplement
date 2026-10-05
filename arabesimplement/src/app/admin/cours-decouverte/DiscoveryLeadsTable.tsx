"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { deleteDiscoveryLead } from "@/app/admin/cours-decouverte/actions";

export type DiscoveryLeadHistoryRow = {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  pays: string;
  niveauLabel: string;
  hasCalendly: boolean;
  traite: boolean;
  dateLabel: string;
};

const FILTERS = [
  { id: "ALL", label: "Tous" },
  { id: "TODO", label: "À traiter" },
  { id: "DONE", label: "Traités" },
  { id: "SLOT", label: "Créneau choisi" },
  { id: "NOSLOT", label: "Sans créneau" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function DiscoveryLeadsTable({
  leads,
}: {
  leads: DiscoveryLeadHistoryRow[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>("ALL");
  const [pending, startTransition] = useTransition();

  const visible = useMemo(() => {
    switch (filter) {
      case "TODO":
        return leads.filter((l) => !l.traite);
      case "DONE":
        return leads.filter((l) => l.traite);
      case "SLOT":
        return leads.filter((l) => l.hasCalendly);
      case "NOSLOT":
        return leads.filter((l) => !l.hasCalendly);
      default:
        return leads;
    }
  }, [filter, leads]);

  const countFor = (id: FilterId): number => {
    switch (id) {
      case "TODO":
        return leads.filter((l) => !l.traite).length;
      case "DONE":
        return leads.filter((l) => l.traite).length;
      case "SLOT":
        return leads.filter((l) => l.hasCalendly).length;
      case "NOSLOT":
        return leads.filter((l) => !l.hasCalendly).length;
      default:
        return leads.length;
    }
  };

  const remove = (id: string, name: string) => {
    if (!window.confirm(`Supprimer la demande de ${name} ?`)) return;
    startTransition(async () => {
      const r = await deleteDiscoveryLead(id);
      if (r.success) {
        toast.success("Demande retirée.");
        router.refresh();
      } else {
        toast.error(r.error);
      }
    });
  };

  return (
    <div className="space-y-4">
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
            <span className="ml-1.5 text-xs opacity-70">{countFor(f.id)}</span>
          </Button>
        ))}
      </div>

      <Card className="bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Élève
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-gray-600">Pays</th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Niveau
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Créneau
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Statut
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-gray-500 text-sm"
                  >
                    Aucune demande dans ce filtre.
                  </td>
                </tr>
              ) : (
                visible.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {lead.dateLabel}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/cours-decouverte/${lead.id}`}
                        className="text-primary hover:text-secondary hover:underline font-medium"
                      >
                        {lead.fullName}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <p>{lead.email}</p>
                      <p className="text-xs text-gray-500">{lead.whatsapp}</p>
                    </td>
                    <td className="p-4 text-gray-600">{lead.pays}</td>
                    <td className="p-4 text-gray-600 text-sm max-w-[220px]">
                      {lead.niveauLabel}
                    </td>
                    <td className="p-4">
                      {lead.hasCalendly ? (
                        <Badge className="bg-emerald-100 text-emerald-800">
                          Réservé
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      {lead.traite ? (
                        <Badge className="bg-gray-100 text-gray-700">
                          Traité
                        </Badge>
                      ) : (
                        <Badge className="bg-secondary text-secondary-foreground">
                          À traiter
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/cours-decouverte/${lead.id}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-sm" })
                          )}
                          aria-label={`Détail de ${lead.fullName}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={pending}
                          aria-label={`Supprimer ${lead.fullName}`}
                          onClick={() => remove(lead.id, lead.fullName)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
