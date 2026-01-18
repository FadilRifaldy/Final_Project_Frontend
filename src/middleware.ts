import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JWTPayload {
  id: string;
  role: string;
}

function decodeJwt(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // 1. Cek Cookie
  let token = request.cookies.get("authToken")?.value;

  // 2. Jika Cookie kosong, Cek Header (Authorization: Bearer <token>)
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  // Jika masih kosong -> Redirect Sign In
  if (!token) {
    return NextResponse.redirect(new URL("/signInPage", request.url));
  }

  const pathname = request.nextUrl.pathname;

  // Decode tanpa verifikasi signature (verifikasi dilakukan di Backend)
  const payload = decodeJwt(token);

  if (!payload) {
     return NextResponse.redirect(new URL("/signInPage", request.url));
  }

  if (pathname.startsWith("/admin")) {
    const role = payload.role;
    if (role !== "SUPER_ADMIN" && role !== "STORE_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
