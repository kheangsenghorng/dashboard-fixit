import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  const isLoginPage = pathname === "/login";

  // "/" and "/admin" are protected
  const isProtected =
    pathname === "/" || pathname.startsWith("/admin");

  // Not logged in → protected page
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in → login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};
