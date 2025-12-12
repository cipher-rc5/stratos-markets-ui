// file: lib/api-config.ts
// description: API configuration and endpoint management for Stratos Markets
// reference: lib/api-client.ts, .env.example

/**
 * API Configuration
 * 
 * The application uses a hybrid API architecture:
 * - External Stratos Markets API: For strategies, agents, and marketplace data
 * - Local Next.js API Routes: For portfolio data (Dune API proxy) and other services
 */

// External Stratos Markets API
export const STRATOS_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stratos-markets-api.vercel.app/v1';

// Local API routes (for services not provided by external API)
export const LOCAL_API_BASE_URL = typeof window !== 'undefined' ? '/api' : 'http://localhost:3000/api';

// API Metadata (from external API)
export const API_METADATA = {
  name: 'Stratos Markets API',
  version: '1.0.0',
  description: 'Decentralized DeFi Strategy Marketplace with x402 Payments',
  documentation: 'https://docs.stratos.markets',
  x402: {
    network: 'base-sepolia',
    facilitator: 'https://x402.org/facilitator',
    payTo: '0x90a7130B48764D9613666A14D00eA0b824C8b390'
  }
};

// Endpoint mapping
export const API_ENDPOINTS = {
  // External API endpoints (Stratos Markets API)
  strategies: {
    base: `${STRATOS_API_BASE_URL}/strategies`,
    list: () => `${STRATOS_API_BASE_URL}/strategies`,
    get: (id: string) => `${STRATOS_API_BASE_URL}/strategies/${id}`,
    subscribe: (id: string) => `${STRATOS_API_BASE_URL}/strategies/${id}/subscribe`
  },
  
  agents: {
    base: `${STRATOS_API_BASE_URL}/agents`,
    list: () => `${STRATOS_API_BASE_URL}/agents`,
    get: (id: string) => `${STRATOS_API_BASE_URL}/agents/${id}`,
    execute: (id: string) => `${STRATOS_API_BASE_URL}/agents/${id}/execute`
  },
  
  auth: {
    base: `${STRATOS_API_BASE_URL}/auth`
  },
  
  // Local API endpoints (Next.js routes for services not in external API)
  portfolio: {
    base: `${LOCAL_API_BASE_URL}/portfolio`,
    get: (address: string) => `${LOCAL_API_BASE_URL}/portfolio/${address}`,
    history: () => `${LOCAL_API_BASE_URL}/portfolio/history`,
    transactions: () => `${LOCAL_API_BASE_URL}/portfolio/transactions`
  },
  
  market: {
    base: `${LOCAL_API_BASE_URL}/market`,
    get: (symbol: string) => `${LOCAL_API_BASE_URL}/market/${symbol}`,
    chart: (symbol: string) => `${LOCAL_API_BASE_URL}/market/${symbol}/chart`
  }
};

// Helper function to determine if endpoint is external or local
export function is_external_endpoint(endpoint: string): boolean {
  return endpoint.startsWith(STRATOS_API_BASE_URL);
}

// Helper function to get full URL for an endpoint
export function get_api_url(path: string, use_external = true): string {
  const base_url = use_external ? STRATOS_API_BASE_URL : LOCAL_API_BASE_URL;
  return `${base_url}${path.startsWith('/') ? path : `/${path}`}`;
}
