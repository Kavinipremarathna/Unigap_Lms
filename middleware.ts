import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

function isCourseRoute(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname === "/admin/courses" ||
    pathname.startsWith("/admin/courses/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  // Not logged in
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = verifyToken(token);

    // SUPER ADMIN -> full admin access
    if (payload.role === "SUPER_ADMIN") {
      return NextResponse.next();
    }

    // ADMIN -> courses only
    if (payload.role === "ADMIN") {
      if (isCourseRoute(pathname)) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // STUDENT -> no admin access
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Invalid auth token:", error);

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
