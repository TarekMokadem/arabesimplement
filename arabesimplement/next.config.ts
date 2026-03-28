import type { NextConfig } from "next";
import path from "path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  // Force la résolution des modules depuis ce dossier (évite conflit avec package.json parent)
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "arche-informatique.com",
      },
      /* Ajoutez d’autres hostname ici pour chaque domaine d’images utilisé en admin (URL absolues). */
    ],
  },
};

export default nextConfig;
