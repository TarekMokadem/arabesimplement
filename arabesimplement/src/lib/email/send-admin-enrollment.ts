import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { toAbsoluteUrl } from "@/lib/site-url";
import { parseBillingSnapshot } from "@/lib/orders/billing-snapshot";
import {
  adminNotifyEmail,
  escapeHtml,
  resendFromHeader,
} from "@/lib/email/admin-notify";

/**
 * Préviens l’admin qu’un élève vient de s’inscrire (commande payée).
 * Idempotent via `Order.adminEnrollmentEmailSentAt`.
 */
export async function sendAdminEnrollmentEmailIfNeeded(
  orderId: string
): Promise<void> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, statut: "PAID" },
    include: {
      user: {
        select: { prenom: true, nom: true, email: true, telephone: true },
      },
      orderItems: {
        include: {
          formation: { select: { titre: true } },
          creneau: { select: { nom: true } },
        },
      },
    },
  });
  if (!order || order.adminEnrollmentEmailSentAt) return;

  const snap = parseBillingSnapshot(order.billingSnapshot);
  const prenom = order.user?.prenom ?? snap?.prenom ?? "";
  const nom = order.user?.nom ?? snap?.nom ?? "";
  const email = order.user?.email ?? snap?.email ?? "—";
  const telephone = order.user?.telephone ?? snap?.telephone ?? "—";
  const formations = order.orderItems.map((item) => {
    const creneau = item.creneau?.nom ? ` (${item.creneau.nom})` : "";
    return `${item.formation.titre}${creneau}`;
  });
  const total = Number(order.total).toFixed(2);
  const discount =
    order.discountEuros != null ? Number(order.discountEuros) : 0;
  const promoNote =
    discount > 0
      ? order.promoCodeSnapshot
        ? `Code ${order.promoCodeSnapshot} : −${discount.toFixed(2)} €`
        : `Réduction : −${discount.toFixed(2)} €`
      : null;
  const adminOrderUrl = toAbsoluteUrl("/admin/paiements");

  const ok = await sendAdminEnrollmentEmail({
    studentName: `${prenom} ${nom}`.trim() || "Élève",
    studentEmail: email,
    studentPhone: telephone,
    formations,
    totalEuros: total,
    promoNote,
    adminOrderUrl,
  });

  if (ok) {
    await prisma.order.update({
      where: { id: orderId },
      data: { adminEnrollmentEmailSentAt: new Date() },
    });
  }
}

async function sendAdminEnrollmentEmail(params: {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  formations: string[];
  totalEuros: string;
  promoNote: string | null;
  adminOrderUrl: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = adminNotifyEmail();

  const liste = params.formations
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join("");

  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[sendAdminEnrollmentEmail] RESEND_API_KEY absent — notif admin (dev) :",
        params.studentEmail,
        params.formations
      );
      return true;
    }
    console.error(
      "[sendAdminEnrollmentEmail] RESEND_API_KEY requis en production"
    );
    return false;
  }

  const resend = new Resend(key);

  const { data, error } = await resend.emails.send({
    from: resendFromHeader(),
    to,
    subject: `Nouvelle inscription — ${params.studentName}`,
    html: `
      <div style="font-family:Georgia,serif;line-height:1.6;color:#1a1a1a;max-width:560px">
        <p>Un élève vient de s’inscrire à une formation (paiement confirmé).</p>
        <p>
          <strong>Élève :</strong> ${escapeHtml(params.studentName)}<br />
          <strong>E-mail :</strong> ${escapeHtml(params.studentEmail)}<br />
          <strong>Téléphone :</strong> ${escapeHtml(params.studentPhone)}
        </p>
        <p><strong>Formation(s) :</strong></p>
        <ul>${liste}</ul>
        <p><strong>Montant :</strong> ${escapeHtml(params.totalEuros)} €${
          params.promoNote
            ? `<br /><strong>Promo :</strong> ${escapeHtml(params.promoNote)}`
            : ""
        }</p>
        <p>
          <a href="${escapeHtml(params.adminOrderUrl)}" style="display:inline-block;margin:8px 0;padding:10px 18px;background:#1e3a2f;color:#fff;text-decoration:none;border-radius:6px">Voir les paiements</a>
        </p>
        <p>— Notification automatique ArabeSimplement</p>
      </div>
    `,
  });

  if (error) {
    console.error(
      "[sendAdminEnrollmentEmail] Resend refusé",
      JSON.stringify(error)
    );
    return false;
  }

  if (data?.id) {
    console.info("[sendAdminEnrollmentEmail] envoyé, id Resend:", data.id);
  }
  return true;
}
