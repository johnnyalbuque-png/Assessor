import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const autenticado = req.cookies.get("admin_auth")?.value === "true";
    if (!autenticado && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/fornecedor")) {
    const token = req.cookies.get("forn_session")?.value;
    if (!token && pathname !== "/fornecedor/login") {
      return NextResponse.redirect(new URL("/fornecedor/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/fornecedor/:path*"],
};
