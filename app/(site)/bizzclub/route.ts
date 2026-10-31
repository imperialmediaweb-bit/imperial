// Link scurt de partener: imperial-media.ro/bizzclub → /service cu reducerea aplicată.

import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/site";

export function GET(req: Request) {
  const origin = publicOrigin(req);
  return NextResponse.redirect(`${origin}/service?partener=bizzclub`, 302);
}
