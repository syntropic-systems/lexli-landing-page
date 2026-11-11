import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: 'dist',
  // PostHog is served from our own origin so ad-blockers don't drop events. PostHog's API paths
  // end in a slash, which Next would otherwise redirect before rewriting.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ];
  },
  images: {
    // First-party logo SVGs live in /public/logos and are rendered via next/image.
    dangerouslyAllowSVG: true,
    // Captures carry a ?v= cache-buster (see CAPTURES_VERSION in
    // components/platform-hub.tsx); Next only optimises local images with a
    // query string when a local pattern allows it.
    localPatterns: [{ pathname: '/**' }],
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
