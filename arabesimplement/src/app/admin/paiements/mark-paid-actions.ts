"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { ensureEnrollmentsForPaidOrder } from "@/lib/orders/fulfill-order";

export type MarkOrderPaidResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Après paiement hors Stripe (ex. PayPal.me direct) : marque la commande payée et
 * exécute la même chaîne que le webhook (inscriptions, e-mail, créneaux).
 * Interdit si un abonnement Stripe est attaché (à régler via Stripe / webhooks).
 */
export async function markOrderPaidManuallyAsAdmin(
  orderId: string
): Promise<MarkOrderPaidResult> {
  const admin = await requireAdminSession();
  if (!admin) {
    return { success: false, error: "Non autorisé." };
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId },
    select: {
      statut: true,
      stripeSubscriptionId: true,
      stripePaymentIntentId: true,
    },
  });

  if (!order) {
    return { success: false, error: "Commande introuvable." };
  }
  if (order.statut !== "PENDING") {
    return {
      success: false,
      error: "Seules les commandes en attente peuvent être validées ainsi.",
    };
  }

  const sid = order.stripeSubscriptionId;
  const stripeTunnelCompletesAutomatically =
    (order.stripePaymentIntentId != null &&
      order.stripePaymentIntentId !== "") ||
    (sid != null && sid !== "" && !sid.startsWith("mock_sub_"));

  if (stripeTunnelCompletesAutomatically) {
    return {
      success: false,
      error:
        "Cette commande passe par Stripe : le statut « Payé » est appliqué automatiquement après confirmation du paiement (webhook ou retour boutique).",
    };
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { statut: "PAID" },
    });
    await ensureEnrollmentsForPaidOrder(orderId);
  } catch (e) {
    console.error("[markOrderPaidManuallyAsAdmin]", e);
    return {
      success: false,
      error:
        "La commande n’a pas pu être finalisée complètement. Vérifiez les logs ou la base.",
    };
  }

  revalidatePath("/admin/paiements");
  revalidatePath("/admin");
  revalidatePath("/tableau-de-bord");
  return { success: true };
}
