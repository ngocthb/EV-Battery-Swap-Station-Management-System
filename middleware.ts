import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - không cần auth
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  // Kiểm tra có token không (frontend sẽ tự redirect nếu không có token)
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Với frontend, ta không verify JWT ở đây mà để backend verify
  // Layout components sẽ kiểm tra quyền dựa trên Redux store
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
