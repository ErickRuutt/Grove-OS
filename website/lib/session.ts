import crypto from "node:crypto";

const SECRET = process.env.GROVE_SESSION_SECRET ?? "dev-secret-change-in-production";

export const SESSION_COOKIE = "grove_access";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

export function createSessionToken(email: string): string {
  const ts = Date.now().toString();
  const payload = `${encodeURIComponent(email.toLowerCase().trim())}:${ts}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = token.substring(0, lastDot);
    const sig = token.substring(lastDot + 1);
    if (!/^[0-9a-f]{64}$/.test(sig)) return false;
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
