import type { DiscoveryLeadInput } from "@/lib/validations/discovery-lead.schema";

type DiscoveryLeadNotifyResult =
  | { success: true }
  | { success: false; error: string };

export const DISCOVERY_LESSON_OPEN_EVENT = "as:open-discovery-lesson";

/** Ouvre la popup cours découverte depuis n’importe quel bouton du site. */
export function openDiscoveryLesson() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DISCOVERY_LESSON_OPEN_EVENT));
}

/** POST hors server action : n’active pas la barre de navigation Next.js. */
export async function notifyDiscoveryLead(
  data: DiscoveryLeadInput
): Promise<DiscoveryLeadNotifyResult> {
  try {
    const response = await fetch("/api/discovery-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json()) as DiscoveryLeadNotifyResult;
    if (payload?.success) return { success: true };
    return {
      success: false,
      error:
        payload && "error" in payload
          ? payload.error
          : "Impossible d’envoyer la demande. Réessayez dans un instant.",
    };
  } catch {
    return {
      success: false,
      error: "Impossible d’envoyer la demande. Réessayez dans un instant.",
    };
  }
}
