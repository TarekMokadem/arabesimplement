import { Card, CardContent } from "@/components/ui/card";
import {
  HOURLY_SLOTS_PRICING,
  schedulingModeDescription,
  schedulingModePaymentExplanation,
  schedulingModeTitle,
  type FormationSchedulingMode,
} from "@/lib/scheduling-mode";

type Props = {
  mode: FormationSchedulingMode;
};

export function SchedulingModeExplainer({ mode }: Props) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5 space-y-3">
        <h3 className="font-serif text-lg font-bold text-primary">
          {schedulingModeTitle(mode)}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {schedulingModeDescription(mode)}
        </p>
        <p className="text-sm text-primary/90 font-medium leading-relaxed border-t border-primary/10 pt-3">
          {schedulingModePaymentExplanation(mode)}
        </p>
        {mode === "HOURLY_PURCHASE" && (
          <>
            <p className="text-sm text-gray-700 leading-relaxed border-t border-primary/10 pt-3 mt-3">
              Tarif <strong>par semaine</strong> pour une séance de cette durée, répétée chaque
              semaine au même créneau (ex. 1 h → 10 € chaque semaine).
            </p>
            <ul className="text-sm text-gray-700 space-y-2 pt-2">
              {HOURLY_SLOTS_PRICING.map((row) => (
                <li key={row.minutes} className="flex justify-between gap-4">
                  <span>{row.durationLabel} / semaine</span>
                  <span className="font-semibold text-primary whitespace-nowrap">
                    {row.priceEuros} €
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
