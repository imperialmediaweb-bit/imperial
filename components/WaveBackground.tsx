// Decorativ — valuri animate cu gradient roșu/portocaliu, ca pe imperial-media.ro
export function WaveBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-brand-purple/30 blur-[120px]" />
      <div className="absolute -top-20 right-0 h-[400px] w-[600px] rounded-full bg-brand-orange/20 blur-[140px]" />

      {/* SVG diagonal waves */}
      <svg
        className="absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7B2FF7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E0540C" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,180 Q360,80 720,200 T1440,150 L1440,0 L0,0 Z"
          fill="url(#wave1)"
        />
        <path
          d="M0,260 Q480,160 960,300 T1440,240 L1440,40 L0,40 Z"
          fill="url(#wave2)"
        />
        {/* Linii diagonale subtile (efectul "wave-uri") */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M${-200 + i * 220},800 Q${100 + i * 220},400 ${400 + i * 220},0`}
            stroke="rgba(255,107,26,0.08)"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-25" />
    </div>
  );
}
