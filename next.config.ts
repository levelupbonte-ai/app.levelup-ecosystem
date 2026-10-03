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
