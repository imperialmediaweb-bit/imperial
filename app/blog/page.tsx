import { BlogPreview } from "@/components/BlogPreview";

export const metadata = {
  title: "Blog — Imperial Media",
  description:
    "Articole, studii de caz și sfaturi despre web design, dezvoltare, marketing și tehnologie.",
};

export default function BlogPage() {
  return (
    <>
      <BlogPreview />
    </>
  );
}
