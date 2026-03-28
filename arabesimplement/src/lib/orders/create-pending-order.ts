import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { OrderFormInput } from "@/lib/validations/order.schema";
import type { CartItem } from "@/store/cart.store";
import { REGLEMENT_VERSION } from "@/lib/content/reglement-interieur";

export type CreatePendingOrderResult =
  | { success: true; orderId: string; totalEuros: number }
  | { success: false; error: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createPendingOrderWithItems(
  data: OrderFormInput,
  items: CartItem[],
  clientIp: string | null
): Promise<CreatePendingOrderResult> {
  if (items.length === 0) {
    return { success: false, error: "Le panier est vide" };
  }

  const formationIds = [...new Set(items.map((i) => i.id))];
  const formations = await prisma.formation.findMany({
    where: { id: { in: formationIds }, statut: { in: ["ACTIVE", "COMING_SOON"] } },
    select: { id: true },
  });

  if (formations.length !== formationIds.length) {
    return {
      success: false,
      error:
        "Une ou plusieurs formations ne sont plus disponibles. Videz le panier et réessayez.",
    };
  }

  const totalEuros = items.reduce(
    (sum, item) => sum + (item.prixPromo ?? item.prix),
    0
  );

  if (totalEuros <= 0) {
    return { success: false, error: "Montant de commande invalide" };
  }

  const email = normalizeEmail(data.email);

  try {
    const orderId = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email },
        create: {
          email,
          prenom: data.prenom.trim(),
          nom: data.nom.trim(),
          telephone: data.telephone.trim(),
          role: "STUDENT",
        },
        update: {
          prenom: data.prenom.trim(),
          nom: data.nom.trim(),
          telephone: data.telephone.trim(),
        },
      });

      const order = await tx.order.create({
        data: {
          userId: user.id,
          total: new Prisma.Decimal(totalEuros.toFixed(2)),
          statut: "PENDING",
          reglementSigneAt: new Date(),
          reglementIp: clientIp,
          reglementVersion: REGLEMENT_VERSION,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          formationId: item.id,
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
