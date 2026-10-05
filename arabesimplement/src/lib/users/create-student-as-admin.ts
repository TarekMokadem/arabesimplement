import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import {
  generateProvisionalPassword,
  hashPassword,
} from "@/lib/auth/password";
import { sendWelcomeCredentialsEmail } from "@/lib/email/send-welcome-credentials";
import type { AdminUserCreateInput } from "@/lib/validations/admin-user.schema";

export type CreateStudentAsAdminResult =
  | {
      success: true;
      userId: string;
      plainPassword: string;
      emailed: boolean;
    }
  | { success: false; error: string };

export async function createStudentAsAdmin(
  data: AdminUserCreateInput
): Promise<CreateStudentAsAdminResult> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Base de données non configurée." };
  }

  const email = data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return { success: false, error: "Cet email est déjà utilisé." };
  }

  const plainPassword = generateProvisionalPassword();
  const passwordHash = await hashPassword(plainPassword);

  try {
    const user = await prisma.user.create({
      data: {
        prenom: data.prenom.trim(),
        nom: data.nom.trim(),
        email,
        telephone: data.telephone?.trim() || null,
        sexe: data.sexe ?? null,
        role: data.role,
        passwordHash,
      },
      select: { id: true, prenom: true, email: true },
    });

    let emailed = false;
    if (data.sendCredentials !== false) {
      emailed = await sendWelcomeCredentialsEmail({
        to: user.email,
        prenom: user.prenom,
        plainPassword,
        createdByAdmin: true,
      });
    }

    return {
      success: true,
      userId: user.id,
      plainPassword,
      emailed,
    };
  } catch (e) {
    console.error("[createStudentAsAdmin]", e);
    return { success: false, error: "Création du client impossible." };
  }
}
