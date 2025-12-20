import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const pwaConfig = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // This ensures the service worker is updated immediately
  reloadOnOnline: true,
  // PWA is disabled in development to prevent caching old code
  disable: process.env.NODE_ENV === "development",
  // Crucial fix for icons/manifest not loading correctly in some Next.js builds
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  reactStrictMode: true,
  // Ensure Supabase images can be optimized/loaded
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default pwaConfig(nextConfig);
