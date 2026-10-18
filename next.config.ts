import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: 'dist',
  // Tool pages retired or renamed in October 2026, to match the product: the
  // Daily Board grew into the platform's Calendar, Drafting moved into the
  // AI Assistant's chat, Case Finder became Case Status, and eFiling Support
  // became eFiling Assembly.
  async redirects() {
    return [
      { source: '/tools/daily-board', destination: '/platform#calendar', permanent: true },
      { source: '/tools/drafting', destination: '/platform#ai-assistant', permanent: true },
      { source: '/tools/case-finder', destination: '/tools/case-status', permanent: true },
      { source: '/tools/efiling-support', destination: '/tools/efiling-assembly', permanent: true },
    ];
  },
  images: {
    // First-party logo SVGs live in /public/logos and are rendered via next/image.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
};

export default nextConfig;
