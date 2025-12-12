# 🚀 Stratos Markets UI

> A next-generation DeFi trading platform with AI-powered agents and institutional-grade strategies

[![Built with Bun](https://img.shields.io/badge/Built%20with-Bun-black?style=flat&logo=bun)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com)

## ✨ Features

### 🎯 Core Capabilities

- **Trading Strategies Marketplace** - Browse, subscribe, and deploy institutional-grade trading strategies
- **AI Agent Framework** - Autonomous trading bots with MEV protection and flash loan integration
- **Portfolio Management** - Real-time portfolio tracking with advanced analytics
- **Market Data** - Live price feeds, charts, and technical indicators
- **Risk Analytics** - Comprehensive risk metrics and performance tracking

### ⚡ Built with Bun

- **Lightning Fast** - Up to 30x faster package installation than npm
- **Native TypeScript** - Run .ts files directly without compilation
- **Optimized Runtime** - Faster startup and execution
- **All-in-One Toolkit** - Package manager, test runner, and bundler

### 🔌 Fully Integrated APIs

- **RESTful API** - Complete backend API with Next.js App Router
- **Type-Safe Client** - TypeScript API client with full type safety
- **React Hooks** - Custom hooks for effortless data fetching
- **Real-time Updates** - Live data synchronization

## 🚀 Quick Start

### Prerequisites

- **Bun** v1.0+ ([Install](https://bun.sh))

### Installation

\`\`\`bash

# Clone the repository

git clone https://github.com/cipher-rc5/stratos-markets-ui.git
cd stratos-markets-ui

# Install dependencies with Bun

bun install

# Set up environment variables

cp .env.example .env.local

# Edit .env.local and configure the API endpoint
# Default: NEXT_PUBLIC_API_URL=https://stratos-markets-api.vercel.app/v1

# Start the development server

bun dev
\`\`\`

Visit `http://localhost:3000` to see the app in action! 🎉

## 📚 Documentation

- **[API Integration Guide](./API_INTEGRATION.md)** - Complete API integration documentation
- **[API Migration Summary](./API_MIGRATION_SUMMARY.md)** - API configuration changes
- **[Bun Guide](./BUN_GUIDE.md)** - Complete Bun runtime and package manager guide
- **[Setup Guide](./SETUP_GUIDE.md)** - Complete setup and configuration guide
- **[Contributing](#)** - How to contribute to the project

## 🏗️ Architecture

\`\`\`
┌─────────────────────────────────────────────────┐
│ Frontend (Next.js) │
│ ┌──────────────┐ ┌─────────────────────────┐ │
│ │ UI Layer │ │ React Hooks │ │
│ │ │ │ - useStrategies() │ │
│ │ - Pages │ │ - usePortfolio() │ │
│ │ - Components│ │ - useMarketData() │ │
│ └──────────────┘ └─────────────────────────┘ │
│ │
│ ┌──────────────────────────────────────────┐ │
│ │ API Client (TypeScript) │ │
│ │ - Type-safe requests │ │
│ │ - Error handling │ │
│ │ - Request/response validation │ │
│ └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
↕
┌─────────────────────────────────────────────────┐
│ Backend API (Next.js API) │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ Strategies │ │ Agents │ │
│ │ /api/ │ │ /api/ │ │
│ │ strategies │ │ agents │ │
│ └──────────────┘ └──────────────┘ │
│ │
│ ┌──────────────┐ ┌──────────────┐ │
│ │ Portfolio │ │ Market │ │
│ │ /api/ │ │ /api/ │ │
│ │ portfolio │ │ market │ │
│ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────┘
\`\`\`

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Lucide Icons** - Icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Bun Runtime** - JavaScript runtime

### Tools

- **Bun** - Package manager & runtime
- **ESLint** - Code linting
- **Prettier** - Code formatting (optional)

## 📦 API Endpoints

### Strategies

\`\`\`
GET /api/strategies - List all strategies
GET /api/strategies/:id - Get strategy details
POST /api/strategies - Create strategy
PATCH /api/strategies/:id - Update strategy
DELETE /api/strategies/:id - Delete strategy
POST /api/strategies/:id/subscribe - Subscribe to strategy
\`\`\`

### Agents

\`\`\`
GET /api/agents - List all agents
GET /api/agents/:id - Get agent details
POST /api/agents - Deploy agent
POST /api/agents/:id/execute - Execute agent
GET /api/agents/:id/execute - Get execution history
\`\`\`

### Portfolio

\`\`\`
GET /api/portfolio - Get portfolio
GET /api/portfolio/history - Get historical data
GET /api/portfolio/transactions - Get transactions
\`\`\`

### Market Data

\`\`\`
GET /api/market - List market data
GET /api/market/:symbol - Get asset details
GET /api/market/:symbol/chart - Get chart data
\`\`\`

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

## 🎨 Features Overview

### 1. Strategies Marketplace

Browse and subscribe to verified trading strategies:

- DCA (Dollar-Cost Averaging)
- Grid Trading
- Arbitrage
- Mean Reversion
- Momentum Trading

### 2. AI Agents

Deploy autonomous trading agents:

- **Alpha Sniper Bot** - MEV-protected arbitrage
- **Portfolio Rebalancer** - Auto-rebalancing
- **Sentiment Analyzer** - AI-powered market analysis
- **Whale Watcher** - Large transaction monitoring

### 3. Portfolio Tracker

Real-time portfolio management:

- Multi-chain asset tracking
- Performance analytics
- Transaction history
- P&L tracking
- Risk metrics

### 4. Market Data

Live market intelligence:

- Real-time price feeds
- OHLCV charts
- Technical indicators (RSI, MACD, Moving Averages)
- Market correlations
- Volatility metrics

## 🚀 Performance

### Bun Optimizations

- **Fast Cold Starts** - ~10ms startup time
- **Quick Installs** - Dependencies install in seconds
- **Low Memory** - Efficient memory usage
- **Native Speed** - Compiled with Zig for performance

### Next.js Optimizations

- **Server Components** - Reduced client-side JavaScript
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Route-based code splitting
- **Static Generation** - Pre-rendered pages

## 🧪 Testing

\`\`\`bash

# Run tests with Bun's built-in test runner

bun test

# Watch mode

bun test --watch

# Coverage

bun test --coverage
\`\`\`

## 📝 Environment Variables

Create a `.env.local` file:

\`\`\`env

# API Configuration
# Stratos Markets API (external)
NEXT_PUBLIC_API_URL=https://stratos-markets-api.vercel.app/v1

# External Services (server-side only)
ALCHEMY_API_KEY=
INFURA_API_KEY=
DUNE_API_KEY=

# x402 Payment Configuration
X402_NETWORK=base-sepolia
X402_FACILITATOR=https://x402.org/facilitator
X402_PAY_TO=0x90a7130B48764D9613666A14D00eA0b824C8b390

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### API Architecture

The application uses a **hybrid API architecture**:

- **External API** (`https://stratos-markets-api.vercel.app/v1`): Handles strategies, agents, and marketplace data
- **Local API Routes** (`/api/*`): Proxies for portfolio data (Dune API), market data, and other services

This architecture provides:
- ✅ Separation of concerns
- ✅ Server-side API key protection
- ✅ Flexible data source management
- ✅ Optimal performance with caching

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](#) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh)
- Powered by [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- UI components from [Radix UI](https://radix-ui.com)

## 📧 Contact

- GitHub: [@cipher-rc5](https://github.com/cipher-rc5)
- Project Link: [https://github.com/cipher-rc5/stratos-markets-ui](https://github.com/cipher-rc5/stratos-markets-ui)

---

<p align="center">Built with ❤️ using Bun and Next.js</p>
