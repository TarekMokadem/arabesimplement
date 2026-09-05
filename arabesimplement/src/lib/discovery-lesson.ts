export const DISCOVERY_LESSON_OPEN_EVENT = "as:open-discovery-lesson";

/** Ouvre la popup cours découverte depuis n’importe quel bouton du site. */
export function openDiscoveryLesson() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DISCOVERY_LESSON_OPEN_EVENT));
}
