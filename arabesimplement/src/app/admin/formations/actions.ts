"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import {
  formationAdminSchema,
  creneauAdminSchema,
  type FormationAdminInput,
  type CreneauAdminInput,
} from "@/lib/validations/admin-formations.schema";

export type AdminMutationResult =
  | { success: true; id?: string }
  | { success: false; error: string };

function zodFirstMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Données invalides";
}

async function clearOtherFeatured(exceptId?: string) {
  await prisma.formation.updateMany({
    where: exceptId ? { id: { not: exceptId } } : {},
    data: { featured: false },
  });
}

function heureNormalisee(h: string): string {
  const [a, b] = h.split(":");
  const hh = a?.padStart(2, "0") ?? "00";
  const mm = b?.padStart(2, "0") ?? "00";
  return `${hh}:${mm}`;
}

function formationToPrismaData(input: FormationAdminInput) {
  return {
    titre: input.titre.trim(),
    slug: input.slug.trim().toLowerCase(),
    descriptionCourte: input.descriptionCourte.trim(),
    description: input.description?.trim() || null,
    prix: new Prisma.Decimal(input.prix.toFixed(2)),
    prixPromo:
      input.prixPromo != null && !Number.isNaN(input.prixPromo)
        ? new Prisma.Decimal(input.prixPromo.toFixed(2))
        : null,
    imageUrl: input.imageUrl?.trim() || null,
    placesMax: input.placesMax ?? null,
    categorie: input.categorie.trim(),
    schedulingMode: input.schedulingMode,
    statut: input.statut,
    featured: input.featured,
    featuredTitre: input.featuredTitre?.trim() || null,
    featuredContent: input.featuredContent?.trim() || null,
    featuredBadge: input.featuredBadge?.trim() || null,
    featuredExpiresAt: input.featuredExpiresAt ?? null,
  };
}

export async function createFormation(
  data: FormationAdminInput
): Promise<AdminMutationResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = formationAdminSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  const slug = parsed.data.slug.trim().toLowerCase();
  const exists = await prisma.formation.findUnique({ where: { slug } });
  if (exists) {
    return { success: false, error: "Ce slug est déjà utilisé." };
  }

  try {
    if (parsed.data.featured) {
      await clearOtherFeatured();
    }
    const row = await prisma.formation.create({
      data: formationToPrismaData({ ...parsed.data, slug }),
    });
    revalidatePath("/admin/formations");
    revalidatePath("/boutique");
    revalidatePath(`/boutique/${row.slug}`);
    revalidatePath("/");
    return { success: true, id: row.id };
  } catch (e) {
    console.error("[createFormation]", e);
    return { success: false, error: "Création impossible." };
  }
}

export async function updateFormation(
  id: string,
  data: FormationAdminInput
): Promise<AdminMutationResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = formationAdminSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  const current = await prisma.formation.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });
  if (!current) return { success: false, error: "Formation introuvable." };

  const slug = parsed.data.slug.trim().toLowerCase();
  if (slug !== current.slug) {
    const taken = await prisma.formation.findFirst({
      where: { slug, NOT: { id } },
    });
    if (taken) {
      return { success: false, error: "Ce slug est déjà utilisé." };
    }
  }

  try {
    if (parsed.data.featured) {
      await clearOtherFeatured(id);
    }
    await prisma.formation.update({
      where: { id },
      data: formationToPrismaData({ ...parsed.data, slug }),
    });
    revalidatePath("/admin/formations");
    revalidatePath(`/admin/formations/${id}`);
    revalidatePath("/boutique");
    revalidatePath(`/boutique/${slug}`);
    revalidatePath(`/boutique/${current.slug}`);
    revalidatePath("/");
    return { success: true, id };
  } catch (e) {
    console.error("[updateFormation]", e);
    return { success: false, error: "Mise à jour impossible." };
  }
}

