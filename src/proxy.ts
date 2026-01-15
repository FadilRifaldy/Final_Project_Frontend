import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const cookieToken = request.cookies.get("authToken")?.value;
  if (!cookieToken) {
    return NextResponse.redirect(new URL("/signInPage", request.url));
  }

  const pathname = request.nextUrl.pathname;
  const payload = jwt.verify(cookieToken!, "supersaiyanultrainstinctsecret");

  if (pathname === "/dashboard") {
    const role = payload.role; 
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  if (pathname === "/discount") {
    const role = payload.role; 
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ["/dashboard/:path*", "/discount/:path*"]
};
