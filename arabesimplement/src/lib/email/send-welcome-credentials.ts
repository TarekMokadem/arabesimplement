import { Resend } from "resend";

type Params = {
  to: string;
  prenom: string;
  plainPassword: string;
};

/**
 * Envoie l’e-mail avec mot de passe provisoire après premier achat (invité).
 * Sans RESEND_API_KEY, log en développement uniquement (ne pas en production).
 */
export async function sendWelcomeCredentialsEmail(
  params: Params
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "ArabeSimplement <onboarding@resend.dev>";

  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sendWelcomeCredentialsEmail] RESEND_API_KEY absent — mot de passe généré (dev) :",
        params.plainPassword
      );
    } else {
      console.error(
        "[sendWelcomeCredentialsEmail] RESEND_API_KEY requis en production"
      );
    }
    return;
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Votre compte ArabeSimplement — identifiants",
    html: `
      <p>Bonjour ${escapeHtml(params.prenom)},</p>
      <p>Votre paiement a bien été enregistré. Un compte a été créé pour accéder à vos formations.</p>
      <p><strong>Connexion :</strong> <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/connexion">${escapeHtml(params.to)}</a></p>
      <p><strong>Mot de passe provisoire :</strong> <code style="font-size:16px">${escapeHtml(params.plainPassword)}</code></p>
      <p>Nous vous invitons à vous connecter puis à modifier ce mot de passe dans les paramètres du compte lorsque c’est possible.</p>
      <p>— L’équipe ArabeSimplement</p>
    `,
  });

  if (error) {
    console.error("[sendWelcomeCredentialsEmail] Resend", error);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
