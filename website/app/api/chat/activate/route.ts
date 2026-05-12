import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createChatAccessToken, CHAT_ACCESS_COOKIE, CHAT_ACCESS_COOKIE_OPTIONS } from "@/lib/session";

const DATA_FILE = path.join(process.cwd(), "data", "chat-requests", "entries.json");

interface ChatRequest {
  id: string;
  email: string;
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

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token || !/^[0-9a-f-]{36}$/.test(token)) {
    return NextResponse.json({ error: "Invalid activation token" }, { status: 400 });
  }

  const entries = await readRequests();
  const idx = entries.findIndex((e) => e.activationToken === token);

  if (idx === -1) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  const entry = entries[idx];

  if (entry.status === "rejected") {
    return NextResponse.redirect(new URL("/request-access?status=rejected", req.nextUrl));
  }

  // Mark approved and rotate activation token so link is single-use
  entries[idx] = { ...entry, status: "approved", activationToken: "" };
  await writeRequests(entries);

  const accessToken = createChatAccessToken(entry.email);
  const res = NextResponse.redirect(new URL("/chat", req.nextUrl));
  res.cookies.set(CHAT_ACCESS_COOKIE, accessToken, CHAT_ACCESS_COOKIE_OPTIONS);
  return res;
}
