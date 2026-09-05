/** Événement Calendly officiel « cours découverte / conseil ». */
export const CALENDLY_DISCOVERY_EVENT_URL =
  "https://calendly.com/arabeen10/cours-decouverte-conseil";

/**
 * Thème embed Calendly — mêmes teintes que `globals.css`.
 * `primary` = boutons / liens / jour sélectionné (texte blanc dessus).
 * Un primaire trop clair (ex. mint) rend ce texte illisible.
 */
const CALENDLY_THEME = {
  primary: "324530",
  text: "121212",
  background: "ffffff",
} as const;

export function calendlyDiscoveryUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CALENDLY_DISCOVERY_URL?.trim() ||
    CALENDLY_DISCOVERY_EVENT_URL
  );
}

/** Iframe inline (évite widget.js qui plante si `.calendly-inline-widget` n’a pas de `data-url`). */
export function calendlyInlineEmbedUrl(params: {
  baseUrl: string;
  name: string;
  email: string;
  host: string;
}): string {
  const eventUrl = params.baseUrl.split("?")[0] || CALENDLY_DISCOVERY_EVENT_URL;
  const url = new URL(eventUrl);
  url.searchParams.set("embed_domain", params.host);
  url.searchParams.set("embed_type", "Inline");
  url.searchParams.set("hide_event_type_details", "1");
  url.searchParams.set("hide_gdpr_banner", "1");
  url.searchParams.set("background_color", CALENDLY_THEME.background);
  url.searchParams.set("text_color", CALENDLY_THEME.text);
  url.searchParams.set("primary_color", CALENDLY_THEME.primary);
  url.searchParams.set("name", params.name);
  url.searchParams.set("email", params.email);
  return url.toString();
}

export function isCalendlyOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return host === "calendly.com" || host.endsWith(".calendly.com");
  } catch {
    return false;
  }
}

export function calendlyScheduledEventUri(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const event = (data as { event?: unknown }).event;
  if (event !== "calendly.event_scheduled") return null;
  const payload = (data as { payload?: { event?: { uri?: unknown } } }).payload;
  const uri = payload?.event?.uri;
  return typeof uri === "string" && uri.startsWith("https://") ? uri : null;
}
