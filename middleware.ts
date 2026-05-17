import { NextResponse, type NextRequest } from "next/server";

const roleCookie = "atomquest-role";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/dashboard")) return NextResponse.next();

  const role = request.cookies.get(roleCookie)?.value;
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const allowedPrefix = `/dashboard/${role}`;
  if (!path.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(allowedPrefix, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
