"use server";

import { contactSchema, type ContactInput } from "@/lib/validations/contact.schema";

export type ContactResult = { success: true } | { success: false; error: string };

export async function submitContact(data: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const err = parsed.error as { issues?: Array<{ message: string }> };
    const msg = err.issues?.[0]?.message ?? "Données invalides";
    return { success: false, error: msg };
  }

  // Sans Resend/DB configuré : validation OK, on simule l'envoi
  // Quand Resend sera configuré : await sendContactEmail(parsed.data)
  // Quand BDD sera configurée : await prisma.contactMessage.create({ data: parsed.data })
  if (process.env.RESEND_API_KEY) {
    // TODO: Intégrer Resend pour l'envoi d'email
    // await sendEmail({ to: 'contact@arabesimplement.fr', ... })
  }

  return { success: true };
}
