/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.imperial-media.ro" },
      { protocol: "https", hostname: "imperial-media.ro" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "s.wordpress.com" },
      { protocol: "https", hostname: "s0.wp.com" },
      { protocol: "https", hostname: "image.thum.io" },
    ],
  },
  async rewrites() {
    return [
      // SEO: /creare-site-web-botosani → /creare-site-web/botosani (flat URL)
      {
        source: "/creare-site-web-:slug",
        destination: "/creare-site-web/:slug",
      },
    ];
  },
};

export default nextConfig;
