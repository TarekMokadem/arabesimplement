import type { ContactMessage } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";

export type ContactMessageInput = {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
};

export async function saveContactMessage(
  data: ContactMessageInput
): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await prisma.contactMessage.create({
    data: {
      nom: data.nom.trim(),
      email: data.email.trim().toLowerCase(),
      telephone: data.telephone?.trim() || null,
      sujet: data.sujet.trim(),
      message: data.message.trim(),
    },
  });
}

export async function getContactMessagesForAdmin(): Promise<ContactMessage[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("[getContactMessagesForAdmin]", e);
    return [];
  }
}
