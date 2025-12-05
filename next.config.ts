import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ["@privy-io/react-auth"],
    turbo: {
      resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
  },
  transpilePackages: ["@privy-io/react-auth"],
}

export default nextConfig
