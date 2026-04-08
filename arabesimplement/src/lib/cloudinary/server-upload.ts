import { v2 as cloudinary } from "cloudinary";

function envTrim(name: string): string | undefined {
  const v = process.env[name];
  const t = v?.trim();
  return t && t.length > 0 ? t : undefined;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    envTrim("CLOUDINARY_CLOUD_NAME") &&
      envTrim("CLOUDINARY_API_KEY") &&
      envTrim("CLOUDINARY_API_SECRET")
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
  const cloudName = envTrim("CLOUDINARY_CLOUD_NAME");
  const apiKey = envTrim("CLOUDINARY_API_KEY");
  const apiSecret = envTrim("CLOUDINARY_API_SECRET");
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary non configuré");
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
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
