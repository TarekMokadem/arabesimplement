"use client";

import { useState, useTransition } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestStudentPasswordChangeEmail } from "@/app/(auth)/actions/password-reset.actions";

type Props = {
  disabled?: boolean;
};

export function RequestPasswordChangeButton({ disabled }: Props) {
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const busy = disabled || pending;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full border-primary text-primary"
        disabled={busy}
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const r = await requestStudentPasswordChangeEmail();
            if (r.success) {
              setMessage({
                type: "ok",
                text:
                  "Un e-mail a été envoyé à votre adresse avec un lien sécurisé (valable 24 h). Vérifiez vos courriers indésirables.",
              });
            } else {
              setMessage({ type: "err", text: r.error });
            }
          });
        }}
        data-testid="request-password-change-email"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi…
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Changer de mot de passe (lien par e-mail)
          </>
        )}
      </Button>
      <p className="text-xs text-gray-500">
        Pour votre sécurité, nous n’affichons pas le mot de passe ici : vous recevez un lien unique utilisable une fois, pendant 24 heures.
      </p>
      {message ? (
        <p
          className={
            message.type === "ok"
              ? "text-xs text-emerald-700"
              : "text-xs text-red-600"
          }
          role="status"
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
