import { revalidatePath } from "next/cache";
import { discoveryLeadSchema } from "@/lib/validations/discovery-lead.schema";
import { sendDiscoveryLeadEmail } from "@/lib/email/send-discovery-lead";
import { discoveryReadingLevelLabel } from "@/lib/discovery/reading-level";
import { persistDiscoveryLead } from "@/lib/data/discovery-leads.service";
import { isDatabaseConfigured } from "@/lib/utils/database";

export type DiscoveryLeadResult =
  | { success: true }
  | { success: false; error: string };

function revalidateDiscoveryInbox(): void {
  revalidatePath("/admin/cours-decouverte");
  revalidatePath("/admin");
}

export async function recordDiscoveryLead(
  data: unknown
): Promise<DiscoveryLeadResult> {
  const parsed = discoveryLeadSchema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Données invalides";
    return { success: false, error: msg };
  }

  if (parsed.data.website?.trim()) {
    return { success: true };
  }

  const lead = {
    prenom: parsed.data.prenom.trim(),
    nom: parsed.data.nom.trim(),
    email: parsed.data.email.trim(),
    whatsapp: parsed.data.whatsapp.trim(),
    pays: parsed.data.pays,
    niveau: parsed.data.niveau,
    calendlyEventUri: parsed.data.calendlyEventUri,
  };

  let stored = false;
  if (isDatabaseConfigured()) {
    try {
      await persistDiscoveryLead(lead);
      stored = true;
      revalidateDiscoveryInbox();
    } catch (e) {
      console.error("[recordDiscoveryLead] persist", e);
      return {
        success: false,
        error: "Impossible d’enregistrer la demande. Réessayez dans un instant.",
      };
    }
  }

  const emailed = await sendDiscoveryLeadEmail({
    prenom: lead.prenom,
    nom: lead.nom,
    email: lead.email,
    whatsapp: lead.whatsapp,
    pays: lead.pays,
    niveauLabel: discoveryReadingLevelLabel(lead.niveau),
    calendlyEventUri: lead.calendlyEventUri,
  });

  if (!stored && !emailed) {
    return {
      success: false,
      error: "Impossible d’envoyer la demande. Réessayez dans un instant.",
    };
  }

  if (stored && !emailed) {
    console.error(
      "[recordDiscoveryLead] e-mail admin non envoyé — fiche déjà enregistrée"
    );
  }

  return { success: true };
}
