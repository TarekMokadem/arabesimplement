import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/tableau-de-bord", "/commande"],
    },
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
