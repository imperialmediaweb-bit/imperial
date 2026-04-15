// Aurora background — gradient-uri colorate care se mișcă lent (ca aurora boreală).
// CSS pur cu blur masiv, foarte performant.

export function Aurora() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Aurora blob 1 — orange */}
      <div className="absolute -top-1/2 left-1/4 h-[700px] w-[700px] animate-aurora-1 rounded-full bg-brand-orange/30 blur-[120px]" />
      {/* Aurora blob 2 — purple */}
      <div className="absolute top-1/4 right-0 h-[600px] w-[600px] animate-aurora-2 rounded-full bg-brand-purple/35 blur-[140px]" />
      {/* Aurora blob 3 — pink/glow */}
      <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] animate-aurora-3 rounded-full bg-brand-glow/25 blur-[120px]" />
      {/* Conic gradient subtil */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(255,107,26,0.08) 25%, transparent 50%, rgba(123,47,247,0.08) 75%, transparent 100%)",
          animation: "spin-slow 30s linear infinite",
        }}
      />
    </div>
  );
}
