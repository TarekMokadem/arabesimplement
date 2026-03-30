import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { OrderFormInput } from "@/lib/validations/order.schema";
import type { CartItem } from "@/store/cart.store";
import { REGLEMENT_VERSION } from "@/lib/content/reglement-interieur";
import { normalizeCartItemsForCheckout } from "@/lib/orders/normalize-cart-items";
import { orderFormToBillingSnapshot } from "@/lib/orders/billing-snapshot";

export type CreatePendingOrderResult =
  | { success: true; orderId: string; totalEuros: number }
  | { success: false; error: string };

export type CheckoutActor =
  | { kind: "guest" }
  | { kind: "authenticated"; userId: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createPendingOrderWithItems(
  data: OrderFormInput,
  items: CartItem[],
  clientIp: string | null,
  actor: CheckoutActor
): Promise<CreatePendingOrderResult> {
  const normalized = await normalizeCartItemsForCheckout(items);
  if (!normalized.success) {
    return { success: false, error: normalized.error };
  }
  const { items: safeItems, totalEuros } = normalized;

  const email = normalizeEmail(data.email);
  const billingSnapshot = orderFormToBillingSnapshot(data);

  if (actor.kind === "guest") {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { passwordHash: true },
    });
    if (existing?.passwordHash) {
      return {
        success: false,
        error:
          "Un compte existe déjà avec cet e-mail. Connectez-vous pour finaliser votre achat.",
      };
    }
  }

  try {
    const orderId = await prisma.$transaction(async (tx) => {
      const userId =
        actor.kind === "authenticated" ? actor.userId : null;

      const order = await tx.order.create({
        data: {
          userId,
          billingSnapshot: billingSnapshot as unknown as Prisma.InputJsonValue,
          total: new Prisma.Decimal(totalEuros.toFixed(2)),
          statut: "PENDING",
          reglementSigneAt: new Date(),
          reglementIp: clientIp,
          reglementVersion: REGLEMENT_VERSION,
        },
      });

      await tx.orderItem.createMany({
        data: safeItems.map((item) => ({
          orderId: order.id,
          formationId: item.formationId,
          creneauId: item.creneauId ?? null,
          hourlyMinutes: item.hourlyMinutes ?? null,
          prixUnitaire: new Prisma.Decimal(
            (item.prixPromo ?? item.prix).toFixed(2)
          ),
        })),
      });

      return order.id;
    });

    return { success: true, orderId, totalEuros };
  } catch (e) {
    console.error("[createPendingOrderWithItems]", e);
    const msg = e instanceof Error ? e.message : "";
    const name = e instanceof Error ? e.name : "";
    if (
      name === "PrismaClientValidationError" &&
      msg.includes("Unknown argument") &&
      (msg.includes("creneauId") || msg.includes("hourlyMinutes"))
    ) {
      return {
        success: false,
        error:
          "Mise à jour requise : arrêtez le serveur de développement, exécutez « npx prisma generate », puis relancez « npm run dev ».",
      };
    }
    return {
      success: false,
      error: "Impossible d'enregistrer la commande. Réessayez plus tard.",
    };
  }
}

export async function attachPaymentIntentToOrder(
  orderId: string,
  paymentIntentId: string
): Promise<void> {
  await prisma.order.update({
    where: { id: orderId },
    data: { stripePaymentIntentId: paymentIntentId },
  });
}

export async function deletePendingOrder(orderId: string): Promise<void> {
  await prisma.order.deleteMany({
    where: { id: orderId, statut: "PENDING" },
  });
}
