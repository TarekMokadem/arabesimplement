import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Envoie une image vers Cloudinary (dossier formations).
 * Nécessite CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 */
export async function uploadFormationImageToCloudinary(
  buffer: Buffer,
  mimeType: string
): Promise<{ url: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary non configuré");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  const b64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "arabesimplement/formations",
    resource_type: "image",
    overwrite: false,
    unique_filename: true,
  });
  return { url: result.secure_url };
}
