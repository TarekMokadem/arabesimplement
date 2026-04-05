import { randomBytes } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { sendWelcomeCredentialsEmail } from "@/lib/email/send-welcome-credentials";
import {
  parseBillingSnapshot,
  type OrderBillingSnapshot,
} from "@/lib/orders/billing-snapshot";

function generateProvisionalPassword(): string {
  return randomBytes(12).toString("base64url").slice(0, 16);
}

/**
 * Après paiement réussi : rattache un compte à la commande invité (création ou compte existant sans mot de passe),
 * ou lie la commande à un compte existant qui a déjà un mot de passe (course rare).
 */
export async function attachUserToPaidGuestOrder(
  orderId: string
): Promise<string | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      userId: true,
      statut: true,
      billingSnapshot: true,
      stripeCustomerId: true,
    },
  });

  if (!order || order.statut !== "PAID" || order.userId) {
    return order?.userId ?? null;
  }

  const snap = parseBillingSnapshot(order.billingSnapshot);
  if (!snap) {
    console.error("[attachUserToPaidGuestOrder] billingSnapshot invalide", orderId);
    return null;
  }

  const { userId, credsEmail } = await prisma.$transaction(async (tx) => {
    const fresh = await tx.order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });
    if (fresh?.userId) {
      return { userId: fresh.userId, credsEmail: null as null | { to: string; prenom: string; plainPassword: string } };
    }

    return resolveOrCreateStudent(tx, orderId, snap);
  });

  if (credsEmail) {
    const ok = await sendWelcomeCredentialsEmail(credsEmail);
    if (ok) {
      await prisma.order.update({
        where: { id: orderId },
        data: { purchaseFollowupEmailSentAt: new Date() },
      });
    }
  }

  if (userId && order.stripeCustomerId) {
    await prisma.user.updateMany({
      where: { id: userId, stripeCustomerId: null },
      data: { stripeCustomerId: order.stripeCustomerId },
    });
  }

  return userId;
}

async function resolveOrCreateStudent(
  tx: Prisma.TransactionClient,
  orderId: string,
  snap: OrderBillingSnapshot
): Promise<{
  userId: string;
  credsEmail: { to: string; prenom: string; plainPassword: string } | null;
}> {
  const existing = await tx.user.findUnique({
    where: { email: snap.email },
  });

  if (existing) {
    if (existing.passwordHash) {
      await tx.order.update({
        where: { id: orderId },
        data: { userId: existing.id },
      });
      if (snap.sexe) {
        await tx.user.update({
          where: { id: existing.id },
          data: { sexe: snap.sexe },
        });
      }
      return { userId: existing.id, credsEmail: null };
    }

    const plain = generateProvisionalPassword();
    await tx.user.update({
      where: { id: existing.id },
      data: {
        passwordHash: await hashPassword(plain),
        prenom: snap.prenom,
        nom: snap.nom,
        telephone: snap.telephone || null,
        ...(snap.sexe ? { sexe: snap.sexe } : {}),
      },
    });
    await tx.order.update({
      where: { id: orderId },
      data: { userId: existing.id },
    });
    return {
      userId: existing.id,
      credsEmail: { to: snap.email, prenom: snap.prenom, plainPassword: plain },
    };
  }

  const plain = generateProvisionalPassword();
  const created = await tx.user.create({
    data: {
      email: snap.email,
      prenom: snap.prenom,
      nom: snap.nom,
      telephone: snap.telephone || null,
      sexe: snap.sexe ?? undefined,
      passwordHash: await hashPassword(plain),
      role: "STUDENT",
    },
  });

  await tx.order.update({
    where: { id: orderId },
    data: { userId: created.id },
  });

  return {
    userId: created.id,
    credsEmail: { to: snap.email, prenom: snap.prenom, plainPassword: plain },
  };
}
