import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, ".next", "routes-manifest.json");
const dest = path.join(root, ".next", "routes-manifest-deterministic.json");

if (!fs.existsSync(src)) {
  console.error("ensure-routes-manifest-deterministic: fichier introuvable:", src);
  process.exit(1);
}

fs.copyFileSync(src, dest);
