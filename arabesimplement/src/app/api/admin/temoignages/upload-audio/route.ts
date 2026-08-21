import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  isCloudinaryConfigured,
  uploadTestimonialAudioToCloudinary,
} from "@/lib/cloudinary/server-upload";

const MIME_TO_EXT: Record<string, string> = {
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "audio/webm": ".webm",
  "audio/ogg": ".ogg",
  "audio/mp4": ".m4a",
  "audio/x-m4a": ".m4a",
  "audio/aac": ".aac",
};

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Fichier manquant" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return Response.json(
      { error: "Fichier trop volumineux (maximum 4 Mo)" },
      { status: 400 }
    );
  }

  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    return Response.json(
      { error: "Format non pris en charge (MP3, WAV, WebM, OGG ou M4A)" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (isCloudinaryConfigured()) {
    try {
      const { url } = await uploadTestimonialAudioToCloudinary(
        buffer,
        file.type
      );
      return Response.json({ url });
    } catch (e) {
      console.error("[upload-audio] Cloudinary", e);
      return Response.json(
        { error: "Échec de l’envoi vers Cloudinary. Vérifiez les clés API." },
        { status: 502 }
      );
    }
  }

  const name = `${nanoid()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "testimonials");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  const url = `/uploads/testimonials/${name}`;
  return Response.json({ url });
}
