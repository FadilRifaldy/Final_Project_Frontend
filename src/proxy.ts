import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: string;
  role: string;
}

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const cookieToken = request.cookies.get("authToken")?.value;
  if (!cookieToken) {
    return NextResponse.redirect(new URL("/signInPage", request.url));
  }

  const pathname = request.nextUrl.pathname;
  const payload = jwt.verify(cookieToken!, "supersaiyanultrainstinctsecret") as JWTPayload;

  if (pathname.startsWith("/admin")) {
    const role = payload.role;
    if (role !== "SUPER_ADMIN" && role !== "STORE_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// protect route dari group admin
export const config = {
  matcher: ["/admin/:path*"]
};
