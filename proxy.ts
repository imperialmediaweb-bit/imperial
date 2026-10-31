// Panoul Finanțe: imperial-media.ro/finante (și, opțional, finante.imperial-media.ro).
// Nu există niciun link spre el din site; accesul e doar cu login. Pe toate căile panoului:
// noindex (nu apare în Google) și fără cache.

import { NextResponse, type NextRequest } from "next/server";

const FINANTE_HOSTS = ["finante.imperial-media.ro", "finante.localhost"];

function privat(res: NextResponse): NextResponse {
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;
  const peSubdomeniu = FINANTE_HOSTS.includes(host);
  const caleFinante = pathname === "/finante" || pathname.startsWith("/finante/") || pathname.startsWith("/api/finante");

  if (!peSubdomeniu) {
    return caleFinante ? privat(NextResponse.next()) : NextResponse.next();
  }

  // pe subdomeniu: tot ce nu e deja /finante sau /api/finante se rescrie spre panou
  if (caleFinante) return privat(NextResponse.next());
  if (pathname.startsWith("/api/")) return privat(new NextResponse("Not Found", { status: 404 }));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/finante" : `/finante${pathname}`;
  return privat(NextResponse.rewrite(url));
}

export const config = {
  // fără fișierele statice și imagini — doar pagini și API
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml|woff2?)$).*)"],
};
