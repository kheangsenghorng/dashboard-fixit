import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isLoginPage = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");
  const isOwner = pathname.startsWith("/owner");

  // 1. Not logged in → block protected pages
  if (!token && (isAdmin || isOwner)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based protection
  if (token && role) {
    if (isAdmin && role !== "admin") {
      return NextResponse.redirect(
        new URL("/owner/dashboard", request.url)
      );
    }

    if (isOwner && role !== "owner") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
  }

  // 3. Logged-in user opens login page
  if (token && isLoginPage) {
    if (role === "admin") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
    if (role === "owner") {
      return NextResponse.redirect(
        new URL("/owner/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/owner/:path*"],
};
