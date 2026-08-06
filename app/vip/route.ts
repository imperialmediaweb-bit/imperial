// Link scurt de invitație VIP: imperial-media.ro/vip → raport gratuit.
// Discret — se dă doar personal (președinți de club, presă, parteneri).

import { NextResponse } from "next/server";

export function GET(req: Request) {
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(`${origin}/service?partener=vip-imperial`, 302);
}
