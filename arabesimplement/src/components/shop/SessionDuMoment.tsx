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
  expiresAt: Date;
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

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
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
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (isExpired) return null;

  const hourly = schedulingMode === "HOURLY_PURCHASE";
  const showPromo =
    !hourly && prix > 0 && prixPromo > 0 && prixPromo < prix;
  const discount =
    showPromo ? Math.round(((prix - prixPromo) / prix) * 100) : 0;

  return (
    <section
      className="py-16 bg-gradient-to-r from-brand-mint-100 to-brand-mint-50 border-y-4 border-secondary"
      data-testid="session-du-moment"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
              <Flame className="h-5 w-5 text-secondary animate-pulse" />
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary text-sm px-4 py-1">
                {badge}
              </Badge>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              {titre}
            </h2>

            <p className="text-gray-600 mb-6 max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-6">
              {hourly ? (
                <>
                  <span className="text-4xl font-bold text-accent">
                    Dès {formatPrice(hourlyMinPriceEuros())}
                  </span>
                  <span className="text-sm text-gray-600">
                    par séance (durée au choix sur la fiche)
                  </span>
                </>
              ) : showPromo ? (
                <>
                  <span className="text-4xl font-bold text-accent">
                    {prixPromo}€
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {prix}€
                  </span>
                  <Badge className="bg-red-500 text-white hover:bg-red-500">
                    -{discount}%
                  </Badge>
                </>
              ) : (
                <span className="text-4xl font-bold text-accent">{prix}€</span>
              )}
            </div>

            <Link href={`/boutique/${slug}#achat`}>
              <Button className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                Rejoindre le programme
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="flex-shrink-0">
            <div className="bg-primary rounded-2xl p-6 text-white text-center">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Clock className="h-5 w-5 text-secondary" />
                <span className="text-sm text-gray-300">Offre expire dans</span>
              </div>

              <div className="flex gap-3">
                <TimeBlock value={timeLeft.days} label="Jours" />
                <TimeBlock value={timeLeft.hours} label="Heures" />
                <TimeBlock value={timeLeft.minutes} label="Min" />
                <TimeBlock value={timeLeft.seconds} label="Sec" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-primary-light rounded-lg p-3 min-w-[60px]">
      <div className="text-3xl font-bold text-white font-mono">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs text-gray-300 uppercase tracking-wide">{label}</div>
    </div>
  );
}
