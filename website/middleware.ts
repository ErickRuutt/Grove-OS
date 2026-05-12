import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE, verifyChatAccessToken, CHAT_ACCESS_COOKIE } from "@/lib/session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /interview gating: requires waitlist cookie (grove_access)
  const isInterviewPage = pathname === "/interview" || pathname.startsWith("/interview/");
  const isInterviewApi = pathname === "/api/interview" || pathname.startsWith("/api/interview/");
  if (isInterviewPage || isInterviewApi) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !verifySessionToken(token)) {
      if (isInterviewApi) {
        return NextResponse.json({ error: "Access required" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/waitlist";
      url.searchParams.set("from", "interview");
      return NextResponse.redirect(url);
    }
  }

  // /chat gating: requires approved access cookie (grove_chat)
  // The activation endpoint is exempt — it's what sets the cookie
  const isChatPage = pathname === "/chat" || pathname.startsWith("/chat/");
  const isChatApi =
    (pathname === "/api/chat" || pathname.startsWith("/api/chat/")) &&
    !pathname.startsWith("/api/chat/activate");
  if (isChatPage || isChatApi) {
    const token = req.cookies.get(CHAT_ACCESS_COOKIE)?.value;
    if (!token || !verifyChatAccessToken(token)) {
      if (isChatApi) {
        return NextResponse.json({ error: "Chat access required" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/request-access";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/interview",
    "/interview/:path*",
    "/api/interview",
    "/api/interview/:path*",
    "/chat",
    "/chat/:path*",
    "/api/chat",
    "/api/chat/:path*",
  ],
};
