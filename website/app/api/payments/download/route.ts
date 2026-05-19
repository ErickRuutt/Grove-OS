import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { generateExportZip } from "@/lib/export-generator";
import fs from "fs/promises";
import { createReadStream } from "fs";
import path from "path";
import type Stripe from "stripe";

const PAYMENTS_DIR = path.join(process.cwd(), "data", "payments");
const SESSION_ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;
const MAX_DOWNLOADS = 5;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stripeSessionId = searchParams.get("stripe_session_id");
  const interviewSessionId = searchParams.get("interview_session_id");

  if (!stripeSessionId || !interviewSessionId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (!SESSION_ID_RE.test(interviewSessionId)) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }

  // Verify payment via Stripe
  let stripeSession: Stripe.Checkout.Session;
  try {
    stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe session" }, { status: 400 });
  }

  if (
    stripeSession.payment_status !== "paid" ||
    stripeSession.metadata?.interview_session_id !== interviewSessionId
  ) {
    return NextResponse.json({ error: "Payment not verified" }, { status: 403 });
  }

  // Check local payment record (handles refunds)
  const paymentPath = path.join(PAYMENTS_DIR, `${interviewSessionId}.json`);
  try {
    const record = JSON.parse(await fs.readFile(paymentPath, "utf-8"));
    if (record.status === "refunded") {
      return NextResponse.json({ error: "Payment has been refunded" }, { status: 403 });
    }
    if (record.downloadCount >= MAX_DOWNLOADS) {
      return NextResponse.json({ error: "Download limit reached" }, { status: 403 });
    }
    // Increment download count
    await fs.writeFile(
      paymentPath,
      JSON.stringify({ ...record, downloadCount: record.downloadCount + 1 }, null, 2)
    );
  } catch {
    // No local record yet (webhook may not have fired) — Stripe verification above is sufficient
    await fs.mkdir(PAYMENTS_DIR, { recursive: true });
    const record = {
      interviewSessionId,
      stripeCheckoutSessionId: stripeSessionId,
      stripePaymentIntentId: stripeSession.payment_intent,
      customerEmail: stripeSession.customer_details?.email,
      amountTotal: stripeSession.amount_total,
      currency: stripeSession.currency,
      paidAt: new Date().toISOString(),
      status: "paid",
      downloadCount: 1,
    };
    await fs.writeFile(paymentPath, JSON.stringify(record, null, 2));
  }

  // Generate zip
  let exportResult: { filePath: string; filename: string };
  try {
    exportResult = await generateExportZip(interviewSessionId);
  } catch (error) {
    console.error("Export generation error:", error);
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }

  // Stream zip back to client
  const fileBuffer = await fs.readFile(exportResult.filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${exportResult.filename}"`,
      "Content-Length": String(fileBuffer.length),
    },
  });
}
