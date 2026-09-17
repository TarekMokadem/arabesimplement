"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { deleteOrderFromHistory } from "@/lib/orders/delete-order";

export type DeleteOrderAdminResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteOrderAsAdmin(
  orderId: string
): Promise<DeleteOrderAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) {
    return { success: false, error: "Non autorisé." };
  }

  const result = await deleteOrderFromHistory(orderId);
  if (!result.success) {
    return result;
  }

  revalidatePath("/admin/paiements");
  revalidatePath("/admin");
  revalidatePath("/tableau-de-bord");
  revalidatePath("/historique-achats");
  return { success: true };
}
