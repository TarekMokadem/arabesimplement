"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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
import { submitDiscoveryLead } from "@/app/(public)/actions/discovery-lead.actions";
import {
  calendlyInlineEmbedUrl,
  calendlyScheduledEventUri,
  isCalendlyOrigin,
} from "@/lib/calendly";
import { DISCOVERY_LESSON_OPEN_EVENT } from "@/lib/discovery-lesson";

const SESSION_SEEN_KEY = "as.discoveryLesson.seen";
const SUBMITTED_KEY = "as.discoveryLesson.submitted";

type Step = "form" | "calendly" | "done";

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

export function DiscoveryLessonPopup({
  calendlyUrl = "",
}: {
  calendlyUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [lead, setLead] = useState<Omit<
    DiscoveryLeadInput,
    "calendlyEventUri" | "website"
  > | null>(null);
  const [pending, startTransition] = useTransition();
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
    formState: { errors },
  } = form;

  const openForm = () => {
    calendlyBookedRef.current = false;
    setLead(null);
    setStep("form");
    form.reset();
    setOpen(true);
  };

  useEffect(() => {
    const onOpen = () => openForm();
    window.addEventListener(DISCOVERY_LESSON_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(DISCOVERY_LESSON_OPEN_EVENT, onOpen);
  }, [form]);

  useEffect(() => {
    if (pathname !== "/") return;
    if (alreadySubmitted() || alreadySeenThisSession()) return;
    const timer = window.setTimeout(() => {
      markSessionSeen();
      setOpen(true);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

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
      startTransition(async () => {
        const result = await submitDiscoveryLead({
          ...lead,
          calendlyEventUri: uri,
        });
        if (result.success) {
          markSubmitted();
          setStep("done");
        } else {
          toast.error(result.error);
        }
      });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [lead, step]);

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await submitDiscoveryLead({
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        whatsapp: data.whatsapp,
        website: data.website,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setLead({
        prenom: data.prenom.trim(),
        nom: data.nom.trim(),
        email: data.email.trim(),
        whatsapp: data.whatsapp.trim(),
      });
      markSubmitted();
      if (calendlyUrl) {
        setStep("calendly");
        return;
      }
      setStep("done");
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "max-h-[min(92vh,880px)] w-full overflow-y-auto",
          step === "calendly" ? "sm:max-w-2xl" : "sm:max-w-lg"
        )}
        aria-describedby="discovery-lesson-desc"
      >
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Offert
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              30 minutes
            </span>
          </div>
          <DialogTitle className="font-serif text-xl font-bold text-primary">
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
              disabled={pending}
              className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              {pending
                ? "Envoi…"
                : calendlyUrl
                  ? "Continuer vers le calendrier"
                  : "Réserver mon cours découverte"}
            </Button>
          </form>
        )}

        {step === "calendly" && embedSrc && (
          <div className="space-y-3">
            <iframe
              title="Choisir un horaire — Calendly"
              src={embedSrc}
              className="w-full overflow-hidden rounded-lg border-0"
              style={{ minWidth: 320, height: 700 }}
            />
            <p className="text-xs text-gray-500">
              Après confirmation, un e-mail part à l’équipe avec vos coordonnées
              et le créneau choisi.
            </p>
          </div>
        )}

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
