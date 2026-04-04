import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import type { CheckoutActor } from "@/lib/orders/create-pending-order";

export async function ensureStripeCustomerForCheckout(params: {
  stripe: Stripe;
  actor: CheckoutActor;
  billing: { email: string; prenom: string; nom: string };
  orderId: string;
}): Promise<string> {
  const { stripe, actor, billing, orderId } = params;
  const email = billing.email.trim().toLowerCase();
  const name = `${billing.prenom} ${billing.nom}`.trim();

  if (actor.kind === "authenticated") {
    const user = await prisma.user.findUnique({
      where: { id: actor.userId },
      select: { stripeCustomerId: true },
    });
    if (user?.stripeCustomerId) return user.stripeCustomerId;

    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: { userId: actor.userId },
    });
    await prisma.user.update({
      where: { id: actor.userId },
      data: { stripeCustomerId: customer.id },
    });
    return customer.id;
  }

  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { pendingOrderId: orderId },
  });
  return customer.id;
}
