import { updateSession } from "./supabase/middleware";

export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Match all request paths except those starting with:
    // - _next/static
    // - _next/image
    // - favicon.ico
    // - image files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
