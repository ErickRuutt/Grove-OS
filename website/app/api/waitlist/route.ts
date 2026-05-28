import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist", "entries.json");
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  source: string;
  source_page: string;
  utm: Partial<Record<(typeof UTM_KEYS)[number], string>>;
  created_at: string;
}

type WaitlistErrorCode =
  | "invalid_json"
  | "email_required"
  | "email_invalid"
  | "server_error";

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

function apiError(code: WaitlistErrorCode, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function logEvent(
  event: "submit_attempt" | "submit_success" | "submit_failure",
  details: Record<string, unknown>
) {
  console.log("[waitlist]", JSON.stringify({ event, ...details }));
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      logEvent("submit_failure", { request_id: requestId, error_class: "invalid_json" });
      return apiError("invalid_json", "Invalid JSON request body.", 400);
    }

    const payload = body && typeof body === "object" ? body : {};
    const email = normalizeOptionalString((payload as { email?: unknown }).email)?.toLowerCase();
    const name = normalizeOptionalString((payload as { name?: unknown }).name);
    const company = normalizeOptionalString((payload as { company?: unknown }).company);
    const role = normalizeOptionalString((payload as { role?: unknown }).role);
    const source =
      normalizeOptionalString((payload as { source?: unknown }).source) ?? "website";
    const source_page =
      normalizeOptionalString((payload as { source_page?: unknown }).source_page) ??
      req.headers.get("referer") ??
      "unknown";
    const utm_input =
      ((payload as { utm?: Partial<Record<(typeof UTM_KEYS)[number], unknown>> }).utm ?? {}) || {};
    const utm: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};
    for (const key of UTM_KEYS) {
      const value = normalizeOptionalString(utm_input[key]);
      if (value) {
        utm[key] = value;
      }
    }

    logEvent("submit_attempt", { request_id: requestId, email: email ?? null, source, source_page });

    if (!email) {
      logEvent("submit_failure", {
        request_id: requestId,
        error_class: "email_required",
        source,
        source_page,
      });
      return apiError("email_required", "Email is required.", 400);
    }

    if (!isValidEmail(email)) {
      logEvent("submit_failure", {
        request_id: requestId,
        error_class: "email_invalid",
        email,
        source,
        source_page,
      });
      return apiError("email_invalid", "Enter a valid email address.", 400);
    }

    const entries = await readEntries();
    const exists = entries.some((e) => e.email.toLowerCase() === email);

    if (exists) {
      const alreadyRes = NextResponse.json(
        {
          status: "already_registered",
          message: "You're already on the waitlist.",
          code: "already_registered",
        },
        { status: 200 }
      );
      alreadyRes.cookies.set(SESSION_COOKIE, await createSessionToken(email), SESSION_COOKIE_OPTIONS);
      logEvent("submit_success", {
        request_id: requestId,
        status: "already_registered",
        email,
        source,
        source_page,
      });
      return alreadyRes;
    }

    const entry: WaitlistEntry = {
      id: crypto.randomUUID(),
      email,
      name,
      company,
      role,
      source,
      source_page,
      utm,
      created_at: new Date().toISOString(),
    };

    entries.push(entry);
    await writeEntries(entries);

    const res = NextResponse.json(
      { status: "success", message: "You're on the waitlist!", code: "success" },
      { status: 201 }
    );
    res.cookies.set(SESSION_COOKIE, await createSessionToken(email), SESSION_COOKIE_OPTIONS);
    logEvent("submit_success", { request_id: requestId, status: "success", email, source, source_page });
    return res;
  } catch (error) {
    const errorClass = error instanceof Error ? error.name : "unknown_error";
    console.error("Waitlist API error:", error);
    logEvent("submit_failure", { request_id: requestId, error_class: errorClass });
    return apiError("server_error", "Failed to join waitlist. Please try again.", 500);
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
