# 🚀 Stratos Markets UI - Quick Reference

## 📋 Essential Commands

\`\`\`bash

# Development

bun install # Install dependencies
bun dev # Start dev server (http://localhost:3000)
bun run build # Build for production
bun start # Start production server

# Testing

bun test # Run tests
bun test --watch # Watch mode

# Utilities

bun --version # Check Bun version
bun upgrade # Upgrade Bun
\`\`\`

## 🔗 Quick API Examples

### Strategies

\`\`\`bash

# List all strategies

curl http://localhost:3000/api/strategies

# Filter by category

curl "http://localhost:3000/api/strategies?category=arbitrage&verified=true"

# Get specific strategy

curl http://localhost:3000/api/strategies/strat_abc123

# Subscribe to strategy

curl -X POST http://localhost:3000/api/strategies/strat_abc123/subscribe\
-H "Content-Type: application/json"\
-d '{"walletAddress":"0x..."}'
\`\`\`

### Agents

\`\`\`bash

# List agents

curl http://localhost:3000/api/agents

# Filter by type

curl "http://localhost:3000/api/agents?type=trading&verified=true"

# Execute agent

curl -X POST http://localhost:3000/api/agents/agent_001/execute\
-H "Content-Type: application/json"\
-d '{"walletAddress":"0x...","parameters":{}}'
\`\`\`

### Portfolio

\`\`\`bash

# Get portfolio

curl "http://localhost:3000/api/portfolio?walletAddress=0x..."

# Get historical data

curl "http://localhost:3000/api/portfolio/history?walletAddress=0x...&timeframe=30d"

# Get transactions

curl "http://localhost:3000/api/portfolio/transactions?walletAddress=0x..."
\`\`\`

### Market Data

\`\`\`bash

# Get market data

curl "http://localhost:3000/api/market?symbols=BTC,ETH"

# Get asset details

curl http://localhost:3000/api/market/BTC

# Get chart data

curl "http://localhost:3000/api/market/BTC/chart?interval=1h&limit=100"
\`\`\`

## 💻 Code Snippets

### Using API Client

\`\`\`typescript
import { apiClient } from '@/lib/api-client';

// Strategies
const strategies = await apiClient.strategies.list({ verified: true });
const strategy = await apiClient.strategies.get('strat_abc123');
await apiClient.strategies.subscribe('strat_abc123', '0x...');

// Agents
const agents = await apiClient.agents.list({ type: 'trading' });
await apiClient.agents.execute('agent_001', '0x...', { amount: 1000 });

// Portfolio
const portfolio = await apiClient.portfolio.get('0x...');
const history = await apiClient.portfolio.getHistory('0x...', '30d');

// Market
const marketData = await apiClient.market.list({ symbols: ['BTC', 'ETH'] });
const btc = await apiClient.market.get('BTC');
const chart = await apiClient.market.getChart('BTC', '1h', 100);
\`\`\`

### Using React Hooks

\`\`\`typescript
import { useMarketData } from '@/lib/hooks/use-market';
import { usePortfolio } from '@/lib/hooks/use-portfolio';
import { useStrategies, useStrategy } from '@/lib/hooks/use-strategies';

function MyComponent() {
// List strategies
const { strategies, loading, error } = useStrategies({ category: 'arbitrage', verified: true });

// Single strategy
const { strategy, subscribe, unsubscribe } = useStrategy('strat_abc123');

// Portfolio
const { portfolio } = usePortfolio('0xWalletAddress');

// Market data
const { marketData } = useMarketData(['BTC', 'ETH']);

return <div>{/* Your UI */}</div>;
}
\`\`\`

### Creating a New Component

\`\`\`typescript
'use client';

import { useStrategies } from '@/lib/hooks/use-strategies';

export default function StrategiesList() {
const { strategies, loading, error } = useStrategies({ verified: true });

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (

<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
{strategies.map(strategy => (
<div key={strategy.id} className='border p-4'>
<h3>{strategy.name}</h3>
<p>{strategy.description}</p>
<div>ROI: {strategy.performance.roi}%</div>
</div>
))}
</div>
);
}
\`\`\`

## 📁 Project Structure

\`\`\`
stratos-markets-ui/
├── app/
│ ├── api/ # API routes (22 endpoints)
│ ├── agents/ # Agents page
│ ├── portfolio/ # Portfolio page
│ └── page.tsx # Home page
├── lib/
│ ├── api-client.ts # API client
│ └── hooks/ # React hooks (8 hooks)
├── components/ # React components
├── public/ # Static assets
└── [docs].md # Documentation
\`\`\`

## 🎯 Common Tasks

### Add a New API Endpoint

1. Create file: `app/api/[name]/route.ts`
2. Implement GET/POST/PATCH/DELETE handlers
3. Add to API client: `lib/api-client.ts`
4. Create hook (optional): `lib/hooks/use-[name].ts`

### Add a New Page

1. Create: `app/[name]/page.tsx`
2. Import hooks: `import { useX } from '@/lib/hooks/use-x'`
3. Add to navigation: Update `components/navbar.tsx`

### Test an API Endpoint

1. Start server: `bun dev`
2. Use curl or browser: `http://localhost:3000/api/...`
3. Check response in browser DevTools Network tab

