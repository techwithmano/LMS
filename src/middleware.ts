import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                      req.nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Role-based access control
    const role = token?.role as string;
    const path = req.nextUrl.pathname;

    // Admin and owner routes
    if (path.startsWith("/users/manage") || path.startsWith("/settings")) {
      if (role !== "ADMIN" && role !== "OWNER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Owner-only routes
    if (path.startsWith("/settings/site")) {
      if (role !== "OWNER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/quizzes/:path*",
    "/announcements/:path*",
    "/messages/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
}; 