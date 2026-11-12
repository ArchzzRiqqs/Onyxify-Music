import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/library", "/playlist/"];
const loginAttempts = new Map<string, number[]>();
const LOGIN_WINDOW_MS = 60_000;
const LOGIN_LIMIT = 5;

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname === "/api/auth/callback/credentials" &&
    request.method === "POST"
  ) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const now = Date.now();
    const attempts = (loginAttempts.get(ip) ?? []).filter(
      (timestamp) => now - timestamp < LOGIN_WINDOW_MS,
    );
    if (attempts.length >= LOGIN_LIMIT) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Terlalu banyak percobaan masuk",
          },
        },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }
    attempts.push(now);
    loginAttempts.set(ip, attempts);
  }

  const protectsPage =
    protectedPaths.some(
      (path) => pathname === path || pathname.startsWith(path),
    ) && !(pathname.startsWith("/playlist/") && !pathname.endsWith("/edit"));
  const protectsMutation =
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/") &&
    request.method !== "GET" &&
    request.method !== "HEAD";

  if (!protectsPage && !protectsMutation) return NextResponse.next();

  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    return NextResponse.json(
      {
        error: {
          code: "CONFIGURATION_ERROR",
          message: "Authentication is unavailable",
        },
      },
      { status: 500 },
    );
  }

  const token = await getToken({
    req: request,
    secret: authSecret,
  });
  if (token) return NextResponse.next();

  if (protectsMutation) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "callbackUrl",
    `${pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/library/:path*", "/playlist/:path*", "/api/:path*"],
};
