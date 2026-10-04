import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      {
        source: "/blackpater",
        destination: "/projects/blackpater",
        permanent: true,
      },
      {
        source: "/blackpater.html",
        destination: "/projects/blackpater",
        permanent: true,
      },
      {
        source: "/projects/blackpater-portofolio",
        destination: "/projects/blackpater",
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
