import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { verifyAuthSessionToken } from "@/lib/auth/session-token";

const ADMIN_PATHS = ["/admin"];
const AUTH_REQUIRED_PATHS = ["/tableau-de-bord"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  const session = raw ? await verifyAuthSessionToken(raw) : null;

  for (const path of ADMIN_PATHS) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      if (!session) {
        return NextResponse.redirect(new URL("/connexion", request.url));
      }
      if (session.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/tableau-de-bord", request.url));
      }
      return NextResponse.next();
    }
  }

  for (const path of AUTH_REQUIRED_PATHS) {
    if (pathname.startsWith(path)) {
      if (!session) {
        return NextResponse.redirect(new URL("/connexion", request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/tableau-de-bord/:path*"],
};
