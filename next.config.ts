import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false
    };

    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    return config;
  },
  transpilePackages: ['@privy-io/react-auth'],
  experimental: { optimizePackageImports: ['@privy-io/react-auth'] }
};

export default nextConfig;
