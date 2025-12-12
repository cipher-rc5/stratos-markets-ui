# 🔌 API Integration Guide

This document explains how the Stratos Markets UI integrates with the external Stratos Markets API and local API routes.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Testing](#testing)

## 🏗️ Architecture Overview

The application uses a **hybrid API architecture** with two layers:

### 1. External Stratos Markets API

**Base URL:** `https://stratos-markets-api.vercel.app/v1`

Handles:
- ✅ Trading strategies marketplace
- ✅ AI agents management
- ✅ Authentication
- ✅ x402 payment integration

### 2. Local Next.js API Routes

**Base URL:** `/api` (relative) or `http://localhost:3000/api` (absolute)

Handles:
- ✅ Portfolio data (Dune API proxy)
- ✅ Market data (price feeds, charts)
- ✅ Server-side API key protection
- ✅ Data transformation and caching

```
┌─────────────────────────────────────────────┐
│           Frontend (React)                  │
│  ┌──────────────────────────────────────┐  │
│  │      API Client (lib/api-client.ts)  │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
           │                    │
           │                    │
    ┌──────▼──────┐      ┌─────▼──────┐
    │  External   │      │   Local    │
    │  Stratos    │      │   Next.js  │
    │  Markets    │      │   API      │
    │  API        │      │   Routes   │
    └─────────────┘      └────────────┘
                               │
                         ┌─────▼──────┐
                         │  External  │
                         │  Services  │
                         │  (Dune,    │
                         │  Alchemy)  │
                         └────────────┘
```

## 🔗 API Endpoints

### External API (Stratos Markets)

#### Strategies

```typescript
GET    /v1/strategies              // List all strategies
GET    /v1/strategies/:id          // Get strategy details
POST   /v1/strategies              // Create new strategy
PATCH  /v1/strategies/:id          // Update strategy
DELETE /v1/strategies/:id          // Delete strategy
POST   /v1/strategies/:id/subscribe // Subscribe to strategy
```

#### Agents

```typescript
GET    /v1/agents                  // List all agents
GET    /v1/agents/:id              // Get agent details
POST   /v1/agents                  // Deploy new agent
PATCH  /v1/agents/:id              // Update agent
DELETE /v1/agents/:id              // Delete agent
POST   /v1/agents/:id/execute      // Execute agent
GET    /v1/agents/:id/execute      // Get execution history
```

#### Authentication

```typescript
POST   /v1/auth                    // Authenticate user
```

### Local API Routes

#### Portfolio

```typescript
GET    /api/portfolio/:address          // Get portfolio for wallet
GET    /api/portfolio/history           // Get portfolio history
GET    /api/portfolio/transactions      // Get transactions
```

#### Market Data

```typescript
GET    /api/market                      // List market data
GET    /api/market/:symbol              // Get asset details
GET    /api/market/:symbol/chart        // Get chart data
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Required: External API endpoint
NEXT_PUBLIC_API_URL=https://stratos-markets-api.vercel.app/v1

# Optional: External service API keys (server-side only)
DUNE_API_KEY=your_dune_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
INFURA_API_KEY=your_infura_api_key

# Optional: x402 Payment configuration
X402_NETWORK=base-sepolia
X402_FACILITATOR=https://x402.org/facilitator
X402_PAY_TO=0x90a7130B48764D9613666A14D00eA0b824C8b390
```

### API Configuration File

The API configuration is centralized in `lib/api-config.ts`:

```typescript
import { STRATOS_API_BASE_URL, LOCAL_API_BASE_URL, API_ENDPOINTS } from './api-config';

// Use external API
const strategiesUrl = API_ENDPOINTS.strategies.list();

// Use local API
const portfolioUrl = API_ENDPOINTS.portfolio.get('0x123...');
```

## 💻 Usage Examples

### Using the API Client

The recommended way to interact with APIs is through the `apiClient`:

```typescript
import { apiClient } from '@/lib/api-client';

// Fetch strategies (external API)
const response = await apiClient.strategies.list({
  category: 'arbitrage',
  verified: true,
  limit: 10
});

if (response.success) {
  console.log('Strategies:', response.data);
} else {
  console.error('Error:', response.error);
}

// Fetch portfolio (local API → Dune API)
const portfolio = await apiClient.portfolio.get('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

if (portfolio.success) {
  console.log('Portfolio:', portfolio.data);
}
```

### Using React Hooks

For React components, use the provided hooks:

```typescript
import { useStrategies } from '@/lib/hooks/use-strategies';
import { usePortfolio } from '@/lib/hooks/use-portfolio';

function MyComponent() {
  // Fetch strategies from external API
  const { strategies, loading, error } = useStrategies({
    category: 'yield-farming'
  });

  // Fetch portfolio from local API
  const { portfolio } = usePortfolio('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {strategies.map(strategy => (
        <div key={strategy.id}>{strategy.name}</div>
      ))}
    </div>
  );
}
```

### Direct Fetch (Not Recommended)

If you need to make direct fetch calls:

```typescript
// External API
const response = await fetch('https://stratos-markets-api.vercel.app/v1/strategies');
const data = await response.json();

// Local API (client-side)
const response = await fetch('/api/portfolio/0x123...');
const data = await response.json();
```

## 🚨 Error Handling

### API Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}
```

### Error Handling Example

```typescript
const response = await apiClient.strategies.get('strategy-id');

if (!response.success) {
  // Handle error
  switch (response.error) {
    case 'Not found':
      console.error('Strategy not found');
      break;
    case 'Unauthorized':
      console.error('Authentication required');
      break;
    default:
      console.error('Unknown error:', response.error);
  }
  return;
}

// Success - use data
const strategy = response.data;
```

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process data |
| 400 | Bad Request | Validate input |
| 401 | Unauthorized | Authenticate user |
| 404 | Not Found | Show not found message |
| 429 | Rate Limited | Implement retry logic |
| 500 | Server Error | Show error message |
| 502 | Bad Gateway | Retry request |

## 🧪 Testing

### Testing with the API Client

```typescript
import { describe, test, expect } from 'bun:test';
import { apiClient } from '@/lib/api-client';

describe('API Client', () => {
  test('should fetch strategies', async () => {
    const response = await apiClient.strategies.list();
    
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should handle errors gracefully', async () => {
    const response = await apiClient.strategies.get('invalid-id');
    
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
  });
});
```

### Testing Local API Routes

```typescript
import { GET } from '@/app/api/portfolio/[address]/route';
import { NextRequest } from 'next/server';

describe('Portfolio API', () => {
  test('should return portfolio data', async () => {
    const request = new NextRequest('http://localhost:3000/api/portfolio/0x123...');
    const params = { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' };
    
    const response = await GET(request, { params: Promise.resolve(params) });
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.balances).toBeDefined();
  });
});
```

### Manual Testing

```bash
# Test external API
curl https://stratos-markets-api.vercel.app/v1/strategies

# Test local API (requires dev server running)
bun dev
curl http://localhost:3000/api/portfolio/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## 🔒 Security Best Practices

1. **Never expose API keys in client-side code**
   - Use environment variables
   - Keep server-side keys in `.env.local` (not `.env`)
   - Use local API routes as proxies

2. **Validate all inputs**
   - Validate wallet addresses
   - Sanitize user inputs
   - Use TypeScript for type safety

3. **Handle errors gracefully**
   - Don't expose internal error details
   - Log errors server-side
   - Show user-friendly messages

4. **Rate limiting**
   - Implement rate limiting for local API routes
   - Cache responses when possible
   - Use debouncing for user inputs

## 📊 Performance Optimization

### Caching

```typescript
// Cache strategy responses for 5 minutes
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

async function get_strategies_cached() {
  const cache_key = 'strategies';
  const cached = cache.get(cache_key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await apiClient.strategies.list();
  cache.set(cache_key, { data: response, timestamp: Date.now() });
  
  return response;
}
```

### Request Batching

```typescript
// Batch multiple requests
const [strategies, agents, portfolio] = await Promise.all([
  apiClient.strategies.list(),
  apiClient.agents.list(),
  apiClient.portfolio.get(walletAddress)
]);
```

## 🔄 Migration Guide

### From Local API to External API

If you're migrating from using local API routes to the external API:

1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Update API client configuration in `lib/api-config.ts`
3. Test all endpoints
4. Update any hardcoded URLs

### From External API to Local API

If you need to proxy through local routes:

1. Create API route in `app/api/`
2. Update `lib/api-config.ts` to use local endpoint
3. Update API client method to use `use_stratos_api = false`

## 📚 Additional Resources

- [Stratos Markets API Documentation](https://docs.stratos.markets)
- [x402 Payment Protocol](https://x402.org)
- [Dune Analytics API](https://dune.com/docs/api)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Need help?** Open an issue or check the [main README](./README.md) for more information.
