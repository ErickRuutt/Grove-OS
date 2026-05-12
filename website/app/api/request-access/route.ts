import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "node:crypto";

const DATA_FILE = path.join(process.cwd(), "data", "chat-requests", "entries.json");

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

async function writeRequests(entries: ChatRequest[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, company, use_case } = body;

    if (!email || !name || !company || !use_case) {
      return NextResponse.json(
        { error: "Please fill in all fields so we can review your request." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid work email address." },
        { status: 400 }
      );
    }

    const entries = await readRequests();
    const existing = entries.find(
      (e) => e.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      return NextResponse.json({ status: "already_submitted" }, { status: 200 });
    }

    const entry: ChatRequest = {
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      company: company.trim(),
      use_case: use_case.trim(),
      status: "pending",
      activationToken: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    entries.push(entry);
    await writeRequests(entries);

    return NextResponse.json({ status: "success" }, { status: 201 });
  } catch (error) {
    console.error("Request-access API error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}

export async function GET() {
  // Internal: return pending request count (no PII)
  try {
    const entries = await readRequests();
    const pending = entries.filter((e) => e.status === "pending").length;
    return NextResponse.json({ pending, total: entries.length });
  } catch {
    return NextResponse.json({ pending: 0, total: 0 });
  }
}
