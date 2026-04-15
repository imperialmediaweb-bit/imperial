/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.imperial-media.ro" },
      { protocol: "https", hostname: "imperial-media.ro" },
    ],
  },
};

export default nextConfig;
