import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PREFIXES = ["/unlock", "/api/unlock"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isPublic) return NextResponse.next();

  const unlocked = request.cookies.get("lp_unlocked")?.value === "1";
  if (unlocked) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  if (pathname !== "/") url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
