"use server";

import { revalidatePath } from "next/cache";
import type { PaypalMeRecipient } from "@prisma/client";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { setSitePaypalMeRecipient } from "@/lib/data/site-config";

export type SiteConfigAdminResult =
  | { success: true }
  | { success: false; error: string };

const ALLOWED: PaypalMeRecipient[] = ["YACINE_BOU18", "JANA_OKF"];

export async function updatePaypalMeRecipientAction(
  recipient: PaypalMeRecipient
): Promise<SiteConfigAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) {
    return { success: false, error: "Non autorisé." };
  }
  if (!ALLOWED.includes(recipient)) {
    return { success: false, error: "Compte PayPal invalide." };
  }
  try {
    await setSitePaypalMeRecipient(recipient);
    revalidatePath("/admin/parametres");
    revalidatePath("/commande/paiement");
    return { success: true };
  } catch {
    return { success: false, error: "Enregistrement impossible." };
  }
}
