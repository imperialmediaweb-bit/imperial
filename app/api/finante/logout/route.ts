import { NextResponse } from "next/server";
import { FIN_COOKIE } from "@/lib/finante/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: FIN_COOKIE, value: "", path: "/", maxAge: 0 });
  return res;
}
