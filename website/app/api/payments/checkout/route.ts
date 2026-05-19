import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured, EXPORT_PRICE_CENTS, EXPORT_PRODUCT_NAME } from "@/lib/stripe";

const SESSION_ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || !SESSION_ID_RE.test(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get("host")}`;

    // Fall back to permission-gated flow when Stripe is not configured
    if (!isStripeConfigured()) {
      return NextResponse.json({
        url: `${baseUrl}/payment/permission?interview_session_id=${sessionId}`,
        mode: "permission",
      });
    }

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: EXPORT_PRODUCT_NAME,
              description:
                "Full company-brain export: structured zip with summary, context graph, transcripts, and sources.",
            },
            unit_amount: EXPORT_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment/success?stripe_session_id={CHECKOUT_SESSION_ID}&interview_session_id=${sessionId}`,
      cancel_url: `${baseUrl}/interview?session_id=${sessionId}`,
      metadata: {
        interview_session_id: sessionId,
      },
      payment_intent_data: {
        metadata: {
          interview_session_id: sessionId,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url, mode: "stripe" });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
