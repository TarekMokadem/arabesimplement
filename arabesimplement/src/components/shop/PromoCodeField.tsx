"use client";

import { useState } from "react";
import { Loader2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { previewPromoCode } from "@/app/(shop)/actions/promo.actions";
import type { CheckoutKindForDiscount } from "@/lib/promo/apply-discount";
import {
  writeStoredCheckoutPromoCode,
} from "@/lib/promo/checkout-promo-storage";

export type AppliedCheckoutPromo = {
  code: string;
  discountEuros: number;
  payableEuros: number;
};

type Props = {
  subtotalEuros: number;
  checkoutKind: CheckoutKindForDiscount;
  applied: AppliedCheckoutPromo | null;
  onApplied: (next: AppliedCheckoutPromo | null) => void;
};

export function PromoCodeField({
  subtotalEuros,
  checkoutKind,
  applied,
  onApplied,
}: Props) {
  const [code, setCode] = useState(applied?.code ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async () => {
    setError(null);
    setPending(true);
    try {
      const result = await previewPromoCode(code, subtotalEuros, checkoutKind);
      if (!result.success) {
        setError(result.error);
        onApplied(null);
        writeStoredCheckoutPromoCode("");
        return;
      }
      const next: AppliedCheckoutPromo = {
        code: result.code,
        discountEuros: result.discountEuros,
        payableEuros: result.payableEuros,
      };
      writeStoredCheckoutPromoCode(result.code);
      setCode(result.code);
      onApplied(next);
    } finally {
      setPending(false);
    }
  };

  const clear = () => {
    setCode("");
    setError(null);
    writeStoredCheckoutPromoCode("");
    onApplied(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="promo-code">Code promo</Label>
      {applied ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2">
          <p className="text-sm text-primary min-w-0">
            <Tag className="h-3.5 w-3.5 inline-block mr-1.5 text-accent" />
            <span className="font-mono font-medium tracking-wide">
              {applied.code}
            </span>
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-600"
            onClick={clear}
            aria-label="Retirer le code promo"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            id="promo-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="EX. RAMADAN10"
            autoComplete="off"
            className="font-mono tracking-wide"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void apply();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => void apply()}
            disabled={pending || !code.trim()}
            className="shrink-0"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Appliquer"}
          </Button>
        </div>
      )}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
