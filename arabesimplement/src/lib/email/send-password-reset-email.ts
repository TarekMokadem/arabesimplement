import { Resend } from "resend";
import { getSiteUrl } from "@/lib/site-url";
import type { PasswordResetPurpose } from "@prisma/client";

type Params = {
  to: string;
  prenom: string;
  resetUrl: string;
  purpose: PasswordResetPurpose;
};

export async function sendPasswordResetEmail(params: Params): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "ArabeSimplement <onboarding@resend.dev>";
  const base = getSiteUrl();

  const isForgot = params.purpose === "FORGOT";
  const subject = isForgot
    ? "Réinitialiser votre mot de passe — ArabeSimplement"
    : "Changer votre mot de passe — ArabeSimplement";

  const intro = isForgot
    ? "Vous avez demandé à réinitialiser le mot de passe de votre compte."
    : "Vous avez demandé un lien pour définir un nouveau mot de passe sur ArabeSimplement.";

  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sendPasswordResetEmail] RESEND_API_KEY absent — lien (dev) :",
        params.resetUrl
      );
      return true;
    }
    console.error("[sendPasswordResetEmail] RESEND_API_KEY requis en production");
    return false;
  }

  const resend = new Resend(key);
  const fromHeader =
    from.includes("<") && from.includes(">")
      ? from
      : `ArabeSimplement <${from}>`;

  const { data, error } = await resend.emails.send({
    from: fromHeader,
    to: params.to,
    subject,
    html: `
      <div style="font-family:Georgia,serif;line-height:1.6;color:#1a1a1a;max-width:560px">
        <p>Bonjour ${escapeHtml(params.prenom)},</p>
        <p>${intro}</p>
        <p>Ce lien est valable <strong>24 heures</strong> et ne peut être utilisé qu’une seule fois.</p>
        <p>
          <a href="${escapeHtml(params.resetUrl)}" style="display:inline-block;margin:12px 0;padding:10px 18px;background:#1e3a2f;color:#fff;text-decoration:none;border-radius:6px">Choisir un nouveau mot de passe</a>
        </p>
        <p style="font-size:13px;color:#555">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br />
        <span style="word-break:break-all">${escapeHtml(params.resetUrl)}</span></p>
        <p style="font-size:13px;color:#555">Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail : votre mot de passe actuel reste inchangé.</p>
        <p>— L’équipe ArabeSimplement</p>
        ${base ? `<p style="font-size:12px;color:#666"><a href="${escapeHtml(base)}">${escapeHtml(base)}</a></p>` : ""}
      </div>
    `,
  });

  if (error) {
    console.error(
      "[sendPasswordResetEmail] Resend",
      JSON.stringify(error)
    );
    return false;
  }

  if (data?.id) {
    console.info("[sendPasswordResetEmail] envoyé, id Resend:", data.id);
  }
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
