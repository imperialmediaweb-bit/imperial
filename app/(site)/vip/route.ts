// Link scurt de invitație VIP: imperial-media.ro/vip → raport gratuit.
// Discret — se dă doar personal (președinți de club, presă, parteneri).

import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/site";

export function GET(req: Request) {
  const origin = publicOrigin(req);
  return NextResponse.redirect(`${origin}/service?partener=vip-imperial`, 302);
}
