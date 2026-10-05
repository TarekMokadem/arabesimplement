"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  adminRecordedOrderSchema,
  type AdminRecordedOrderInput,
} from "@/lib/validations/admin-recorded-order.schema";
import { createAdminRecordedOrder } from "@/lib/orders/create-admin-recorded-order";

export type CreateRecordedOrderAdminResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

function zodFirstMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Données invalides";
}

export async function createRecordedOrderAsAdmin(
  data: AdminRecordedOrderInput
): Promise<CreateRecordedOrderAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = adminRecordedOrderSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  const result = await createAdminRecordedOrder(parsed.data);
  if (result.success) {
    revalidatePath("/admin/paiements");
    revalidatePath(`/admin/paiements/${result.orderId}`);
    revalidatePath("/admin/utilisateurs");
    revalidatePath(`/admin/utilisateurs/${parsed.data.userId}`);
    revalidatePath("/admin");
    revalidatePath("/tableau-de-bord");
  }
  return result;
}
