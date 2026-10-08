import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  output: "standalone",
  devIndicators: false,
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-label",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
    ],
  },
  webpack: (config) => {
    config.output = {
      ...config.output,
      chunkLoadTimeout: 300000,
    };
    return config;
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "**.ibb.co",
      },
    ],
  },
  async redirects() {
    return [
      // The client dashboard is its own app.
      {
        source: "/dashboard/:path*",
        destination: "https://dashboard.levelup-ecosystem.com/dashboard/site",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "https://dashboard.levelup-ecosystem.com/dashboard/site",
        permanent: true,
      },
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
        destination: "https://blackpater.com",
        permanent: true,
      },
      {
        source: "/blackpater.html",
        destination: "https://blackpater.com",
        permanent: true,
      },
      {
        source: "/projects/blackpater-portofolio",
        destination: "https://blackpater.com",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // LevelUp tag: embedded on client websites.
        source: "/sdk/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Only LevelUp itself may frame these pages (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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
