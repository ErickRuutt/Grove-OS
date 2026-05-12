import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist", "entries.json");

interface WaitlistEntry {
  id: string;
  email: string;
  company: string;
  first_name: string;
  last_name: string;
  source: string;
  created_at: string;
}

async function readEntries(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeEntries(entries: WaitlistEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, company, first_name, last_name, source = "website" } = body;

    if (!email || !company || !first_name || !last_name) {
      return NextResponse.json(
        { error: "email, company, first_name, and last_name are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const entries = await readEntries();
    const exists = entries.some(
      (e) => e.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      const alreadyRes = NextResponse.json(
        { status: "already_registered", message: "You're already on the waitlist." },
        { status: 200 }
      );
      alreadyRes.cookies.set(SESSION_COOKIE, createSessionToken(email), SESSION_COOKIE_OPTIONS);
      return alreadyRes;
    }

    const entry: WaitlistEntry = {
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      company: company.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      source,
      created_at: new Date().toISOString(),
    };

    entries.push(entry);
    await writeEntries(entries);

    const res = NextResponse.json(
      { status: "success", message: "You're on the waitlist!" },
      { status: 201 }
    );
    res.cookies.set(SESSION_COOKIE, createSessionToken(email), SESSION_COOKIE_OPTIONS);
    return res;
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}

export async function GET() {
  // Internal endpoint for integrations — returns entry count only (no PII)
  try {
    const entries = await readEntries();
    return NextResponse.json({ count: entries.length });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
