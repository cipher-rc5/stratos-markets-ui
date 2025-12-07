# Stratos Markets UI - Setup Guide

This guide will help you set up and run the Stratos Markets UI application using Bun runtime and package manager.

## Prerequisites

- **Bun** v1.0 or higher - [Install Bun](https://bun.sh)
- **Git** (for version control)
- A modern web browser

## Installation

### 1. Install Bun

If you haven't installed Bun yet:

\`\`\`bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (WSL)
curl -fsSL https://bun.sh/install | bash

# Or using npm
npm install -g bun
\`\`\`

### 2. Clone the Repository

\`\`\`bash
git clone https://github.com/your-repo/stratos-markets-ui.git
cd stratos-markets-ui
\`\`\`

### 3. Install Dependencies

\`\`\`bash
bun install
\`\`\`

This will install all project dependencies using Bun's fast package manager.

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

\`\`\`bash
cp env.example .env.local
\`\`\`

Edit `.env.local` and configure your environment variables:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_SECRET_KEY=your-secret-key-here

# External APIs (server-side only - never exposed to client)
ALCHEMY_API_KEY=your-alchemy-key
INFURA_API_KEY=your-infura-key
DUNE_API_KEY=your-dune-key

# Authentication (if using NextAuth)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## Running the Application

### Development Mode

Start the development server with hot reloading:

\`\`\`bash
bun dev
\`\`\`

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:

\`\`\`bash
bun run build
\`\`\`

Start the production server:

\`\`\`bash
bun start
\`\`\`

### Running Tests

\`\`\`bash
bun test
\`\`\`

## Project Structure

\`\`\`
stratos-markets-ui/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── agents/          # Agent endpoints
│   │   ├── market/          # Market data endpoints
│   │   ├── portfolio/       # Portfolio endpoints
│   │   └── strategies/      # Strategy endpoints
│   ├── agents/              # Agents marketplace page
│   ├── create/              # Strategy creation page
│   ├── portfolio/           # Portfolio page
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── navbar.tsx
│   └── theme-provider.tsx
├── lib/                     # Utility libraries
│   ├── api-client.ts       # API client
│   ├── hooks/              # Custom React hooks
│   │   ├── use-strategies.ts
│   │   ├── use-portfolio.ts
│   │   └── use-market.ts
│   └── utils.ts
├── public/                  # Static assets
├── styles/                  # Global styles
├── .env.local              # Environment variables (create this)
├── env.example             # Environment variables template
├── package.json            # Dependencies and scripts
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── API_DOCUMENTATION.md    # API documentation
\`\`\`

## API Integration

The application includes a fully integrated API system with the following features:

### Available APIs

1. **Strategies API** - Trading strategy management
   - List, create, update, delete strategies
   - Subscribe/unsubscribe to strategies

2. **Agents API** - AI agent management
   - List, deploy, execute agents
   - View execution history

3. **Portfolio API** - Portfolio tracking
   - View portfolio assets and performance
   - Historical data
   - Transaction history

4. **Market Data API** - Real-time market data
   - Price feeds
   - Chart data (OHLCV)
   - Technical indicators

### Using the API Client

\`\`\`typescript
import { apiClient } from '@/lib/api-client';

// Fetch strategies
const { data, success } = await apiClient.strategies.list({ category: 'arbitrage', verified: true });

// Get portfolio
const portfolio = await apiClient.portfolio.get('0x...');

// Execute an agent
const execution = await apiClient.agents.execute('agent_001', '0x...');
\`\`\`

### Using React Hooks

\`\`\`typescript
import { useStrategies } from '@/lib/hooks/use-strategies';

function MyComponent() {
  const { strategies, loading, error } = useStrategies({ verified: true });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{strategies.map(strategy => <div key={strategy.id}>{strategy.name}</div>)}</div>;
}
\`\`\`

## Key Features

### 1. Bun Runtime Optimizations

- ⚡ **Fast Package Installation** - Up to 30x faster than npm
- 🚀 **Optimized Runtime** - Native TypeScript execution
- 📦 **Built-in Tools** - Test runner, bundler, and more
- 💾 **Reduced Bundle Size** - Efficient dependency management

### 2. API Endpoints

All API endpoints are built using Next.js App Router with:

- Type-safe request/response handling
- Built-in error handling
- Pagination support
- Filtering and sorting
- Mock data for development

### 3. Frontend Integration

- **Custom Hooks** - React hooks for data fetching
- **API Client** - Type-safe API client
- **Error Handling** - Comprehensive error states
- **Loading States** - Built-in loading indicators

## Development Tips

### Hot Reloading

Bun's dev server provides instant hot reloading for:

- React components
- API routes
- TypeScript files
- CSS/Tailwind changes

### TypeScript Support

The project uses TypeScript with strict mode. Bun natively supports TypeScript:

\`\`\`bash
# No compilation needed - Bun runs .ts files directly
bun run index.ts
\`\`\`

### API Testing

Test API endpoints using curl or tools like Postman:

\`\`\`bash
# Get all strategies
curl http://localhost:3000/api/strategies

# Get specific strategy
curl http://localhost:3000/api/strategies/strat_abc123

# Create new strategy (requires POST data)
curl -X POST http://localhost:3000/api/strategies \
  -H "Content-Type: application/json" \
  -d '{"name":"My Strategy","description":"...","creator":"0x..."}'
\`\`\`

### Debugging

Enable debug logging in your `.env.local`:

\`\`\`env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
\`\`\`

## Performance Optimization

### Bun-Specific Optimizations

1. **Native Module Loading** - Bun's runtime is optimized for ES modules
2. **Fast Startup** - Minimal overhead compared to Node.js
3. **Built-in SQLite** - If you need a database, Bun includes SQLite
4. **Efficient Memory Usage** - Lower memory footprint

### Next.js Optimizations

1. **Image Optimization** - Automatic with Next.js Image component
2. **Code Splitting** - Automatic route-based splitting
3. **Server Components** - Use RSC where possible
4. **Static Generation** - Pre-render pages at build time

## Deployment

### Vercel (Recommended)

\`\`\`bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
\`\`\`

### Docker

\`\`\`dockerfile
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN bun run build

# Start
CMD ["bun", "start"]
\`\`\`

### Environment Variables

Make sure to set all required environment variables in your deployment platform.

## Troubleshooting

### Bun Installation Issues

If `bun install` fails:

\`\`\`bash
# Clear cache
rm -rf node_modules bun.lockb
bun install
\`\`\`

### Port Already in Use

Change the port in `package.json`:

\`\`\`json
{ "scripts": { "dev": "bun --bun run next dev -p 3001" } }
\`\`\`

### API Connection Issues

Check that:

1. Development server is running
2. API routes are in `app/api/` directory
3. CORS is properly configured (if calling from external domain)

## Next Steps

1. **Connect to Real APIs** - Replace mock data with real blockchain/DeFi APIs
2. **Add Authentication** - Implement wallet connection (e.g., WalletConnect, MetaMask)
3. **Database Integration** - Add PostgreSQL or MongoDB for persistent storage
4. **Testing** - Write unit and integration tests
5. **Monitoring** - Add error tracking (Sentry) and analytics

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [API Documentation](./API_DOCUMENTATION.md)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Support

For issues and questions:

- GitHub Issues: [Report a bug](https://github.com/your-repo/issues)
- Documentation: [API Docs](./API_DOCUMENTATION.md)
- Discord: [Join our community](#)

## License

MIT License - see LICENSE file for details
