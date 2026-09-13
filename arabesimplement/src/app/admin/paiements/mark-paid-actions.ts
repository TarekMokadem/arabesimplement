"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { confirmPendingOrderAsReceived } from "@/lib/orders/confirm-manual-payment";

export type MarkOrderPaidResult =
  | { success: true }
  | { success: false; error: string };

/**
 * L’admin confirme avoir reçu le règlement (PayPal.me, virement, ou PayPal
 * déjà encaissé côté Stripe sans webhook).
 */
export async function markOrderPaidManuallyAsAdmin(
  orderId: string
): Promise<MarkOrderPaidResult> {
  const admin = await requireAdminSession();
  if (!admin) {
    return { success: false, error: "Non autorisé." };
  }

  const result = await confirmPendingOrderAsReceived(orderId);
  if (!result.success) {
    return result;
  }

  revalidatePath("/admin/paiements");
  revalidatePath("/admin");
  revalidatePath("/tableau-de-bord");
  revalidatePath("/historique-achats");
  return { success: true };
}
