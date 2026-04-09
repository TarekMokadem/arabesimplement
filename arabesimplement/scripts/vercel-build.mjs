/**
 * Build Vercel : le CLI peut faire un lstat sur routes-manifest-deterministic.json
 * dès que le processus `next build` se termine, avant que `&&` ne lance un second script.
 * On enveloppe next pour copier routes-manifest.json → routes-manifest-deterministic.json
 * dans le même processus parent, dès que le manifeste existe et au exit du child.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dotNext = path.join(root, ".next");
const src = path.join(dotNext, "routes-manifest.json");
const dest = path.join(dotNext, "routes-manifest-deterministic.json");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

function syncManifest() {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  } catch {
    /* build en cours, fichier verrouillé ou partiel : on retente au prochain poll */
  }
}

fs.mkdirSync(dotNext, { recursive: true });

const poll = setInterval(syncManifest, 250);

let watcher;
try {
  watcher = fs.watch(dotNext, { persistent: true }, (_evt, filename) => {
    if (filename === "routes-manifest.json" || filename == null) {
      syncManifest();
    }
  });
} catch {
  watcher = null;
}

const child = spawn(process.execPath, [nextBin, "build"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

child.on("error", (err) => {
  clearInterval(poll);
  if (watcher) {
    watcher.close();
  }
  console.error("vercel-build:", err);
  process.exit(1);
});

child.on("close", (code, signal) => {
  clearInterval(poll);
  if (watcher) {
    watcher.close();
  }
  syncManifest();

  if (code !== 0) {
    process.exit(code ?? 1);
  }

  if (!fs.existsSync(dest)) {
    console.error(
      "vercel-build: impossible de créer .next/routes-manifest-deterministic.json (source absente ?)",
    );
    process.exit(1);
  }
});
