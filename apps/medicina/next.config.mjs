/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pacotes do monorepo consumidos como source (sem build step).
  transpilePackages: ["@florence/lib"],
  // Inline critical CSS via critters → elimina render-blocking de ~300ms
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