## 🔍 Debugging

\`\`\`bash

# Check server logs

# Look at terminal where `bun dev` is running

# Check API response in browser

# Open DevTools → Network → Click API call → Preview

# Enable debug mode

# Add to .env.local:

NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
\`\`\`

## 📊 Mock Data Available

### Strategies (4)

- `strat_abc123` - DCA Bitcoin Strategy
- `strat_def456` - Grid Trading Master
- `strat_ghi789` - Alpha Momentum
- `strat_jkl012` - Mean Reversion Pro

### Agents (4)

- `agent_001` - Alpha Sniper Bot
- `agent_002` - Portfolio Rebalancer
- `agent_003` - Market Sentiment Analyzer
- `agent_004` - Whale Watcher

### Assets (5+)

- BTC, ETH, USDC, LINK, UNI

## 🌐 URLs

- **App:** http://localhost:3000
- **Strategies:** http://localhost:3000/api/strategies
- **Agents:** http://localhost:3000/api/agents
- **Portfolio:** http://localhost:3000/api/portfolio?walletAddress=0x...
- **Market:** http://localhost:3000/api/market

## 📖 Documentation

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Setup instructions
- `API_DOCUMENTATION.md` - API reference
- `INTEGRATION_SUMMARY.md` - Integration details
- `CHECKLIST.md` - Task checklist
- `QUICK_REFERENCE.md` - This file

## ⚡ Bun Advantages

- 🚀 **30x faster** installs than npm
- ⚡ **Instant** TypeScript execution
- 💾 **Lower** memory usage
- 🔥 **Hot** reloading built-in
- 🧪 **Built-in** test runner

## 🎨 Tech Stack

- **Runtime:** Bun 1.3.3
- **Framework:** Next.js 16
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI:** Radix UI
- **Icons:** Lucide React

## 🔑 Environment Variables

\`\`\`env

# .env.local

NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_SECRET_KEY=your-secret-key
ALCHEMY_API_KEY=
INFURA_API_KEY=
DUNE_API_KEY=
\`\`\`

## 🚨 Troubleshooting

| Issue              | Solution                                              |
| ------------------ | ----------------------------------------------------- |
| Port in use        | Change port: `bun --bun run next dev -p 3001`         |
| Deps won't install | Clear: `rm -rf node_modules bun.lockb && bun install` |
| Types missing      | Run: `bun install` again                              |
| API 404            | Check route file location in `app/api/`               |
| Hook errors        | Ensure `'use client'` at top of component             |

## 📞 Quick Help

\`\`\`bash

# Bun help

bun --help

# Next.js help

bun --bun run next --help

# Check Bun version

bun --version

# Upgrade Bun

bun upgrade
\`\`\`

---

**Ready to build? Run `bun dev` and start coding! 🚀**
