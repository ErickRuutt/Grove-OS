import { NextRequest, NextResponse } from "next/server";
import { createChatAccessToken, CHAT_ACCESS_COOKIE, CHAT_ACCESS_COOKIE_OPTIONS } from "../../../lib/session";

const USERS: Record<string, string> = {
  [process.env.GROVE_ADMIN_USERNAME ?? "erickruuttila"]: process.env.GROVE_ADMIN_PASSWORD ?? "testtest315!",
};

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const expected = USERS[username.trim()];
    if (!expected || expected !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createChatAccessToken(`${username.trim()}@grove.local`);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(CHAT_ACCESS_COOKIE, token, CHAT_ACCESS_COOKIE_OPTIONS);
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
