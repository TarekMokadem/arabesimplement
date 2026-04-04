"use server";

import { getSession } from "../actions";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";
import {
  mapStripeSubscriptionToWeeklyStatus,
  syncWeeklyRowsFromStripeSubscription,
} from "@/lib/orders/sync-course-weekly-subscriptions";

export type SubscriptionActionResult =
  | { success: true }
  | { success: false; error: string };

async function assertOwnsSubscription(
  userId: string,
  stripeSubscriptionId: string
): Promise<boolean> {
  const row = await prisma.courseWeeklySubscription.findFirst({
    where: { userId, stripeSubscriptionId },
    select: { id: true },
  });
  return row != null;
}

async function requireStudentOwnsSubscription(
  stripeSubscriptionId: string
): Promise<
  | { ok: true; session: NonNullable<Awaited<ReturnType<typeof getSession>>> }
  | SubscriptionActionResult
> {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return { success: false, error: "Non autorisé." };
  }
  if (!(await assertOwnsSubscription(session.id, stripeSubscriptionId))) {
    return { success: false, error: "Abonnement introuvable." };
  }
  return { ok: true, session };
}

/** Met en pause les prélèvements (abonnement Stripe inchangé, pas de facturation). */
export async function pauseMyWeeklySubscription(
  stripeSubscriptionId: string
): Promise<SubscriptionActionResult> {
  const auth = await requireStudentOwnsSubscription(stripeSubscriptionId);
  if ("success" in auth) return auth;

  if (stripeSubscriptionId.startsWith("mock_sub_")) {
    await prisma.courseWeeklySubscription.updateMany({
      where: { stripeSubscriptionId },
      data: { status: "PAUSED" },
    });
    return { success: true };
  }

  if (!isStripeConfigured()) {
    return {
      success: false,
      error: "Stripe n’est pas configuré sur cet environnement.",
    };
  }

  try {
    const stripe = getServerStripe();
    const sub = await stripe.subscriptions.update(stripeSubscriptionId, {
      pause_collection: { behavior: "void" },
    });
    await syncWeeklyRowsFromStripeSubscription(sub);
    return { success: true };
  } catch (e) {
    console.error("[pauseMyWeeklySubscription]", e);
    return {
      success: false,
      error: "Impossible de mettre en pause. Réessayez ou contactez le support.",
    };
  }
}

/** Reprend les prélèvements après une pause. */
export async function resumeMyWeeklySubscription(
  stripeSubscriptionId: string
): Promise<SubscriptionActionResult> {
  const auth = await requireStudentOwnsSubscription(stripeSubscriptionId);
  if ("success" in auth) return auth;

  if (stripeSubscriptionId.startsWith("mock_sub_")) {
    await prisma.courseWeeklySubscription.updateMany({
      where: { stripeSubscriptionId },
      data: { status: "ACTIVE" },
    });
    return { success: true };
  }

  if (!isStripeConfigured()) {
    return {
      success: false,
      error: "Stripe n’est pas configuré sur cet environnement.",
    };
  }

  try {
    const stripe = getServerStripe();
    const sub = await stripe.subscriptions.update(stripeSubscriptionId, {
      pause_collection: null,
    });
    await syncWeeklyRowsFromStripeSubscription(sub);
    return { success: true };
  } catch (e) {
    console.error("[resumeMyWeeklySubscription]", e);
    return {
      success: false,
      error: "Impossible de reprendre l’abonnement.",
    };
  }
}

/**
 * Arrêt en fin de période payée : plus de prélèvement après la date affichée par Stripe.
 */
export async function cancelMyWeeklySubscriptionAtPeriodEnd(
  stripeSubscriptionId: string
): Promise<SubscriptionActionResult> {
  const auth = await requireStudentOwnsSubscription(stripeSubscriptionId);
  if ("success" in auth) return auth;

  if (stripeSubscriptionId.startsWith("mock_sub_")) {
    await prisma.courseWeeklySubscription.updateMany({
      where: { stripeSubscriptionId },
      data: { status: "CANCELED" },
    });
    return { success: true };
  }

  if (!isStripeConfigured()) {
    return {
      success: false,
      error: "Stripe n’est pas configuré sur cet environnement.",
    };
  }

  try {
    const stripe = getServerStripe();
    const sub = await stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
      await syncWeeklyRowsFromStripeSubscription(sub);
    return { success: true };
  } catch (e) {
    console.error("[cancelMyWeeklySubscriptionAtPeriodEnd]", e);
    return {
      success: false,
      error: "Impossible d’enregistrer l’arrêt.",
    };
  }
}

/** Annulation immédiate (fin d’accès côté produit au prochain sync webhook). */
export async function cancelMyWeeklySubscriptionNow(
  stripeSubscriptionId: string
): Promise<SubscriptionActionResult> {
  const auth = await requireStudentOwnsSubscription(stripeSubscriptionId);
  if ("success" in auth) return auth;

  if (stripeSubscriptionId.startsWith("mock_sub_")) {
    await prisma.courseWeeklySubscription.updateMany({
      where: { stripeSubscriptionId },
      data: { status: "CANCELED" },
    });
    return { success: true };
  }

  if (!isStripeConfigured()) {
    return {
      success: false,
      error: "Stripe n’est pas configuré sur cet environnement.",
    };
  }

  try {
    const stripe = getServerStripe();
    const sub = await stripe.subscriptions.cancel(stripeSubscriptionId);
    await prisma.courseWeeklySubscription.updateMany({
      where: { stripeSubscriptionId },
      data: {
        status: mapStripeSubscriptionToWeeklyStatus(sub),
      },
    });
    return { success: true };
  } catch (e) {
    console.error("[cancelMyWeeklySubscriptionNow]", e);
    return {
      success: false,
      error: "Impossible d’annuler immédiatement.",
    };
  }
}
