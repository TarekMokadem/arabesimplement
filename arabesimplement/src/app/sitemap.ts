import type { MetadataRoute } from "next";
import { getFormationSlugsForStaticParams } from "@/lib/data/formations.service";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_PATHS = [
  "/",
  "/boutique",
  "/par-ou-commencer",
  "/comment-ca-marche",
  "/cours-darabe",
  "/temoignages",
  "/notre-parcours",
  "/contactez-nous",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/tajwid",
  "/cours-de-din",
  "/connexion",
  "/inscription",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const lastMod = new Date();
  const slugs = await getFormationSlugsForStaticParams();

  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS.map((path) => ({
      url: base ? `${base}${path}` : path,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...slugs.map((slug) => ({
      url: base ? `${base}/boutique/${slug}` : `/boutique/${slug}`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return entries;
}
