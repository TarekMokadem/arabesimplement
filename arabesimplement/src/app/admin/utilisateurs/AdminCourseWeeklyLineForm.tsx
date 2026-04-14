"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminUpdateCourseWeeklyBundleQuantity,
  adminUpdateCourseWeeklyHourlyMinutes,
} from "./learner-subscription-admin-actions";

const DURATIONS = [30, 40, 60] as const;

type Props = {
  courseWeeklySubscriptionId: string;
  initialBundleQuantity: number;
  initialHourlyMinutes: number;
};

export function AdminCourseWeeklyLineForm({
  courseWeeklySubscriptionId,
  initialBundleQuantity,
  initialHourlyMinutes,
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 p-3 space-y-3 text-sm">
      <p className="font-medium text-primary text-xs uppercase tracking-wide">
        Gestion admin (Stripe)
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label htmlFor={`qty-${courseWeeklySubscriptionId}`} className="text-xs">
            Unités facturées (quantité)
          </Label>
          <Input
            id={`qty-${courseWeeklySubscriptionId}`}
            type="number"
            min={1}
            step={1}
            defaultValue={initialBundleQuantity}
            className="w-24 h-9"
            disabled={pending}
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => {
            const el = document.getElementById(
              `qty-${courseWeeklySubscriptionId}`
            ) as HTMLInputElement | null;
            const n = el ? parseInt(el.value, 10) : NaN;
            if (!Number.isFinite(n) || n < 1) {
              toast.error("Quantité invalide.");
              return;
            }
            startTransition(async () => {
              const r = await adminUpdateCourseWeeklyBundleQuantity(
                courseWeeklySubscriptionId,
                n
              );
              if (r.success) {
                toast.success("Quantité mise à jour.");
                window.location.reload();
              } else toast.error(r.error);
            });
          }}
        >
          Enregistrer la quantité
        </Button>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Durée séance (abonnement)</Label>
          <Select
            defaultValue={String(initialHourlyMinutes)}
            disabled={pending}
            onValueChange={(v) => {
              if (v == null) return;
              const minutes = parseInt(v, 10);
              startTransition(async () => {
                const r = await adminUpdateCourseWeeklyHourlyMinutes(
                  courseWeeklySubscriptionId,
                  minutes
                );
                if (r.success) {
                  toast.success("Durée mise à jour.");
                  window.location.reload();
                } else toast.error(r.error);
              });
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 max-w-md pb-1">
          Le changement de durée met à jour le prix Stripe (prorata). Vérifiez
          que les prix mensuels <code className="text-[11px]">STRIPE_PRICE_MONTHLY_*</code>{" "}
          sont configurés.
        </p>
      </div>
    </div>
  );
}
