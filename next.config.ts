import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://app-levelup-ecosystem.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/retrouvailles",
        destination: "/projects/wedding-invitation",
        permanent: true,
      },
      {
        source: "/retrouvailles.html",
        destination: "/projects/wedding-invitation",
        permanent: true,
      },
      {
        source: "/wedding-invitation",
        destination: "/projects/wedding-invitation",
        permanent: true,
      },
      {
        source: "/wedding-invitation.html",
        destination: "/projects/wedding-invitation",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
