import { Resend } from "resend";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";

export type PostPurchaseGuideEmailInput = {
  to: string;
  prenom: string;
  formations: { titre: string; slug: string }[];
};

/**
 * E-mail « prochaines étapes » pour les élèves déjà connectés (ou compte existant avec mot de passe)
 * qui ne reçoivent pas l’e-mail d’identifiants provisoires.
 * @returns true si l’envoi a réussi (ou mode dev sans clé — évite les tentatives infinies).
 */
export async function sendPostPurchaseGuideEmail(
  input: PostPurchaseGuideEmailInput
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "ArabeSimplement <onboarding@resend.dev>";
  const base = getSiteUrl();

  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sendPostPurchaseGuideEmail] RESEND_API_KEY absent — dev, pas d’envoi",
        input.to
      );
      return true;
    }
    console.error(
      "[sendPostPurchaseGuideEmail] RESEND_API_KEY requis en production"
    );
    return false;
  }

  const liste = input.formations
    .map(
      (f) =>
        `<li><a href="${escapeHtml(toAbsoluteUrl(`/boutique/${f.slug}`))}">${escapeHtml(f.titre)}</a></li>`
    )
    .join("");

  const resend = new Resend(key);
  const fromHeader =
    from.includes("<") && from.includes(">")
      ? from
      : `ArabeSimplement <${from}>`;

  const dashboardUrl = toAbsoluteUrl("/tableau-de-bord");
  const howUrl = toAbsoluteUrl("/comment-ca-marche");

  const { data, error } = await resend.emails.send({
    from: fromHeader,
    to: input.to,
    subject: "Votre commande ArabeSimplement — prochaines étapes",
    html: `
      <div style="font-family:Georgia,serif;line-height:1.6;color:#1a1a1a;max-width:560px">
        <p>Bonjour ${escapeHtml(input.prenom)},</p>
        <p>Votre paiement a bien été enregistré. Merci pour votre confiance.</p>
        <p><strong>Prochaines étapes :</strong></p>
        <ol>
          <li>Connectez-vous à votre <a href="${escapeHtml(dashboardUrl)}">tableau de bord</a> pour voir vos achats, choisir un créneau si besoin et accéder au bon contact WhatsApp.</li>
          <li>Selon la formation, le mode d’organisation (créneaux, flexible ou cours à la carte) est rappelé sur chaque fiche — voir ci-dessous.</li>
          <li>En cas de question, la page <a href="${escapeHtml(howUrl)}">Comment ça marche</a> résume le déroulement après l’achat.</li>
        </ol>
        ${liste ? `<p><strong>Votre sélection :</strong></p><ul>${liste}</ul>` : ""}
        <p>— L’équipe ArabeSimplement</p>
        ${base ? `<p style="font-size:12px;color:#666"><a href="${escapeHtml(base)}">${escapeHtml(base)}</a></p>` : ""}
      </div>
    `,
  });

  if (error) {
    console.error(
      "[sendPostPurchaseGuideEmail] Resend",
      JSON.stringify(error)
    );
    return false;
  }
  if (data?.id) {
    console.info("[sendPostPurchaseGuideEmail] envoyé, id:", data.id);
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
