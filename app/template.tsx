// Tranziție discretă între pagini: conținutul nou urcă puțin, doar din CSS.
// Fără opacitate 0 la start — textul e vizibil de la prima afișare (contează la viteză).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
