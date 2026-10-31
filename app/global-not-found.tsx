// Pagina 404 pentru adresele care nu există (site-ul și panoul Finanțe au layout-uri separate).
import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagina nu există · Imperial Media",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="ro">
      <body className="min-h-screen bg-bg text-text antialiased">
        <main className="grid min-h-screen place-items-center px-4 text-center">
          <div>
            <p className="font-jmono text-xs uppercase tracking-[0.3em] text-white/50">Eroare 404</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold">Pagina nu există</h1>
            <p className="mt-3 text-text-muted">Linkul poate fi greșit sau pagina a fost mutată.</p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white">
              Înapoi pe imperial-media.ro
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
