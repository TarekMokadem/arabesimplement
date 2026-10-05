import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/utils/database";
import { REGLEMENT_VERSION } from "@/lib/content/reglement-interieur";
import { isValidHourlyMinutes } from "@/lib/scheduling-mode";
import { MANUAL_PAYPAL_ME_METHOD } from "@/lib/stripe/stripe-payment-method-type";
import { ensureEnrollmentsForPaidOrder } from "@/lib/orders/fulfill-order";
import type { AdminRecordedOrderInput } from "@/lib/validations/admin-recorded-order.schema";
import type { OrderBillingSnapshot } from "@/lib/orders/billing-snapshot";

export type CreateAdminRecordedOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function createAdminRecordedOrder(
  data: AdminRecordedOrderInput
): Promise<CreateAdminRecordedOrderResult> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Base de données non configurée." };
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: {
      id: true,
      prenom: true,
      nom: true,
      email: true,
      telephone: true,
      sexe: true,
    },
  });
  if (!user) {
    return { success: false, error: "Client introuvable." };
  }

  const formation = await prisma.formation.findUnique({
    where: { id: data.formationId },
    select: { id: true, schedulingMode: true },
  });
  if (!formation) {
    return { success: false, error: "Formation introuvable." };
  }

  const isHourly = formation.schedulingMode === "HOURLY_PURCHASE";
  let creneauId: string | null = data.creneauId?.trim() || null;
  let hourlyMinutes: number | null = null;
  let hourlyQuantity = 1;

  if (isHourly) {
    if (
      data.hourlyMinutes == null ||
      !isValidHourlyMinutes(data.hourlyMinutes)
    ) {
      return {
        success: false,
        error: "Indiquez une durée (1 h, 40 min ou 30 min) pour le cours à la carte.",
      };
    }
    hourlyMinutes = data.hourlyMinutes;
    hourlyQuantity = Math.max(1, data.hourlyQuantity ?? 1);
  } else if (creneauId) {
    const slot = await prisma.creneau.findFirst({
      where: { id: creneauId, formationId: formation.id },
      select: { id: true },
    });
    if (!slot) {
      return { success: false, error: "Ce créneau n’appartient pas à la formation." };
    }
  } else {
    creneauId = null;
  }

  const orderId = randomUUID();
  const unitEuros = isHourly
    ? data.montantEuros / hourlyQuantity
    : data.montantEuros;
  const unit = new Prisma.Decimal(unitEuros.toFixed(2));
  const total = new Prisma.Decimal(data.montantEuros.toFixed(2));
  const billingSnapshot: OrderBillingSnapshot = {
    prenom: user.prenom,
    nom: user.nom,
    email: user.email,
    telephone: user.telephone ?? "",
    pays: data.pays.trim(),
    sexe: user.sexe,
  };

  const paymentMethodType =
    data.channel === "paypal_me" ? MANUAL_PAYPAL_ME_METHOD : data.channel;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          id: orderId,
          userId: user.id,
          billingSnapshot,
          total,
          subtotalEuros: total,
          discountEuros: new Prisma.Decimal(0),
          statut: data.statut,
          stripePaymentMethodType: paymentMethodType,
          stripeSubscriptionId:
            data.statut === "PAID" && isHourly ? `mock_sub_${orderId}` : null,
          reglementSigneAt: new Date(),
          reglementVersion: REGLEMENT_VERSION,
          reglementIp: "admin",
        },
      });
      await tx.orderItem.create({
        data: {
          orderId,
          formationId: formation.id,
          creneauId,
          hourlyMinutes,
          hourlyQuantity,
          cartLineId: `admin_${orderId}`,
          prixUnitaire: unit,
        },
      });
    });
  } catch (e) {
    console.error("[createAdminRecordedOrder] persist", e);
    return { success: false, error: "Enregistrement du paiement impossible." };
  }

  if (data.statut === "PAID") {
    try {
      await ensureEnrollmentsForPaidOrder(orderId);
    } catch (e) {
      console.error("[createAdminRecordedOrder] fulfill", e);
    }
  }

  return { success: true, orderId };
}
