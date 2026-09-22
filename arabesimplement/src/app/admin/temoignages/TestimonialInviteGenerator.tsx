"use client";

import { useState, useTransition } from "react";
import { Copy, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTestimonialInviteLink } from "./actions";
import {
  type TestimonialInviteDurationId,
  isTestimonialInviteDurationId,
  testimonialInviteDurationLabel,
  TESTIMONIAL_INVITE_DURATION_IDS,
} from "@/lib/testimonials/invite-duration";

export function TestimonialInviteGenerator() {
  const [url, setUrl] = useState<string | null>(null);
  const [expiresLabel, setExpiresLabel] = useState<string | null>(null);
  const [infinite, setInfinite] = useState(false);
  const [duration, setDuration] =
    useState<TestimonialInviteDurationId>("7d");
  const [pending, startTransition] = useTransition();

  const generate = () => {
    startTransition(async () => {
      const r = await createTestimonialInviteLink(duration);
      if (r.success) {
        setUrl(r.url);
        setInfinite(r.expiresAt == null);
        setExpiresLabel(
          r.expiresAt
            ? new Date(r.expiresAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : null
        );
        toast.success("Lien généré — copiez-le et envoyez-le à l’élève.");
      } else {
        toast.error(r.error);
      }
    });
  };

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papiers.");
    } catch {
      toast.error("Copie impossible — sélectionnez le lien manuellement.");
    }
  };

  return (
    <Card className="bg-white mb-8 border-secondary/30">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg text-primary flex items-center gap-2">
          <Link2 className="h-5 w-5 text-secondary" />
          Lien avis élève
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Générez un lien personnel : l’élève peut envoyer autant d’avis que
          souhaité. Choisissez{" "}
          <strong>7 jours</strong> ou un lien{" "}
          <strong>sans expiration</strong>. Chaque avis reste en attente
          jusqu’à votre validation.
        </p>
        <div className="space-y-1.5 max-w-xs">
          <Label htmlFor="invite-duration">Durée du lien</Label>
          <Select
            value={duration}
            onValueChange={(value) => {
              if (value && isTestimonialInviteDurationId(value)) {
                setDuration(value);
              }
            }}
          >
            <SelectTrigger id="invite-duration" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TESTIMONIAL_INVITE_DURATION_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {testimonialInviteDurationLabel(id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={generate}
          disabled={pending}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Génération…
            </>
          ) : (
            "Générer un nouveau lien"
          )}
        </Button>
        {url && (
          <div className="space-y-2 rounded-lg border bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
              {infinite
                ? "Sans expiration · envois illimités"
                : `Valide 7 jours (jusqu’au ${expiresLabel ?? "—"}) · envois illimités`}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input readOnly value={url} className="font-mono text-xs bg-white" />
              <Button
                type="button"
                variant="outline"
                onClick={copy}
                className="shrink-0"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copier
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
