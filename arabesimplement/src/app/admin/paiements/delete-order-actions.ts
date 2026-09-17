"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteOrderFromHistory } from "@/lib/orders/delete-order";

export type DeleteOrderAdminResult =
  | { success: true; deleted: number; failed: number }
  | { success: false; error: string };

function revalidatePaymentHistory(): void {
  revalidatePath("/admin/paiements");
  revalidatePath("/admin");
  revalidatePath("/tableau-de-bord");
  revalidatePath("/historique-achats");
}

export async function deleteOrderAsAdmin(
  orderId: string
): Promise<DeleteOrderAdminResult> {
  return deleteOrdersAsAdmin([orderId]);
}

export async function deleteOrdersAsAdmin(
  orderIds: string[]
): Promise<DeleteOrderAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) {
    return { success: false, error: "Non autorisé." };
  }

  const ids = [...new Set(orderIds.map((id) => id.trim()).filter(Boolean))];
  if (ids.length === 0) {
    return { success: false, error: "Aucune ligne sélectionnée." };
  }

  let deleted = 0;
  let failed = 0;
  let lastError = "Suppression impossible.";
  for (const id of ids) {
    const result = await deleteOrderFromHistory(id);
    if (result.success) {
      deleted += 1;
    } else {
      failed += 1;
      lastError = result.error;
    }
  }

  if (deleted === 0) {
    return { success: false, error: lastError };
  }

  revalidatePaymentHistory();
  return { success: true, deleted, failed };
}
