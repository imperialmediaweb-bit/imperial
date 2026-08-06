// Link scurt de partener: imperial-media.ro/bizzclub → /service cu reducerea aplicată.

import { NextResponse } from "next/server";

export function GET(req: Request) {
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/service?partener=bizzclub`, 302);
}
