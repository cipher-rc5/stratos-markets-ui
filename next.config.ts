import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  serverExternalPackages: ['thread-stream', 'pino', '@walletconnect/logger'],
  experimental: { optimizePackageImports: ['@privy-io/react-auth'] },
  transpilePackages: ['@privy-io/react-auth']
};

export default nextConfig;
