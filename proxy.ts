// Panoul Finanțe trăiește doar pe finante.imperial-media.ro.
// Pe subdomeniu: orice cale se rescrie spre /finante/* (și /api/finante/*), nimic din site-ul public.
// Pe orice alt host: /finante și /api/finante nu există (404) — panoul nu se poate găsi din site.

import { NextResponse, type NextRequest } from "next/server";

const FINANTE_HOSTS = ["finante.imperial-media.ro", "finante.localhost"];

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;
  const peFinante = FINANTE_HOSTS.includes(host);
  const caleFinante = pathname === "/finante" || pathname.startsWith("/finante/") || pathname.startsWith("/api/finante");

  if (!peFinante) {
    if (caleFinante) return new NextResponse("Not Found", { status: 404 });
    return NextResponse.next();
  }

  // pe subdomeniu: tot ce nu e deja /finante sau /api/finante se rescrie spre panou
  let res: NextResponse;
  if (caleFinante) {
    res = NextResponse.next();
  } else if (pathname.startsWith("/api/")) {
    res = new NextResponse("Not Found", { status: 404 });
  } else {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/finante" : `/finante${pathname}`;
    res = NextResponse.rewrite(url);
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  // fără fișierele statice și imagini — doar pagini și API
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml|woff2?)$).*)"],
};
