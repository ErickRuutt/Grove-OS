import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "chat-requests", "entries.json");
const ADMIN_KEY = process.env.GROVE_ADMIN_KEY;

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

function isAuthorized(req: NextRequest): boolean {
  if (!ADMIN_KEY) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${ADMIN_KEY}`;
}

async function readRequests(): Promise<ChatRequest[]> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

async function writeRequests(entries: ChatRequest[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
}

// GET /api/admin/requests — list all requests (admin only)
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await readRequests();
  return NextResponse.json(entries);
}

// PATCH /api/admin/requests — approve or reject by id or email
// Body: { id?: string, email?: string, action: "approve" | "reject" }
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; email?: string; action: "approve" | "reject" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id, email, action } = body;
  if (!action || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
  }
  if (!id && !email) {
    return NextResponse.json({ error: "id or email required" }, { status: 400 });
  }

  const entries = await readRequests();
  const idx = entries.findIndex((e) =>
    id ? e.id === id : e.email.toLowerCase() === (email ?? "").toLowerCase()
  );

  if (idx === -1) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  entries[idx].status = action === "approve" ? "approved" : "rejected";
  await writeRequests(entries);

  return NextResponse.json({ updated: entries[idx] });
}
