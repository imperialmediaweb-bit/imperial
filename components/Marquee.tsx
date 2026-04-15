// Marquee animat — text scrollează infinit. Stil "Aceternity / Magic UI".
export function Marquee() {
  const items = [
    "Consulting",
    "Website Design",
    "Digital Marketing",
    "E-Commerce",
    "Branding",
    "SEO",
  ];
  // duplicăm de 2 ori ca animația să fie continuă
  const all = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-bg-border/60 bg-bg-soft/40 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {all.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-12 font-display text-3xl font-extrabold text-text-muted/40 sm:text-5xl"
          >
            {item}
            <span className="text-brand-orange">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
