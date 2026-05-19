import { NextRequest, NextResponse } from "next/server";
import { generateExportZip } from "@/lib/export-generator";
import fs from "fs/promises";
import path from "path";
import crypto from "node:crypto";

const DATA_FILE = path.join(process.cwd(), "data", "chat-requests", "entries.json");
const PAYMENTS_DIR = path.join(process.cwd(), "data", "payments");
const SESSION_ID_RE = /^[a-zA-Z0-9_-]{1,100}$/;
const MAX_DOWNLOADS = 10;

interface ChatRequest {
  id: string;
  email: string;
  name: string;
  company: string;
  use_case: string;
  status: "pending" | "approved" | "rejected";
  activationToken: string;
  created_at: string;
}

async function readRequests(): Promise<ChatRequest[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// POST /api/payments/permission-download
// Body: { sessionId, email }
// Returns: 200 with zip stream if approved, 403 if not, 404 if not found
export async function POST(req: NextRequest) {
  let sessionId: string;
  let email: string;

  try {
    const body = await req.json();
    sessionId = body.sessionId;
    email = body.email;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!sessionId || !SESSION_ID_RE.test(sessionId)) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const entries = await readRequests();
  const entry = entries.find((e) => e.email.toLowerCase() === normalizedEmail);

  if (!entry) {
    return NextResponse.json({ error: "no_request", message: "No access request found for this email." }, { status: 404 });
  }

  if (entry.status === "pending") {
    return NextResponse.json({ error: "pending", message: "Your access request is pending approval." }, { status: 403 });
  }

  if (entry.status === "rejected") {
    return NextResponse.json({ error: "rejected", message: "Your access request was not approved." }, { status: 403 });
  }

  // Approved — check/create download record
  const paymentPath = path.join(PAYMENTS_DIR, `perm_${sessionId}.json`);
  await fs.mkdir(PAYMENTS_DIR, { recursive: true });

  let record: Record<string, unknown>;
  try {
    record = JSON.parse(await fs.readFile(paymentPath, "utf-8"));
    if ((record.downloadCount as number) >= MAX_DOWNLOADS) {
      return NextResponse.json({ error: "Download limit reached" }, { status: 403 });
    }
    record.downloadCount = (record.downloadCount as number) + 1;
    record.lastDownloadAt = new Date().toISOString();
  } catch {
    record = {
      interviewSessionId: sessionId,
      email: normalizedEmail,
      requestId: entry.id,
      mode: "permission",
      paidAt: new Date().toISOString(),
      status: "approved",
      downloadCount: 1,
      downloadToken: crypto.randomUUID(),
    };
  }
  await fs.writeFile(paymentPath, JSON.stringify(record, null, 2));

  let exportResult: { filePath: string; filename: string };
  try {
    exportResult = await generateExportZip(sessionId);
  } catch (error) {
    console.error("Export generation error:", error);
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }

  const fileBuffer = await fs.readFile(exportResult.filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${exportResult.filename}"`,
      "Content-Length": String(fileBuffer.length),
    },
  });
}
