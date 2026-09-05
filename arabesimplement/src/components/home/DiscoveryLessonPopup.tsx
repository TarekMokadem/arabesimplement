"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  discoveryLeadSchema,
  type DiscoveryLeadInput,
} from "@/lib/validations/discovery-lead.schema";
import {
  calendlyInlineEmbedUrl,
  calendlyScheduledEventUri,
  isCalendlyOrigin,
} from "@/lib/calendly";
import {
  DISCOVERY_LESSON_OPEN_EVENT,
  notifyDiscoveryLead,
} from "@/lib/discovery-lesson";
import { DiscoveryCalendlyFrame } from "@/components/home/DiscoveryCalendlyFrame";

const SESSION_SEEN_KEY = "as.discoveryLesson.seen";
const SUBMITTED_KEY = "as.discoveryLesson.submitted";

type Step = "form" | "calendly" | "done";
type Lead = Omit<DiscoveryLeadInput, "calendlyEventUri" | "website">;

function markSessionSeen() {
  try {
    sessionStorage.setItem(SESSION_SEEN_KEY, "1");
  } catch {
    /* private mode */
  }
}

function markSubmitted() {
  try {
    localStorage.setItem(SUBMITTED_KEY, "1");
    sessionStorage.setItem(SESSION_SEEN_KEY, "1");
  } catch {
    /* private mode */
  }
}

function alreadySubmitted(): boolean {
  try {
    return localStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

function alreadySeenThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function notifyAdmin(data: DiscoveryLeadInput) {
  void notifyDiscoveryLead(data).then((result) => {
    if (result.success) {
      markSubmitted();
      return;
    }
    toast.error(result.error);
  });
}

export function DiscoveryLessonPopup({
  calendlyUrl = "",
}: {
  calendlyUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [lead, setLead] = useState<Lead | null>(null);
  const calendlyBookedRef = useRef(false);
  const pathname = usePathname();

  const form = useForm<DiscoveryLeadInput>({
    resolver: zodResolver(discoveryLeadSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      whatsapp: "",
      website: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const openForm = useCallback(() => {
    calendlyBookedRef.current = false;
    setLead(null);
    setStep("form");
    reset();
    setOpen(true);
  }, [reset]);

  useEffect(() => {
    window.addEventListener(DISCOVERY_LESSON_OPEN_EVENT, openForm);
    return () => window.removeEventListener(DISCOVERY_LESSON_OPEN_EVENT, openForm);
  }, [openForm]);

  useEffect(() => {
    if (pathname !== "/") return;
    if (alreadySubmitted() || alreadySeenThisSession()) return;

    const show = () => {
      markSessionSeen();
      setOpen(true);
    };

    let idleId = 0;
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(show, { timeout: 400 });
        return;
      }
      show();
    }, 1400);

    return () => {
      window.clearTimeout(timer);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (!open || !calendlyUrl || typeof document === "undefined") return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "document";
    link.href = calendlyUrl.split("?")[0] ?? calendlyUrl;
    document.head.appendChild(link);
    return () => link.remove();
  }, [open, calendlyUrl]);

  const embedSrc = useMemo(() => {
    if (!calendlyUrl || !lead || typeof window === "undefined") return "";
    return calendlyInlineEmbedUrl({
      baseUrl: calendlyUrl,
      name: `${lead.prenom} ${lead.nom}`.trim(),
      email: lead.email,
      host: window.location.host,
    });
  }, [calendlyUrl, lead]);

  useEffect(() => {
    if (step !== "calendly" || !lead) return;

    const onMessage = (event: MessageEvent) => {
      if (!isCalendlyOrigin(event.origin)) return;
      const uri = calendlyScheduledEventUri(event.data);
      if (!uri || calendlyBookedRef.current) return;
      calendlyBookedRef.current = true;
      setStep("done");
      notifyAdmin({ ...lead, calendlyEventUri: uri });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [lead, step]);

  const onSubmit = handleSubmit((data) => {
    const nextLead: Lead = {
      prenom: data.prenom.trim(),
      nom: data.nom.trim(),
      email: data.email.trim(),
      whatsapp: data.whatsapp.trim(),
    };
    setLead(nextLead);
    notifyAdmin({
      ...nextLead,
      website: data.website,
    });
    setStep(calendlyUrl ? "calendly" : "done");
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "flex w-full flex-col",
          step === "calendly"
            ? "h-[min(92dvh,780px)] max-h-[min(92dvh,780px)] gap-2 overflow-hidden p-3 sm:max-w-2xl"
            : "max-h-[min(92dvh,880px)] overflow-y-auto sm:max-w-lg"
        )}
        aria-describedby="discovery-lesson-desc"
      >
        <DialogHeader className={cn("shrink-0", step === "calendly" && "gap-1")}>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Offert
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              30 minutes
            </span>
          </div>
          <DialogTitle
            className={cn(
              "font-serif font-bold text-primary",
              step === "calendly" ? "text-lg" : "text-xl"
            )}
          >
            Cours de découverte
          </DialogTitle>
          <DialogDescription id="discovery-lesson-desc">
            {step === "form" &&
              "Un premier cours de 30 min pour découvrir notre méthode, sans engagement."}
            {step === "calendly" &&
              "Choisissez l’horaire qui vous arrange. Nom et e-mail sont déjà préremplis."}
            {step === "done" &&
              "Votre demande est bien partie. Nous revenons vers vous rapidement."}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <Label htmlFor="discovery-website">Site web</Label>
              <Input
                id="discovery-website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="discovery-prenom">Prénom</Label>
                <Input
                  id="discovery-prenom"
                  autoComplete="given-name"
                  {...register("prenom")}
                  className={errors.prenom ? "border-red-500" : ""}
                />
                {errors.prenom && (
                  <p className="text-xs text-red-600">{errors.prenom.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="discovery-nom">Nom</Label>
                <Input
                  id="discovery-nom"
                  autoComplete="family-name"
                  {...register("nom")}
                  className={errors.nom ? "border-red-500" : ""}
                />
                {errors.nom && (
                  <p className="text-xs text-red-600">{errors.nom.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discovery-whatsapp">Numéro WhatsApp</Label>
              <Input
                id="discovery-whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+33 6 12 34 56 78"
                {...register("whatsapp")}
                className={errors.whatsapp ? "border-red-500" : ""}
              />
              {errors.whatsapp && (
                <p className="text-xs text-red-600">{errors.whatsapp.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discovery-email">E-mail</Label>
              <Input
                id="discovery-email"
                type="email"
                autoComplete="email"
                placeholder="votre@email.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              {calendlyUrl
                ? "Continuer vers le calendrier"
                : "Réserver mon cours découverte"}
            </Button>
          </form>
        )}

        {step === "calendly" && embedSrc ? (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <DiscoveryCalendlyFrame src={embedSrc} />
            <p className="shrink-0 text-xs text-gray-500">
              Après confirmation, un e-mail part à l’équipe avec vos coordonnées
              et le créneau choisi.
            </p>
          </div>
        ) : null}

        {step === "done" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Merci. L’équipe a bien reçu votre demande de cours de découverte.
              Surveillez aussi votre e-mail (confirmation Calendly si vous avez
              choisi un horaire).
            </p>
            <Button
              type="button"
              className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => setOpen(false)}
            >
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
