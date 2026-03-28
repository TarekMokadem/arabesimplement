"use server";

import { contactSchema, type ContactInput } from "@/lib/validations/contact.schema";
import { saveContactMessage } from "@/lib/data/contact.service";
import { isDatabaseConfigured } from "@/lib/utils/database";

export type ContactResult = { success: true } | { success: false; error: string };

export async function submitContact(data: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const err = parsed.error as { issues?: Array<{ message: string }> };
    const msg = err.issues?.[0]?.message ?? "Données invalides";
    return { success: false, error: msg };
  }

  const d = parsed.data;
  if (isDatabaseConfigured()) {
    try {
      await saveContactMessage({
        nom: d.nom,
        email: d.email,
        telephone: d.telephone,
        sujet: d.sujet,
        message: d.message,
      });
    } catch (e) {
      console.error("[submitContact]", e);
      return {
        success: false,
        error: "Impossible d'enregistrer le message. Réessayez plus tard.",
      };
    }
  }

  if (process.env.RESEND_API_KEY) {
    // TODO: Intégrer Resend pour l'envoi d'email en parallèle
  }

  return { success: true };
}
