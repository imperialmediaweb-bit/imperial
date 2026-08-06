// Meniul unic al adminului — aceleași taburi pe toate paginile de administrare.

import Link from "next/link";

const TABS = [
  { href: "/admin", key: "leads", label: "📥 Lead-uri" },
  { href: "/admin/rapoarte", key: "rapoarte", label: "📊 Rapoarte & abonați" },
  { href: "/admin/prospects", key: "prospects", label: "🎯 Prospectare" },
];

export function AdminNav({ active }: { active: "leads" | "rapoarte" | "prospects" }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-bg-border/60 pb-4">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            active === t.key
              ? "border-brand-orange bg-brand-orange/15 text-text"
              : "border-bg-border bg-bg-card/60 text-text-muted hover:border-brand-orange/50"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
