import { NextRequest, NextResponse } from "next/server"

// Types
export interface DetailedMarketData {
  symbol: string
  name: string
  price: number
  priceChange24h: number
  priceChangePercent24h: number
  volume24h: number
  marketCap: number
  high24h: number
  low24h: number
  circulatingSupply: number
  totalSupply: number
  allTimeHigh: number
  allTimeLow: number
  volatility: number
  beta: number
  correlations: {
    [symbol: string]: number
  }
  technicalIndicators: {
    rsi: number
    macd: number
    movingAverage50: number
    movingAverage200: number
  }
  lastUpdated: string
}

// Mock detailed data
const mockDetailedData: { [key: string]: DetailedMarketData } = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    price: 42500.5,
    priceChange24h: 1250.3,
    priceChangePercent24h: 3.03,
    volume24h: 28500000000,
    marketCap: 832000000000,
    high24h: 43200.0,
    low24h: 41000.0,
    circulatingSupply: 19500000,
    totalSupply: 21000000,
    allTimeHigh: 69000.0,
    allTimeLow: 3200.0,
    volatility: 3.2,
    beta: 1.0,
    correlations: {
      ETH: 0.82,
      LINK: 0.65,
      UNI: 0.71,
    },
    technicalIndicators: {
      rsi: 62.5,
      macd: 125.3,
      movingAverage50: 41200.0,
      movingAverage200: 38500.0,
    },
    lastUpdated: new Date().toISOString(),
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    price: 2245.75,
    priceChange24h: 85.25,
    priceChangePercent24h: 3.95,
    volume24h: 15200000000,
    marketCap: 269000000000,
    high24h: 2280.0,
    low24h: 2150.0,
    circulatingSupply: 120000000,
    totalSupply: 120000000,
    allTimeHigh: 4878.0,
    allTimeLow: 82.0,
    volatility: 3.8,
    beta: 1.15,
    correlations: {
      BTC: 0.82,
      LINK: 0.72,
      UNI: 0.85,
    },
    technicalIndicators: {
      rsi: 58.3,
      macd: 42.1,
      movingAverage50: 2180.0,
      movingAverage200: 2050.0,
    },
    lastUpdated: new Date().toISOString(),
  },
}

// GET /api/market/[symbol] - Get detailed market data for a specific asset
export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    const symbolUpper = symbol.toUpperCase()

    const marketData = mockDetailedData[symbolUpper]

    if (!marketData) {
      return NextResponse.json(
        {
          success: false,
          error: "Market data not found for symbol",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...marketData,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch market data",
      },
      { status: 500 }
    )
  }
}

