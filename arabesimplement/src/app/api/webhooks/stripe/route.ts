import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { ensureEnrollmentsForPaidOrder } from "@/lib/orders/fulfill-order";
import { getServerStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return NextResponse.json({ error: "Configuration webhook manquante" }, {
      status: 400,
    });
  }

  let event: Stripe.Event;
  try {
    const stripe = getServerStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[webhook stripe] Signature", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    if (pi.status !== "succeeded") {
      return NextResponse.json({ received: true });
    }
    const orderId = pi.metadata?.orderId;
    const pending = await prisma.order.findMany({
      where: {
        statut: "PENDING",
        stripePaymentIntentId: pi.id,
        ...(orderId ? { id: orderId } : {}),
      },
      select: { id: true },
    });
    if (pending.length > 0) {
      await prisma.order.updateMany({
        where: { id: { in: pending.map((o) => o.id) } },
        data: { statut: "PAID" },
      });
      for (const o of pending) {
        await ensureEnrollmentsForPaidOrder(o.id);
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const orderId = pi.metadata?.orderId;
    const candidates = await prisma.order.findMany({
      where: {
        stripePaymentIntentId: pi.id,
        statut: "PENDING",
        ...(orderId ? { id: orderId } : {}),
      },
      select: { id: true, userId: true },
    });
    for (const o of candidates) {
      if (o.userId == null) {
        await prisma.order.delete({ where: { id: o.id } });
      } else {
        await prisma.order.update({
          where: { id: o.id },
          data: { statut: "FAILED" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
