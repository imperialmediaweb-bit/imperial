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
      {
        source: "/creare-site-web-:slug",
        destination: "/creare-site-web/:slug",
      },
    ];
  },
  async redirects() {
    // 1) Un singur domeniu canonic: www.* și tools.* trimit 301 către imperial-media.ro
    //    (Search Console arăta 94 de duplicate pe tools.* și 46 de 404-uri pe www.*)
    const hostRedirects = ["www.imperial-media.ro", "tools.imperial-media.ro"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://imperial-media.ro/:path*",
      permanent: true,
    }));

    // 2) URL-urile vechiului site WordPress → paginile echivalente din site-ul nou
    const legacyMap = [
      ["/despre-noi", "/despre"],
      ["/cere-oferta", "/brief"],
      ["/creare-magazin-online", "/servicii"],
      ["/website-uri-de-prezentare", "/servicii"],
      ["/mentenanta-web", "/servicii"],
      ["/dezvoltare-web", "/servicii"],
      ["/graphic-design", "/servicii"],
      ["/pr-marketing-digital", "/servicii"],
      ["/services-01", "/servicii"],
      ["/our-mission", "/despre"],
      ["/faqs", "/despre"],
      ["/team-01", "/despre"],
      ["/team-02", "/despre"],
      ["/team-details", "/despre"],
      ["/testimonials-01", "/despre"],
      ["/testimonials-02", "/despre"],
      ["/projects-list", "/proiecte"],
      ["/elementor-widgets", "/"],
      ["/homepage", "/"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }));

    const legacyPatterns = [
      { source: "/projects-item/:slug*", destination: "/proiecte", permanent: true },
      { source: "/projects-category/:slug*", destination: "/proiecte", permanent: true },
      { source: "/portfolio/:slug*", destination: "/proiecte", permanent: true },
      { source: "/landing/:slug*", destination: "/", permanent: true },
      { source: "/news-:slug*", destination: "/blog", permanent: true },
      { source: "/home-layout:slug*", destination: "/", permanent: true },
      { source: "/author/:slug*", destination: "/blog", permanent: true },
    ];

    return [...hostRedirects, ...legacyMap, ...legacyPatterns];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
