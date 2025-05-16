import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-at-least-32-characters-long")

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
  ]

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Protected paths and their required roles
  const protectedPaths = [
    { path: "/pengguna", role: "CUSTOMER" },
    { path: "/admin", role: "ADMIN" },
    { path: "/super-admin", role: "SUPER_ADMIN" },
  ]

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userRole = payload.role as string

    // Check if user has access to the path
    for (const { path, role } of protectedPaths) {
      if (pathname.startsWith(path) && userRole !== role) {
        // Redirect based on role
        if (userRole === "CUSTOMER") {
          return NextResponse.redirect(new URL("/pengguna", request.url))
        } else if (userRole === "ADMIN") {
          return NextResponse.redirect(new URL("/admin", request.url))
        } else if (userRole === "SUPER_ADMIN") {
          return NextResponse.redirect(new URL("/super-admin", request.url))
        }
      }
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