export async function deleteFormation(id: string): Promise<AdminMutationResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const f = await prisma.formation.findUnique({
    where: { id },
    include: {
      _count: { select: { orderItems: true, enrollments: true } },
    },
  });
  if (!f) return { success: false, error: "Formation introuvable." };
  if (f._count.orderItems > 0 || f._count.enrollments > 0) {
    return {
      success: false,
      error:
        "Suppression impossible : des commandes ou inscriptions y sont liées. Passez le statut à « Archivée ».",
    };
  }

  try {
    await prisma.formation.delete({ where: { id } });
    revalidatePath("/admin/formations");
    revalidatePath("/boutique");
    revalidatePath(`/boutique/${f.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("[deleteFormation]", e);
    return { success: false, error: "Suppression impossible." };
  }
}

export async function createCreneau(
  formationId: string,
  data: CreneauAdminInput
): Promise<AdminMutationResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = creneauAdminSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  const formation = await prisma.formation.findUnique({
    where: { id: formationId },
    select: { id: true },
  });
  if (!formation) return { success: false, error: "Formation introuvable." };

  const slots = parsed.data.journeeSlots.map((s) => ({
    jour: s.jour.trim(),
    heureDebut: heureNormalisee(s.heureDebut),
    dureeMinutes: s.dureeMinutes,
  }));
  const jours = [...new Set(slots.map((s) => s.jour))];
  const first = slots[0]!;
  try {
    const row = await prisma.creneau.create({
      data: {
        formationId,
        nom: parsed.data.nom.trim(),
        jours,
        journeeSlots: slots as unknown as Prisma.InputJsonValue,
        heureDebut: first.heureDebut,
        dureeMinutes: first.dureeMinutes,
        placesMax: parsed.data.placesMax,
        whatsappLink: parsed.data.whatsappLink?.trim() || null,
        statut: parsed.data.statut,
      },
    });
    revalidatePath(`/admin/formations/${formationId}`);
    revalidatePath("/boutique");
    const f = await prisma.formation.findUnique({
      where: { id: formationId },
      select: { slug: true },
    });
    if (f) revalidatePath(`/boutique/${f.slug}`);
    return { success: true, id: row.id };
  } catch (e) {
    console.error("[createCreneau]", e);
    return { success: false, error: "Créneau non créé." };
  }
}

export async function updateCreneau(
  creneauId: string,
  data: CreneauAdminInput
): Promise<AdminMutationResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const parsed = creneauAdminSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: zodFirstMessage(parsed.error) };
  }

  const c = await prisma.creneau.findUnique({
    where: { id: creneauId },
    select: { formationId: true },
  });
  if (!c) return { success: false, error: "Créneau introuvable." };

  const slots = parsed.data.journeeSlots.map((s) => ({
    jour: s.jour.trim(),
    heureDebut: heureNormalisee(s.heureDebut),
    dureeMinutes: s.dureeMinutes,
  }));
  const jours = [...new Set(slots.map((s) => s.jour))];
  const first = slots[0]!;
  try {
    await prisma.creneau.update({
      where: { id: creneauId },
      data: {
        nom: parsed.data.nom.trim(),
        jours,
        journeeSlots: slots as unknown as Prisma.InputJsonValue,
        heureDebut: first.heureDebut,
        dureeMinutes: first.dureeMinutes,
        placesMax: parsed.data.placesMax,
        whatsappLink: parsed.data.whatsappLink?.trim() || null,
        statut: parsed.data.statut,
      },
    });
    revalidatePath(`/admin/formations/${c.formationId}`);
    revalidatePath("/boutique");
    const f = await prisma.formation.findUnique({
      where: { id: c.formationId },
      select: { slug: true },
    });
    if (f) revalidatePath(`/boutique/${f.slug}`);
    return { success: true, id: creneauId };
  } catch (e) {
    console.error("[updateCreneau]", e);
    return { success: false, error: "Créneau non mis à jour." };
  }
}

export async function deleteCreneau(creneauId: string): Promise<AdminMutationResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const c = await prisma.creneau.findUnique({
    where: { id: creneauId },
    include: { _count: { select: { enrollments: true } } },
  });
  if (!c) return { success: false, error: "Créneau introuvable." };
  if (c._count.enrollments > 0) {
    return {
      success: false,
      error:
        "Ce créneau a des inscriptions. Réassignez-les avant suppression.",
    };
  }

  const formationId = c.formationId;
  try {
    await prisma.creneau.delete({ where: { id: creneauId } });
    revalidatePath(`/admin/formations/${formationId}`);
    revalidatePath("/boutique");
    const f = await prisma.formation.findUnique({
      where: { id: formationId },
      select: { slug: true },
    });
    if (f) revalidatePath(`/boutique/${f.slug}`);
    return { success: true };
  } catch (e) {
    console.error("[deleteCreneau]", e);
    return { success: false, error: "Suppression impossible." };
  }
}
