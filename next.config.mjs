import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // PWA is disabled in local development to avoid caching issues while coding
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  // Silence Turbopack warnings for Webpack-based plugins
  experimental: {
    turbopack: {},
  },
  // Ensure the app works correctly with the custom player and supabase
  reactStrictMode: true,
};

export default withPWA(nextConfig);
