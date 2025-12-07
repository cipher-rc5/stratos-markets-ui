# Stratos Markets API Documentation

This document provides comprehensive documentation for all API endpoints integrated into the Stratos Markets UI application.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API uses wallet address verification. In production, implement proper authentication using:
- JWT tokens
- Wallet signature verification
- API keys for external integrations

## API Endpoints

### Strategies

#### GET `/api/strategies`
List all trading strategies with optional filtering and pagination.

**Query Parameters:**
- `category` (string): Filter by category (yield-farming, arbitrage, mev, other)
- `verified` (boolean): Show only verified strategies
- `riskLevel` (string): Filter by risk level (low, medium, high)
- `minRoi` (number): Minimum ROI percentage
- `maxRoi` (number): Maximum ROI percentage
- `search` (string): Search in name, description, and tags
- `sortBy` (string): Field to sort by (default: createdAt)
- `order` (string): Sort order (asc, desc)
- `limit` (number): Number of results (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "strat_abc123",
      "name": "DCA Bitcoin Strategy",
      "description": "...",
      "creator": "0x...",
      "version": "1.2.0",
      "performance": {
        "roi": 24.5,
        "sharpeRatio": 1.8,
        "maxDrawdown": -12.3,
        "winRate": 68.5,
        "totalTrades": 342
      },
      "pricing": {
        "type": "flat",
        "amount": 100,
        "currency": "USDC"
      },
      "tags": ["DCA", "Bitcoin"],
      "subscribers": 342,
      "verified": true,
      "riskLevel": "low",
      "createdAt": "2025-12-03T19:46:25.828Z",
      "updatedAt": "2025-12-03T19:46:25.828Z"
    }
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### GET `/api/strategies/[id]`
Get detailed information about a specific strategy.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "strat_abc123",
    "name": "DCA Bitcoin Strategy",
    ...
  }
}
```

#### POST `/api/strategies`
Create a new trading strategy.

**Request Body:**
```json
{
  "name": "My Strategy",
  "description": "Strategy description",
  "creator": "0x...",
  "version": "1.0.0",
  "performance": {...},
  "pricing": {...},
  "tags": ["tag1", "tag2"],
  "category": "arbitrage",
  "riskLevel": "medium"
}
```

#### PATCH `/api/strategies/[id]`
Update an existing strategy.

#### DELETE `/api/strategies/[id]`
Delete a strategy.

#### POST `/api/strategies/[id]/subscribe`
Subscribe to a strategy.

**Request Body:**
```json
{
  "walletAddress": "0x..."
}
```

#### DELETE `/api/strategies/[id]/subscribe`
Unsubscribe from a strategy.

**Query Parameters:**
- `walletAddress` (string, required)

---

### Agents

#### GET `/api/agents`
List all AI agents with optional filtering.

**Query Parameters:**
- `type` (string): trading, analytics, automation, monitoring
- `status` (string): active, inactive, maintenance
- `verified` (boolean): Show only verified agents
- `minSuccessRate` (number): Minimum success rate
- `search` (string): Search term
- `sortBy` (string): Sort field
- `order` (string): asc or desc
- `limit` (number): Results per page
- `offset` (number): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent_001",
      "name": "Alpha Sniper Bot",
      "description": "...",
      "type": "trading",
      "status": "active",
      "capabilities": ["MEV Protection", "Flash Loans"],
      "pricing": {
        "type": "usage-based",
        "amount": 0.1,
        "currency": "ETH",
        "billingPeriod": "per-transaction"
      },
      "metrics": {
        "totalExecutions": 15420,
        "successRate": 94.5,
        "avgExecutionTime": 2.3,
        "uptime": 99.8
      },
      "verified": true
    }
  ]
}
```

#### GET `/api/agents/[id]`
Get agent details.

#### POST `/api/agents`
Deploy a new agent.

#### PATCH `/api/agents/[id]`
Update agent configuration.

#### DELETE `/api/agents/[id]`
Remove an agent.

#### POST `/api/agents/[id]/execute`
Execute an agent.

**Request Body:**
```json
{
  "walletAddress": "0x...",
  "parameters": {
    "custom": "params"
  }
}
```

#### GET `/api/agents/[id]/execute`
Get execution history for an agent.

**Query Parameters:**
- `walletAddress` (string, optional)
- `limit` (number)
- `offset` (number)

---

### Portfolio

#### GET `/api/portfolio`
Get portfolio data for a wallet.

