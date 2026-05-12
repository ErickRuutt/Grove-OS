import crypto from "node:crypto";

const SECRET = process.env.GROVE_SESSION_SECRET ?? "dev-secret-change-in-production";
const CHAT_SECRET = process.env.GROVE_CHAT_SECRET ?? "dev-chat-secret-change-in-production";

export const SESSION_COOKIE = "grove_access";
export const CHAT_ACCESS_COOKIE = "grove_chat";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

export const CHAT_ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 90,
  path: "/",
};

function makeToken(payload: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function checkToken(token: string, secret: string): boolean {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = token.substring(0, lastDot);
    const sig = token.substring(lastDot + 1);
    if (!/^[0-9a-f]{64}$/.test(sig)) return false;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function createSessionToken(email: string): string {
  const payload = `${encodeURIComponent(email.toLowerCase().trim())}:${Date.now()}`;
  return makeToken(payload, SECRET);
}

export function verifySessionToken(token: string): boolean {
  return checkToken(token, SECRET);
}

export function createChatAccessToken(email: string): string {
  const payload = `chat:${encodeURIComponent(email.toLowerCase().trim())}:${Date.now()}`;
  return makeToken(payload, CHAT_SECRET);
}

export function verifyChatAccessToken(token: string): boolean {
  return checkToken(token, CHAT_SECRET);
}
