import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

const PROTECTED_PAGES = ["/interview"];
const PROTECTED_API_PREFIX = "/api/interview";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedPage = PROTECTED_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isProtectedApi = pathname === PROTECTED_API_PREFIX || pathname.startsWith(PROTECTED_API_PREFIX + "/");

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isValid = !!token && verifySessionToken(token);

  if (!isValid) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Access required" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/waitlist";
    url.searchParams.set("from", "interview");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/interview", "/interview/:path*", "/api/interview", "/api/interview/:path*"],
};
