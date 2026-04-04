import { prisma } from "@/lib/prisma";
import { parseBillingSnapshot } from "@/lib/orders/billing-snapshot";
import { isDatabaseConfigured } from "@/lib/utils/database";

export type OrderConfirmationLine = {
  id: string;
  formationTitre: string;
  schedulingMode: string;
  creneauLabel: string | null;
  hourlyMinutes: number | null;
  hourlyQuantity: number;
  unitPriceEuros: number;
  lineTotalEuros: number;
};

export type OrderConfirmationView = {
  orderId: string;
  statut: "PAID" | "PENDING";
  totalEuros: number;
  createdAt: string;
  billing: { prenom: string; nom: string; email: string };
  lines: OrderConfirmationLine[];
  /** Abonnement Stripe cours à la carte rattaché à cette commande. */
  hasWeeklySubscription: boolean;
};

function normalizeEmail(e: string): string {
  return e.trim().toLowerCase();
}

/**
 * Détail de commande pour la page de confirmation (paiement réussi ou en cours de webhook).
 * Accès : e-mail facturation (lien) ou utilisateur connecté propriétaire de la commande.
 */
export async function getOrderConfirmationView(
  orderId: string | null | undefined,
  options: {
    viewerEmail: string | null | undefined;
    viewerUserId: string | null | undefined;
  }
): Promise<OrderConfirmationView | null> {
  if (!orderId?.trim() || !isDatabaseConfigured()) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId.trim() },
    include: {
      orderItems: {
        include: {
          formation: { select: { titre: true, schedulingMode: true } },
          creneau: {
            select: {
              nom: true,
            },
          },
        },
      },
    },
  });

  if (!order || (order.statut !== "PAID" && order.statut !== "PENDING")) {
    return null;
  }

  const snap = parseBillingSnapshot(order.billingSnapshot);
  if (!snap) {
    return null;
  }

  const emailNorm = options.viewerEmail?.trim()
    ? normalizeEmail(options.viewerEmail)
    : null;
  const emailMatch = emailNorm != null && snap.email === emailNorm;
  const userMatch =
    options.viewerUserId != null && order.userId === options.viewerUserId;

  if (!emailMatch && !userMatch) {
    return null;
  }

  const lines: OrderConfirmationLine[] = order.orderItems.map((oi) => {
    const unit = Number(oi.prixUnitaire);
    const qty = Math.max(1, oi.hourlyQuantity ?? 1);
    const lineTotal = unit * qty;
    return {
      id: oi.id,
      formationTitre: oi.formation.titre,
      schedulingMode: oi.formation.schedulingMode,
      creneauLabel: oi.creneau?.nom ?? null,
      hourlyMinutes: oi.hourlyMinutes,
      hourlyQuantity: qty,
      unitPriceEuros: unit,
      lineTotalEuros: lineTotal,
    };
  });

  const statut: "PAID" | "PENDING" =
    order.statut === "PAID" ? "PAID" : "PENDING";

  return {
    orderId: order.id,
    statut,
    totalEuros: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    billing: {
      prenom: snap.prenom,
      nom: snap.nom,
      email: snap.email,
    },
    lines,
    hasWeeklySubscription:
      order.stripeSubscriptionId != null &&
      order.stripeSubscriptionId.length > 0,
  };
}
