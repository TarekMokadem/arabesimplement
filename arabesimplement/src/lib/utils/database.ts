/**
 * Indique si une base PostgreSQL réelle est configurée (hors placeholder CI / Vercel).
 */
export function isDatabaseConfigured(): boolean {
  return (
    !!process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("placeholder")
  );
}
