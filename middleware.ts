import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

function isCourseRoute(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname === "/admin/courses" ||
    pathname.startsWith("/admin/courses/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute || isAdminLoginRoute) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("admin_token")?.value ||
    request.cookies.get("auth_token")?.value;

  // Not logged in -> redirect to /admin/login
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = await verifyToken(token);

    const userRole = String(payload.role || "").toUpperCase();

    // SUPER_ADMIN -> full admin access
    if (userRole === "SUPER_ADMIN") {
      return NextResponse.next();
    }

    // ADMIN -> courses & dashboard
    if (userRole === "ADMIN") {
      if (isCourseRoute(pathname)) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // STUDENT / LEARNER -> no admin access, redirect to /admin/login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    // Invalid auth token -> redirect to /admin/login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
