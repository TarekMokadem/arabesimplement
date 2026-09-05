/** Événement Calendly officiel « cours découverte / conseil ». */
export const CALENDLY_DISCOVERY_EVENT_URL =
  "https://calendly.com/arabeen10/cours-decouverte-conseil";

const CALENDLY_WIDGET_SCRIPT =
  "https://assets.calendly.com/assets/external/widget.js";

type CalendlyApi = {
  initInlineWidget: (options: {
    url: string;
    parentElement: HTMLElement;
  }) => void;
};

export function calendlyDiscoveryUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CALENDLY_DISCOVERY_URL?.trim() ||
    CALENDLY_DISCOVERY_EVENT_URL
  );
}

export function calendlyInlineEmbedUrl(params: {
  baseUrl: string;
  name: string;
  email: string;
}): string {
  const url = new URL(params.baseUrl);
  url.searchParams.set("hide_event_type_details", "1");
  url.searchParams.set("hide_gdpr_banner", "1");
  url.searchParams.set("primary_color", "eef3e7");
  url.searchParams.set("name", params.name);
  url.searchParams.set("email", params.email);
  return url.toString();
}

export function loadCalendlyWidgetScript(): Promise<CalendlyApi> {
  const existing = (window as Window & { Calendly?: CalendlyApi }).Calendly;
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    const already = document.querySelector<HTMLScriptElement>(
      `script[src="${CALENDLY_WIDGET_SCRIPT}"]`
    );
    const onReady = () => {
      const api = (window as Window & { Calendly?: CalendlyApi }).Calendly;
      if (api) resolve(api);
      else reject(new Error("Calendly widget indisponible"));
    };
    if (already) {
      const api = (window as Window & { Calendly?: CalendlyApi }).Calendly;
      if (api) {
        resolve(api);
        return;
      }
      already.addEventListener("load", onReady, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = CALENDLY_WIDGET_SCRIPT;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error("Calendly widget non chargé"));
    document.body.appendChild(script);
  });
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