**Query Parameters:**
- `walletAddress` (string, required)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "portfolio_001",
    "walletAddress": "0x...",
    "assets": [
      {
        "symbol": "ETH",
        "name": "Ethereum",
        "amount": 5.2345,
        "value": 5.2345,
        "valueUSD": 10469.0,
        "price": 2000.0,
        "priceChange24h": 3.5,
        "allocation": 45.2
      }
    ],
    "performance": {
      "totalValue": 5160.5845,
      "totalValueUSD": 23105.0,
      "dailyChange": 356.5,
      "dailyChangePercent": 1.57,
      "weeklyChange": 1245.3,
      "weeklyChangePercent": 5.68
    },
    "activeStrategies": ["strat_abc123"],
    "activeAgents": ["agent_001"],
    "lastUpdated": "2025-12-07T..."
  }
}
```

#### POST `/api/portfolio`
Create or update portfolio.

#### GET `/api/portfolio/history`
Get historical portfolio data.

**Query Parameters:**
- `walletAddress` (string, required)
- `timeframe` (string): 7d, 30d, 90d, 1y, all

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-12-07T...",
      "totalValue": 5160.5845,
      "totalValueUSD": 23105.0,
      "assets": {...}
    }
  ],
  "meta": {
    "walletAddress": "0x...",
    "timeframe": "30d",
    "dataPoints": 30
  }
}
```

#### GET `/api/portfolio/transactions`
Get transaction history.

**Query Parameters:**
- `walletAddress` (string, required)
- `type` (string): buy, sell, swap, transfer, strategy, agent
- `status` (string): pending, confirmed, failed
- `limit` (number)
- `offset` (number)

---

### Market Data

#### GET `/api/market`
Get market data for multiple assets.

**Query Parameters:**
- `symbols` (string): Comma-separated symbols
- `limit` (number)
- `sortBy` (string)
- `order` (string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "price": 42500.5,
      "priceChange24h": 1250.3,
      "priceChangePercent24h": 3.03,
      "volume24h": 28500000000,
      "marketCap": 832000000000,
      "high24h": 43200.0,
      "low24h": 41000.0
    }
  ]
}
```

#### GET `/api/market/[symbol]`
Get detailed market data for a specific asset.

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "BTC",
    "price": 42500.5,
    "allTimeHigh": 69000.0,
    "allTimeLow": 3200.0,
    "volatility": 3.2,
    "beta": 1.0,
    "correlations": {
      "ETH": 0.82
    },
    "technicalIndicators": {
      "rsi": 62.5,
      "macd": 125.3,
      "movingAverage50": 41200.0,
      "movingAverage200": 38500.0
    }
  }
}
```

#### GET `/api/market/[symbol]/chart`
Get chart/OHLCV data for an asset.

**Query Parameters:**
- `interval` (string): 1m, 5m, 15m, 1h, 4h, 1d, 1w
- `limit` (number): Number of data points

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-12-07T...",
      "open": 42500.0,
      "high": 42800.0,
      "low": 42300.0,
      "close": 42600.0,
      "volume": 1000000000
    }
  ],
  "meta": {
    "symbol": "BTC",
    "interval": "1h",
    "dataPoints": 100
  }
}
```

---

## Using the API Client

The application includes a TypeScript API client for easy integration:

```typescript
import { apiClient } from '@/lib/api-client'

// Fetch strategies
const response = await apiClient.strategies.list({
  category: 'arbitrage',
  verified: true,
  limit: 10
})

// Get portfolio
const portfolio = await apiClient.portfolio.get('0x...')

// Execute agent
const execution = await apiClient.agents.execute('agent_001', '0x...', {
  amount: 1000
})
```

## React Hooks

Use the provided hooks for automatic data fetching and state management:

```typescript
import { useStrategies } from '@/lib/hooks/use-strategies'
import { usePortfolio } from '@/lib/hooks/use-portfolio'
import { useMarketData } from '@/lib/hooks/use-market'

function MyComponent() {
  const { strategies, loading, error } = useStrategies({ verified: true })
  const { portfolio } = usePortfolio('0x...')
  const { marketData } = useMarketData(['BTC', 'ETH'])
  
  // Use the data...
}
```

## Error Handling

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": {...},
  "meta": {...}
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

In production, implement rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Development with Bun

```bash
# Install dependencies
bun install

# Run development server
bun --bun run next dev

# Build for production
bun run next build

# Start production server
bun run next start

# Run tests
bun test
```

## Environment Variables

See `env.example` for required environment variables.

