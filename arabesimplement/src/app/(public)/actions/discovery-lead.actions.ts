"use server";

import {
  discoveryLeadSchema,
  type DiscoveryLeadInput,
} from "@/lib/validations/discovery-lead.schema";
import { sendDiscoveryLeadEmail } from "@/lib/email/send-discovery-lead";

export type DiscoveryLeadResult =
  | { success: true }
  | { success: false; error: string };

export async function submitDiscoveryLead(
  data: DiscoveryLeadInput
): Promise<DiscoveryLeadResult> {
  const parsed = discoveryLeadSchema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Données invalides";
    return { success: false, error: msg };
  }

  if (parsed.data.website?.trim()) {
    return { success: true };
  }

  const ok = await sendDiscoveryLeadEmail({
    prenom: parsed.data.prenom.trim(),
    nom: parsed.data.nom.trim(),
    email: parsed.data.email.trim(),
    whatsapp: parsed.data.whatsapp.trim(),
    calendlyEventUri: parsed.data.calendlyEventUri,
  });

  if (!ok) {
    return {
      success: false,
      error: "Impossible d’envoyer la demande. Réessayez dans un instant.",
    };
  }

  return { success: true };
}
