import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import fs from "fs/promises";
import path from "path";
import type Stripe from "stripe";

const PAYMENTS_DIR = path.join(process.cwd(), "data", "payments");

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const interviewSessionId = session.metadata?.interview_session_id;

    if (interviewSessionId && session.payment_status === "paid") {
      await recordPayment(interviewSessionId, session);
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const interviewSessionId = (charge.metadata as Record<string, string>)?.interview_session_id;
    if (interviewSessionId) {
      await revokePayment(interviewSessionId, charge.id);
    }
  }

  return NextResponse.json({ received: true });
}

async function recordPayment(interviewSessionId: string, session: Stripe.Checkout.Session) {
  await fs.mkdir(PAYMENTS_DIR, { recursive: true });
  const paymentPath = path.join(PAYMENTS_DIR, `${interviewSessionId}.json`);

  const record = {
    interviewSessionId,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: session.payment_intent,
    customerEmail: session.customer_details?.email,
    amountTotal: session.amount_total,
    currency: session.currency,
    paidAt: new Date().toISOString(),
    status: "paid",
    downloadCount: 0,
  };

  await fs.writeFile(paymentPath, JSON.stringify(record, null, 2));
}

async function revokePayment(interviewSessionId: string, chargeId: string) {
  const paymentPath = path.join(PAYMENTS_DIR, `${interviewSessionId}.json`);
  try {
    const existing = JSON.parse(await fs.readFile(paymentPath, "utf-8"));
    await fs.writeFile(
      paymentPath,
      JSON.stringify(
        {
          ...existing,
          status: "refunded",
          refundedAt: new Date().toISOString(),
          refundChargeId: chargeId,
        },
        null,
        2
      )
    );
  } catch {
    // no payment record to revoke
  }
}
