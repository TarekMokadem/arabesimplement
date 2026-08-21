"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format";
import { hourlyMinPriceEuros } from "@/lib/scheduling-mode";
import type { FormationSchedulingMode } from "@/types/domain.types";

interface SessionDuMomentProps {
  titre: string;
  description: string;
  badge: string;
  prix: number;
  prixPromo: number;
  slug: string;
  /** Si absent : pas de compte à rebours (offre sans échéance). */
  expiresAt: Date | null;
  schedulingMode?: FormationSchedulingMode;
}

export function SessionDuMoment({
  titre,
  description,
  badge,
  prix,
  prixPromo,
  slug,
  expiresAt,
  schedulingMode,
}: SessionDuMomentProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [tickKey, setTickKey] = useState(0);

  const showCountdown = expiresAt != null;

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const target = new Date(expiresAt).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
      setTickKey((k) => k + 1);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (showCountdown && isExpired) return null;

  const hourly = schedulingMode === "HOURLY_PURCHASE";
  const showPromo =
    !hourly && prix > 0 && prixPromo > 0 && prixPromo < prix;
  const discount =
    showPromo ? Math.round(((prix - prixPromo) / prix) * 100) : 0;
  const displayPrice = hourly
    ? hourlyMinPriceEuros()
    : showPromo
      ? prixPromo
      : prix;

  return (
    <section
      className="relative overflow-hidden border-y-4 border-secondary bg-gradient-to-br from-brand-mint-100 via-brand-mint-50 to-white py-12 sm:py-16"
      data-testid="session-du-moment"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-14">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
              <Flame className="h-5 w-5 text-secondary animate-pulse" />
              <Badge className="animate-offer-badge bg-secondary px-4 py-1 text-sm text-secondary-foreground hover:bg-secondary">
                {badge}
              </Badge>
            </div>

            <h2 className="mb-3 font-serif text-2xl font-bold leading-tight text-primary sm:mb-4 sm:text-3xl md:text-4xl">
              {titre}
            </h2>

            <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-gray-600 sm:mb-6 sm:text-base lg:mx-0">
              {description}
            </p>

            <div className="mb-6 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 lg:justify-start">
              {hourly ? (
                <>
                  <span className="text-3xl font-bold tracking-tight text-primary sm:text-5xl">
                    Dès {formatPrice(displayPrice)}
                  </span>
                  <span className="text-sm text-gray-600">
                    par séance (durée au choix sur la fiche)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold tracking-tight text-primary sm:text-5xl">
                    {displayPrice}€
                  </span>
                  {showPromo ? (
                    <>
                      <span className="text-lg text-gray-400 line-through sm:text-xl">
                        {prix}€
                      </span>
                      <Badge className="bg-red-500 text-white hover:bg-red-500">
                        -{discount}%
                      </Badge>
                    </>
                  ) : null}
                </>
              )}
            </div>

            {showCountdown ? (
              <div className="mb-6 lg:hidden">
                <CountdownPanel timeLeft={timeLeft} tickKey={tickKey} />
              </div>
            ) : null}

            <Link href={`/boutique/${slug}#achat`} className="inline-flex w-full sm:w-auto">
              <Button className="animate-offer-cta w-full bg-primary px-6 py-6 text-base text-primary-foreground shadow-lg hover:bg-secondary hover:text-secondary-foreground sm:w-auto sm:px-8 sm:text-lg">
                Rejoindre le programme
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {showCountdown ? (
            <div className="hidden flex-shrink-0 lg:flex lg:items-center">
              <CountdownPanel timeLeft={timeLeft} tickKey={tickKey} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CountdownPanel({
  timeLeft,
  tickKey,
}: {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  tickKey: number;
}) {
  return (
    <div className="w-full rounded-2xl bg-primary px-4 py-4 text-center text-white shadow-xl sm:px-6 sm:py-5 lg:w-auto">
      <div className="mb-3 flex items-center justify-center gap-2">
        <Clock className="h-4 w-4 text-secondary" />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
          Offre expire dans
        </span>
      </div>
      <div className="flex justify-center gap-2 sm:gap-3">
        <TimeBlock value={timeLeft.days} label="Jours" />
        <TimeBlock value={timeLeft.hours} label="Heures" />
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <TimeBlock
          value={timeLeft.seconds}
          label="Sec"
          highlightKey={tickKey}
        />
      </div>
    </div>
  );
}

function TimeBlock({
  value,
  label,
  highlightKey,
}: {
  value: number;
  label: string;
  highlightKey?: number;
}) {
  return (
    <div className="min-w-[52px] rounded-lg bg-primary-light p-2 sm:min-w-[64px] sm:p-3">
      <div
        key={highlightKey != null ? `${label}-${value}` : undefined}
        className={`font-mono text-xl font-bold text-white sm:text-3xl ${
          highlightKey != null ? "animate-offer-countdown" : ""
        }`}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-gray-300 sm:text-xs">
        {label}
      </div>
    </div>
  );
}
