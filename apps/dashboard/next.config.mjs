/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizeCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
