// Meteor shower — stele căzătoare diagonale.
// Pur CSS, foarte performant, fără re-renderuri.

export function Meteors({ count = 20 }: { count?: number }) {
  const meteors = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {meteors.map((i) => {
        const left = Math.random() * 100;
        const top = Math.random() * -50;
        const delay = Math.random() * 8;
        const duration = 4 + Math.random() * 6;
        return (
          <span
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_20px_2px_rgba(255,255,255,0.5)]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animation: `meteor ${duration}s linear ${delay}s infinite`,
            }}
          >
            <span
              className="absolute right-0 top-1/2 h-px w-[80px] -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-orange to-white"
              style={{ transform: "rotate(20deg) translateY(-1px)" }}
            />
          </span>
        );
      })}
    </div>
  );
}
