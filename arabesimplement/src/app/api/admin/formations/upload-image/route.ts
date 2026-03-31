import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { requireAdminSession } from "@/lib/auth/require-admin";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_BYTES = 5 * 1024 * 1024;

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
      { error: "Fichier trop volumineux (maximum 5 Mo)" },
      { status: 400 }
    );
  }

  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    return Response.json(
      { error: "Format non pris en charge (JPEG, PNG, WebP ou GIF)" },
      { status: 400 }
    );
  }

  const name = `${nanoid()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "formations");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);

  const url = `/uploads/formations/${name}`;
  return Response.json({ url });
}
