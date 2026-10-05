import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { discoveryReadingLevelLabel } from "@/lib/discovery/reading-level";

/** Même e-mail dans cette fenêtre = mise à jour de la fiche (formulaire puis Calendly). */
const SAME_PERSON_WINDOW_MS = 24 * 60 * 60 * 1000;

export type DiscoveryLeadWrite = {
  prenom: string;
  nom: string;
  email: string;
  whatsapp: string;
  pays: string;
  niveau: string;
  calendlyEventUri?: string;
};

export type AdminDiscoveryLead = {
  id: string;
  prenom: string;
  nom: string;
  fullName: string;
  email: string;
  whatsapp: string;
  pays: string;
  niveauId: string;
  niveauLabel: string;
  calendlyEventUri: string | null;
  notes: string | null;
  traite: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminDiscoveryLeadSummary = {
  total: number;
  aTraiter: number;
};

function toAdminLead(row: {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  whatsapp: string;
  pays: string;
  niveau: string;
  calendlyEventUri: string | null;
  notes: string | null;
  traite: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminDiscoveryLead {
  return {
    id: row.id,
    prenom: row.prenom,
    nom: row.nom,
    fullName: `${row.prenom} ${row.nom}`.trim(),
    email: row.email,
    whatsapp: row.whatsapp,
    pays: row.pays,
    niveauId: row.niveau,
    niveauLabel: discoveryReadingLevelLabel(row.niveau),
    calendlyEventUri: row.calendlyEventUri,
    notes: row.notes,
    traite: row.traite,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function persistDiscoveryLead(
  data: DiscoveryLeadWrite
): Promise<void> {
  if (!isDatabaseConfigured()) return;

  const email = data.email.trim().toLowerCase();
  const since = new Date(Date.now() - SAME_PERSON_WINDOW_MS);
  const existing = await prisma.discoveryLead.findFirst({
    where: { email, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });

  const fields = {
    prenom: data.prenom.trim(),
    nom: data.nom.trim(),
    email,
    whatsapp: data.whatsapp.trim(),
    pays: data.pays.trim(),
    niveau: data.niveau.trim(),
    ...(data.calendlyEventUri
      ? { calendlyEventUri: data.calendlyEventUri }
      : {}),
  };

  if (existing) {
    await prisma.discoveryLead.update({
      where: { id: existing.id },
      data: fields,
    });
    return;
  }

  await prisma.discoveryLead.create({ data: fields });
}

export async function getDiscoveryLeadsForAdmin(): Promise<AdminDiscoveryLead[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    const rows = await prisma.discoveryLead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toAdminLead);
  } catch (e) {
    console.error("[getDiscoveryLeadsForAdmin]", e);
    return [];
  }
}

export async function getDiscoveryLeadById(
  id: string
): Promise<AdminDiscoveryLead | null> {
  if (!isDatabaseConfigured()) return null;
  const row = await prisma.discoveryLead.findUnique({ where: { id } });
  return row ? toAdminLead(row) : null;
}

export async function getAdminDiscoveryLeadSummary(): Promise<AdminDiscoveryLeadSummary> {
  if (!isDatabaseConfigured()) return { total: 0, aTraiter: 0 };
  try {
    const [total, aTraiter] = await Promise.all([
      prisma.discoveryLead.count(),
      prisma.discoveryLead.count({ where: { traite: false } }),
    ]);
    return { total, aTraiter };
  } catch (e) {
    console.error("[getAdminDiscoveryLeadSummary]", e);
    return { total: 0, aTraiter: 0 };
  }
}
