/**
 * Génère favicon / icon / apple-icon à partir du logo marque (cercle, fond transparent).
 * Usage : node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = join(root, "public/brand/logo-arabe-simplement.png");
const appDir = join(root, "src/app");

function circleMaskSvg(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${r}" cy="${r}" r="${r}" fill="white"/>
    </svg>`
  );
}

/** Logo source : cercle centré sur fond noir — rognage puis masque circulaire. */
async function buildCircularLogo(pixels) {
  const trimmed = await sharp(source)
    .trim({ background: "#000000", threshold: 12 })
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  const side = Math.min(meta.width ?? pixels, meta.height ?? pixels);

  const square = await sharp(trimmed)
    .resize(side, side, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .composite([{ input: circleMaskSvg(side), blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(square).resize(pixels, pixels, { kernel: "lanczos3" }).png();
}

async function main() {
  const icon32 = await buildCircularLogo(32);
  const icon16 = await buildCircularLogo(16);
  const apple180 = await buildCircularLogo(180);

  await icon32.toFile(join(appDir, "icon.png"));

  const buf16 = await icon16.toBuffer();
  const buf32 = await icon32.toBuffer();
  const ico = await pngToIco([buf16, buf32]);
  writeFileSync(join(appDir, "favicon.ico"), ico);

  await apple180.toFile(join(appDir, "apple-icon.png"));

  console.log("OK: src/app/icon.png (32), favicon.ico (16+32), apple-icon.png (180)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
