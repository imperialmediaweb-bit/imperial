// QR-ul de recenzii al clientului — scanezi, aterizezi direct pe „Scrie o recenzie"
// la firma lui pe Google. Funcționează pentru clienții care și-au ales firma din
// lista Google în formular (avem placeId-ul salvat pe raport).

import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getClientEmail } from "@/lib/client-auth";
import { getServiceReportsByEmail } from "@/lib/service-reports";
import { hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let email: string | null = null;
  try {
    email = getClientEmail();
  } catch {
    email = null;
  }
  if (!email || !hasDb()) {
    return NextResponse.json({ error: "Intră întâi în contul tău." }, { status: 401 });
  }

  const reports = await getServiceReportsByEmail(email).catch(() => []);
  const placeId = [...reports].reverse().map((r) => String(r.form_data?.placeId ?? "")).find(Boolean);
  if (!placeId || !/^[\w-]{10,200}$/.test(placeId)) {
    return NextResponse.json(
      { error: "Nu avem încă profilul tău Google — generează un raport nou și alege-ți firma din lista Google." },
      { status: 404 }
    );
  }

  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  const svg = await QRCode.toString(reviewUrl, {
    type: "svg",
    width: 480,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#170b2e", light: "#ffffff" },
  });

  const { searchParams } = new URL(req.url);
  const headers: Record<string, string> = {
    "Content-Type": "image/svg+xml",
    // no-store: pe un calculator partajat, alt cont logat NU trebuie să primească QR-ul precedentului
    "Cache-Control": "private, no-store",
  };
  if (searchParams.get("d") === "1") {
    headers["Content-Disposition"] = 'attachment; filename="qr-recenzii-google.svg"';
  }
  return new Response(svg, { headers });
}
