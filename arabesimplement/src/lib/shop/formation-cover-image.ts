/**
 * Domaines autorisés pour `next/image` (doivent rester alignés avec `next.config.ts` `images.remotePatterns`).
 * Les autres URLs HTTPS sont affichées avec `<img>` pour éviter un crash serveur au rendu.
 */
export function isNextImageRemoteSrcAllowed(src: string): boolean {
  const s = src.trim();
  if (!s) return false;
  if (s.startsWith("/")) return true;
  if (!s.startsWith("http://") && !s.startsWith("https://")) return false;
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    return (
      h === "images.unsplash.com" ||
      h === "res.cloudinary.com" ||
      h === "www.arabesimplement.fr" ||
      h === "arabesimplement.fr" ||
      h === "arche-informatique.com" ||
      h.endsWith(".supabase.co") ||
      h.endsWith("public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}
