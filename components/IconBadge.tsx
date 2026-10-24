import type { LucideIcon } from "lucide-react";

// Medalion rotund de sticlă cu inel gradient și glow — icoana-bijuterie a site-ului.
export function IconBadge({ icon: Icon, className = "" }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={`icon-badge ${className}`}>
      <Icon className="h-6 w-6" strokeWidth={1.7} />
    </span>
  );
}
