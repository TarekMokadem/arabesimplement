"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  printedBookletBenefitText,
  printedBookletDeliveryLabel,
  printedBookletOptionalLabel,
  PRINTED_BOOKLET_EUROS,
} from "@/lib/shop/printed-booklet";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function PrintedBookletOption({ checked, onCheckedChange }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 bg-secondary/10 p-3 sm:p-3.5 shadow-[0_1px_4px_rgba(50,69,48,0.08)] transition-colors",
        checked
          ? "border-primary bg-secondary/20 shadow-[0_2px_8px_rgba(50,69,48,0.14)]"
          : "border-secondary/55"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] font-semibold text-primary/75 pt-0.5">
          {printedBookletOptionalLabel()}
        </span>
        <span className="text-[1.75rem] sm:text-3xl font-bold leading-none tabular-nums text-accent shrink-0">
          +{PRINTED_BOOKLET_EUROS}&nbsp;€
        </span>
      </div>

      <p className="mt-2 text-xs sm:text-[13px] text-gray-600 leading-snug">
        {printedBookletBenefitText()}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <Checkbox
          id="printed-booklet"
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          data-testid="checkbox-printed-booklet"
          className="size-6 rounded-md border-2 border-primary bg-white shadow-[0_1px_3px_rgba(50,69,48,0.22)] data-checked:border-primary data-checked:bg-primary"
        />
        <Label
          htmlFor="printed-booklet"
          className="cursor-pointer font-semibold text-primary text-sm leading-snug"
        >
          📦 {printedBookletDeliveryLabel()}
        </Label>
      </div>
    </div>
  );
}
