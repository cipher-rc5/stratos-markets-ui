// file: next.config.mjs
// description: Next.js configuration optimized for Bun runtime and Turbopack
// reference: bunfig.toml, package.json

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: false },
  // Optimize for Bun runtime
  experimental: {
    // Enable server actions for better performance
    serverActions: { bodySizeLimit: '2mb' }
  },
  // Turbopack configuration (Next.js 16+ default)
  turbopack: {
    // Turbopack handles module resolution efficiently by default
    // No additional configuration needed for Bun compatibility
  }
};

export default nextConfig;
