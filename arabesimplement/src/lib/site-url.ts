/**
 * URL canonique du site (SEO, Open Graph, e-mails). Sans slash final.
 * Préfixe https:// si l’env ne contient qu’un hôte (ex. Vercel : "xxx.vercel.app").
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? process.env.VERCEL_URL.replace(/\/$/, "")
      : "");
  if (!raw) return "";

  const noTrailingSlash = raw.replace(/\/$/, "");
  if (
    noTrailingSlash.startsWith("http://") ||
    noTrailingSlash.startsWith("https://")
  ) {
    return noTrailingSlash;
  }
  return `https://${noTrailingSlash}`;
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = getSiteUrl();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return base ? `${base}${path}` : path;
}

/**
 * URL absolue pour `return_url` Stripe (3DS / redirect).
 * Dans le navigateur : origine courante (même hôte que la page de paiement).
 */
export function stripeReturnAbsoluteUrl(pathWithQuery: string): string {
  const path = pathWithQuery.startsWith("/")
    ? pathWithQuery
    : `/${pathWithQuery}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  const base = getSiteUrl();
  return base ? `${base}${path}` : path;
}
