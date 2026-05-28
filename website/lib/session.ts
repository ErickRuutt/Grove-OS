// Web Crypto API — works in Edge runtime and Node.js 19+
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

async function getKey(secret: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const arr = hex.match(/.{2}/g);
  if (!arr) return new Uint8Array(0);
  return new Uint8Array(arr.map((h) => parseInt(h, 16)));
}

async function makeToken(payload: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const sig = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return `${payload}.${toHex(sig)}`;
}

async function checkToken(token: string, secret: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = token.substring(0, lastDot);
    const sig = token.substring(lastDot + 1);
    if (!/^[0-9a-f]{64}$/.test(sig)) return false;
    const key = await getKey(secret);
    return await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      fromHex(sig),
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }
}

export async function createSessionToken(email: string): Promise<string> {
  const payload = `${encodeURIComponent(email.toLowerCase().trim())}:${Date.now()}`;
  return makeToken(payload, SECRET);
}

export async function verifySessionToken(token: string): Promise<boolean> {
  return checkToken(token, SECRET);
}

export async function createChatAccessToken(email: string): Promise<string> {
  const payload = `chat:${encodeURIComponent(email.toLowerCase().trim())}:${Date.now()}`;
  return makeToken(payload, CHAT_SECRET);
}

export async function verifyChatAccessToken(token: string): Promise<boolean> {
  return checkToken(token, CHAT_SECRET);
}
