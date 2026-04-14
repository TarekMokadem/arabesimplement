"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { isStripeConfigured } from "@/lib/stripe/config";
import { getServerStripe } from "@/lib/stripe/server";
import {
  recurringCartStripePriceIdForMinutes,
} from "@/lib/stripe/recurring-cart-prices";
import {
  syncCourseWeeklyLinesFromStripeSubscriptionItems,
} from "@/lib/orders/sync-course-weekly-subscriptions";

export type LearnerSubscriptionAdminResult =
  | { success: true }
  | { success: false; error: string };

export async function adminUpdateCourseWeeklyBundleQuantity(
  courseWeeklySubscriptionId: string,
  bundleQuantity: number
): Promise<LearnerSubscriptionAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const q = Math.max(1, Math.floor(bundleQuantity));
  const row = await prisma.courseWeeklySubscription.findUnique({
    where: { id: courseWeeklySubscriptionId },
  });
  if (!row?.stripeSubscriptionItemId) {
    return { success: false, error: "Ligne d’abonnement introuvable." };
  }

  if (row.stripeSubscriptionItemId.startsWith("mock_item_")) {
    await prisma.courseWeeklySubscription.update({
      where: { id: courseWeeklySubscriptionId },
      data: { bundleQuantity: q },
    });
    revalidatePath(`/admin/utilisateurs/${row.userId}`);
    return { success: true };
  }

  if (!isStripeConfigured()) {
    return { success: false, error: "Stripe n’est pas configuré." };
  }

  try {
    const stripe = getServerStripe();
    await stripe.subscriptionItems.update(row.stripeSubscriptionItemId, {
      quantity: q,
      proration_behavior: "create_prorations",
    });
    const sub = await stripe.subscriptions.retrieve(row.stripeSubscriptionId, {
      expand: ["items.data.price"],
    });
    await syncCourseWeeklyLinesFromStripeSubscriptionItems(sub);
    revalidatePath(`/admin/utilisateurs/${row.userId}`);
    return { success: true };
  } catch (e) {
    console.error("[adminUpdateCourseWeeklyBundleQuantity]", e);
    return {
      success: false,
      error: "Mise à jour Stripe impossible. Vérifiez la configuration.",
    };
  }
}

export async function adminUpdateCourseWeeklyHourlyMinutes(
  courseWeeklySubscriptionId: string,
  hourlyMinutes: number
): Promise<LearnerSubscriptionAdminResult> {
  const admin = await requireAdminSession();
  if (!admin) return { success: false, error: "Non autorisé." };

  const priceId = recurringCartStripePriceIdForMinutes(hourlyMinutes);
  if (!priceId) {
    return { success: false, error: "Durée invalide ou prix Stripe non configuré." };
  }

  const row = await prisma.courseWeeklySubscription.findUnique({
    where: { id: courseWeeklySubscriptionId },
  });
  if (!row?.stripeSubscriptionItemId) {
    return { success: false, error: "Ligne d’abonnement introuvable." };
  }

  if (row.stripeSubscriptionItemId.startsWith("mock_item_")) {
    await prisma.courseWeeklySubscription.update({
      where: { id: courseWeeklySubscriptionId },
      data: { hourlyMinutes },
    });
    revalidatePath(`/admin/utilisateurs/${row.userId}`);
    return { success: true };
  }

  if (!isStripeConfigured()) {
    return { success: false, error: "Stripe n’est pas configuré." };
  }

  try {
    const stripe = getServerStripe();
    await stripe.subscriptionItems.update(row.stripeSubscriptionItemId, {
      price: priceId,
      quantity: Math.max(1, row.bundleQuantity),
      proration_behavior: "create_prorations",
    });
    const sub = await stripe.subscriptions.retrieve(row.stripeSubscriptionId, {
      expand: ["items.data.price"],
    });
    await syncCourseWeeklyLinesFromStripeSubscriptionItems(sub);
    revalidatePath(`/admin/utilisateurs/${row.userId}`);
    return { success: true };
  } catch (e) {
    console.error("[adminUpdateCourseWeeklyHourlyMinutes]", e);
    return {
      success: false,
      error: "Changement de durée impossible côté Stripe.",
    };
  }
}
