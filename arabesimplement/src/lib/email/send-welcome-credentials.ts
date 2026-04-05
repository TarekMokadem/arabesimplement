import { Resend } from "resend";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";

type Params = {
  to: string;
  prenom: string;
  plainPassword: string;
};

/**
 * Envoie l’e-mail avec mot de passe provisoire après premier achat (invité).
 * Retourne false en production si l’envoi n’a pas pu être fait (évite de marquer la commande comme « déjà prévenue »).
 */
export async function sendWelcomeCredentialsEmail(
  params: Params
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "ArabeSimplement <onboarding@resend.dev>";
  const loginUrl = toAbsoluteUrl("/connexion");
  const dashboardUrl = toAbsoluteUrl("/tableau-de-bord");
  const howUrl = toAbsoluteUrl("/comment-ca-marche");
  const base = getSiteUrl();

  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sendWelcomeCredentialsEmail] RESEND_API_KEY absent — mot de passe généré (dev) :",
        params.plainPassword
      );
      return true;
    }
    console.error(
      "[sendWelcomeCredentialsEmail] RESEND_API_KEY requis en production"
    );
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
    subject: "Votre compte ArabeSimplement — identifiants",
    html: `
      <div style="font-family:Georgia,serif;line-height:1.6;color:#1a1a1a;max-width:560px">
        <p>Bonjour ${escapeHtml(params.prenom)},</p>
        <p>Votre paiement a bien été enregistré. Un compte a été créé pour accéder à vos formations.</p>
        <p><strong>E-mail de connexion :</strong> ${escapeHtml(params.to)}</p>
        <p><strong>Mot de passe provisoire :</strong><br />
        <code style="font-size:16px;letter-spacing:0.02em">${escapeHtml(params.plainPassword)}</code></p>
        <p>
          <a href="${escapeHtml(loginUrl)}" style="display:inline-block;margin:8px 0;padding:10px 18px;background:#1e3a2f;color:#fff;text-decoration:none;border-radius:6px">Se connecter</a>
        </p>
        <p>Ensuite : ouvrez votre <a href="${escapeHtml(dashboardUrl)}">tableau de bord</a>, choisissez un créneau si votre formation le prévoit, et retrouvez le bon contact WhatsApp. Le déroulé est résumé sur la page <a href="${escapeHtml(howUrl)}">Comment ça marche</a>.</p>
        <p>Nous vous invitons à modifier ce mot de passe dès que possible.</p>
        <p>— L’équipe ArabeSimplement</p>
        ${base ? `<p style="font-size:12px;color:#666"><a href="${escapeHtml(base)}">${escapeHtml(base)}</a></p>` : ""}
      </div>
    `,
  });

  if (error) {
    console.error(
      "[sendWelcomeCredentialsEmail] Resend refusé — vérifiez RESEND_FROM (domaine vérifié chez Resend, pas une adresse Gmail seule).",
      JSON.stringify(error)
    );
    return false;
  }

  if (data?.id) {
    console.info(
      "[sendWelcomeCredentialsEmail] envoyé, id Resend:",
      data.id
    );
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
