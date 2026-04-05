import type { Testimonial } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";

export async function getApprovedTestimonials(): Promise<
  Pick<Testimonial, "id" | "nom" | "texte" | "note">[]
> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    return await prisma.testimonial.findMany({
      where: { approuve: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, nom: true, texte: true, note: true },
    });
  } catch (e) {
    console.error("[getApprovedTestimonials]", e);
    return [];
  }
}

/** Avis approuvés les plus récents (aperçu boutique / fiches). */
export async function getApprovedTestimonialsPreview(
  limit: number
): Promise<Pick<Testimonial, "id" | "nom" | "texte" | "note">[]> {
  const cap = Math.min(Math.max(1, limit), 10);
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    return await prisma.testimonial.findMany({
      where: { approuve: true },
      orderBy: { createdAt: "desc" },
      take: cap,
      select: { id: true, nom: true, texte: true, note: true },
    });
  } catch (e) {
    console.error("[getApprovedTestimonialsPreview]", e);
    return [];
  }
}

export async function getTestimonialsForAdmin(): Promise<Testimonial[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    return await prisma.testimonial.findMany({
      orderBy: [{ approuve: "asc" }, { createdAt: "desc" }],
    });
  } catch (e) {
    console.error("[getTestimonialsForAdmin]", e);
    return [];
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    return await prisma.testimonial.findUnique({ where: { id } });
  } catch (e) {
    console.error("[getTestimonialById]", e);
    return null;
  }
}
