import {
  schedulingModePaymentBrief,
  type FormationSchedulingMode,
} from "@/lib/scheduling-mode";

type Props = {
  mode: FormationSchedulingMode;
};

/** Note courte (2–3 lignes) sur le mode de paiement — la description détaillée est ailleurs sur la fiche. */
export function SchedulingModeExplainer({ mode }: Props) {
  const text = schedulingModePaymentBrief(mode);
  if (!text.trim()) return null;

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-gray-800 leading-relaxed">
      <p className="font-medium text-primary text-xs uppercase tracking-wide mb-1.5">
        Paiement
      </p>
      <p>{text}</p>
    </div>
  );
}
