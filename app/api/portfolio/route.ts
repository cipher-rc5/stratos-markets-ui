import { NextRequest, NextResponse } from "next/server"

// Types
export interface PortfolioAsset {
  symbol: string
  name: string
  amount: number
  value: number
  valueUSD: number
  price: number
  priceChange24h: number
  allocation: number
}

export interface PortfolioPerformance {
  totalValue: number
  totalValueUSD: number
  dailyChange: number
  dailyChangePercent: number
  weeklyChange: number
  weeklyChangePercent: number
  monthlyChange: number
  monthlyChangePercent: number
  allTimeHigh: number
  allTimeLow: number
}

export interface Portfolio {
  id: string
  walletAddress: string
  assets: PortfolioAsset[]
  performance: PortfolioPerformance
  activeStrategies: string[]
  activeAgents: string[]
  lastUpdated: string
}

// Mock data
const mockPortfolio: Portfolio = {
  id: "portfolio_001",
  walletAddress: "0x1234567890abcdef",
  assets: [
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 5.2345,
      value: 5.2345,
      valueUSD: 10469.0,
      price: 2000.0,
      priceChange24h: 3.5,
      allocation: 45.2,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.1234,
      value: 0.1234,
      valueUSD: 4936.0,
      price: 40000.0,
      priceChange24h: 1.2,
      allocation: 21.3,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      amount: 5000.0,
      value: 5000.0,
      valueUSD: 5000.0,
      price: 1.0,
      priceChange24h: 0.0,
      allocation: 21.6,
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      amount: 150.0,
      value: 150.0,
      valueUSD: 2700.0,
      price: 18.0,
      priceChange24h: -2.3,
      allocation: 11.7,
    },
  ],
  performance: {
    totalValue: 5160.5845,
    totalValueUSD: 23105.0,
    dailyChange: 356.5,
    dailyChangePercent: 1.57,
    weeklyChange: 1245.3,
    weeklyChangePercent: 5.68,
    monthlyChange: 3456.8,
    monthlyChangePercent: 17.59,
    allTimeHigh: 28500.0,
    allTimeLow: 5000.0,
  },
  activeStrategies: ["strat_abc123", "strat_def456"],
  activeAgents: ["agent_001", "agent_002"],
  lastUpdated: new Date().toISOString(),
}

// GET /api/portfolio - Get portfolio for a wallet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet address is required",
        },
        { status: 400 }
      )
    }

    // In production, fetch from database or blockchain
    const portfolio = {
      ...mockPortfolio,
      walletAddress,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: portfolio,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch portfolio",
      },
      { status: 500 }
    )
  }
}

// POST /api/portfolio - Create or update portfolio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet address is required",
        },
        { status: 400 }
      )
    }

    // In production, save to database
    const portfolio: Portfolio = {
      id: `portfolio_${Math.random().toString(36).substr(2, 9)}`,
      walletAddress: body.walletAddress,
      assets: body.assets || [],
      performance: body.performance || {
        totalValue: 0,
        totalValueUSD: 0,
        dailyChange: 0,
        dailyChangePercent: 0,
        weeklyChange: 0,
        weeklyChangePercent: 0,
        monthlyChange: 0,
        monthlyChangePercent: 0,
        allTimeHigh: 0,
        allTimeLow: 0,
      },
      activeStrategies: body.activeStrategies || [],
      activeAgents: body.activeAgents || [],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        data: portfolio,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create/update portfolio",
      },
      { status: 500 }
    )
  }
}

