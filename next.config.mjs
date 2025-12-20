import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const pwaConfig = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  reactStrictMode: true,
  // This tells Next.js 16 to allow the Webpack-based PWA plugin
  webpack: (config) => {
    return config;
  },
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
