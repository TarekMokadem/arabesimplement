import { Resend } from "resend";
import {
  adminNotifyEmail,
  escapeHtml,
  resendFromHeader,
} from "@/lib/email/admin-notify";

export type DiscoveryLeadEmailParams = {
  prenom: string;
  nom: string;
  email: string;
  whatsapp: string;
  calendlyEventUri?: string;
};

export async function sendDiscoveryLeadEmail(
  params: DiscoveryLeadEmailParams
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = adminNotifyEmail();
  const fullName = `${params.prenom} ${params.nom}`.trim();
  const slotLine = params.calendlyEventUri
    ? `<p><strong>Créneau Calendly :</strong> <a href="${escapeHtml(params.calendlyEventUri)}">${escapeHtml(params.calendlyEventUri)}</a></p>`
    : `<p><strong>Créneau :</strong> pas encore choisi (le visiteur n’a pas confirmé sur Calendly).</p>`;

  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sendDiscoveryLeadEmail] RESEND_API_KEY absent — lead (dev) :",
        fullName,
        params.email,
        params.whatsapp,
        params.calendlyEventUri ?? "sans créneau"
      );
      return true;
    }
    console.error("[sendDiscoveryLeadEmail] RESEND_API_KEY requis en production");
    return false;
  }

  const resend = new Resend(key);
  const subject = params.calendlyEventUri
    ? `Créneau découverte réservé — ${fullName}`
    : `Cours de découverte — ${fullName}`;

  const { data, error } = await resend.emails.send({
    from: resendFromHeader(),
    to,
    replyTo: params.email,
    subject,
    html: `
      <div style="font-family:Georgia,serif;line-height:1.6;color:#1a1a1a;max-width:560px">
        <p>Nouvelle demande de <strong>cours de découverte (30 min)</strong>.</p>
        <p>
          <strong>Prénom :</strong> ${escapeHtml(params.prenom)}<br />
          <strong>Nom :</strong> ${escapeHtml(params.nom)}<br />
          <strong>E-mail :</strong> ${escapeHtml(params.email)}<br />
          <strong>WhatsApp :</strong> ${escapeHtml(params.whatsapp)}
        </p>
        ${slotLine}
        <p>— Notification automatique ArabeSimplement</p>
      </div>
    `,
  });

  if (error) {
    console.error(
      "[sendDiscoveryLeadEmail] Resend refusé",
      JSON.stringify(error)
    );
    return false;
  }

  if (data?.id) {
    console.info("[sendDiscoveryLeadEmail] envoyé, id Resend:", data.id);
  }
  return true;
}
