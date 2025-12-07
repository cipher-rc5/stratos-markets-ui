import { NextRequest, NextResponse } from "next/server"

// Types
export interface Strategy {
  id: string
  name: string
  description: string
  creator: string
  version: string
  performance: {
    roi: number
    sharpeRatio: number
    maxDrawdown: number
    winRate?: number
    totalTrades?: number
  }
  pricing: {
    type: "flat" | "percentage" | "free"
    amount: number
    currency: string
  }
  tags: string[]
  subscribers: number
  createdAt: string
  updatedAt: string
  category?: string
  verified?: boolean
  riskLevel?: "low" | "medium" | "high"
}

// Mock data - in production, this would come from a database
const mockStrategies: Strategy[] = [
  {
    id: "strat_abc123",
    name: "DCA Bitcoin Strategy",
    description: "Automated dollar-cost averaging for BTC with dynamic entry points",
    creator: "0x1234...",
    version: "1.2.0",
    performance: {
      roi: 24.5,
      sharpeRatio: 1.8,
      maxDrawdown: -12.3,
      winRate: 68.5,
      totalTrades: 342,
    },
    pricing: { type: "flat", amount: 100, currency: "USDC" },
    tags: ["DCA", "Bitcoin", "Long-term"],
    subscribers: 342,
    createdAt: "2025-12-03T19:46:25.828Z",
    updatedAt: "2025-12-03T19:46:25.828Z",
    category: "yield-farming",
    verified: true,
    riskLevel: "low",
  },
  {
    id: "strat_def456",
    name: "Grid Trading Master",
    description: "Multi-level grid strategy optimized for ranging markets",
    creator: "0x5678...",
    version: "2.1.5",
    performance: {
      roi: 18.2,
      sharpeRatio: 2.1,
      maxDrawdown: -8.7,
      winRate: 72.3,
      totalTrades: 527,
    },
    pricing: { type: "flat", amount: 150, currency: "USDC" },
    tags: ["Grid", "Range", "Stable"],
    subscribers: 527,
    createdAt: "2025-11-15T10:30:15.123Z",
    updatedAt: "2025-11-15T10:30:15.123Z",
    category: "arbitrage",
    verified: true,
    riskLevel: "medium",
  },
  {
    id: "strat_ghi789",
    name: "Alpha Momentum",
    description: "Trend-following algorithm with volatility filters",
    creator: "0x9abc...",
    version: "3.0.2",
    performance: {
      roi: 42.8,
      sharpeRatio: 1.5,
      maxDrawdown: -18.9,
      winRate: 61.2,
      totalTrades: 891,
    },
    pricing: { type: "flat", amount: 250, currency: "USDC" },
    tags: ["Momentum", "High-risk", "Trending"],
    subscribers: 891,
    createdAt: "2025-10-22T14:22:40.456Z",
    updatedAt: "2025-10-22T14:22:40.456Z",
    category: "mev",
    verified: true,
    riskLevel: "high",
  },
  {
    id: "strat_jkl012",
    name: "Mean Reversion Pro",
    description: "Statistical arbitrage on multiple timeframes",
    creator: "0xdef0...",
    version: "1.8.3",
    performance: {
      roi: 15.6,
      sharpeRatio: 2.3,
      maxDrawdown: -6.2,
      winRate: 75.8,
      totalTrades: 445,
    },
    pricing: { type: "flat", amount: 200, currency: "USDC" },
    tags: ["Mean-reversion", "Stats", "Low-volatility"],
    subscribers: 445,
    createdAt: "2025-09-30T08:15:20.789Z",
    updatedAt: "2025-09-30T08:15:20.789Z",
    category: "arbitrage",
    verified: true,
    riskLevel: "low",
  },
]

// GET /api/strategies - List all strategies with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const category = searchParams.get("category")
    const verified = searchParams.get("verified")
    const riskLevel = searchParams.get("riskLevel")
    const minRoi = searchParams.get("minRoi")
    const maxRoi = searchParams.get("maxRoi")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Filter strategies
    let filteredStrategies = [...mockStrategies]

    if (category) {
      filteredStrategies = filteredStrategies.filter(
        (s) => s.category === category
      )
    }

    if (verified === "true") {
      filteredStrategies = filteredStrategies.filter((s) => s.verified === true)
    }

    if (riskLevel) {
      filteredStrategies = filteredStrategies.filter(
        (s) => s.riskLevel === riskLevel
      )
    }

    if (minRoi) {
      filteredStrategies = filteredStrategies.filter(
        (s) => s.performance.roi >= parseFloat(minRoi)
      )
    }

    if (maxRoi) {
      filteredStrategies = filteredStrategies.filter(
        (s) => s.performance.roi <= parseFloat(maxRoi)
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredStrategies = filteredStrategies.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    // Sort strategies
    filteredStrategies.sort((a, b) => {
      let aValue: any = a
      let bValue: any = b

      if (sortBy.includes(".")) {
        const keys = sortBy.split(".")
        aValue = keys.reduce((obj, key) => obj[key], a as any)
        bValue = keys.reduce((obj, key) => obj[key], b as any)
      } else {
        aValue = (a as any)[sortBy]
        bValue = (b as any)[sortBy]
      }

      if (order === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Paginate
    const total = filteredStrategies.length
    const paginatedStrategies = filteredStrategies.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedStrategies,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch strategies",
      },
      { status: 500 }
    )
  }
}

// POST /api/strategies - Create a new strategy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "creator", "version"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        )
      }
    }

    // Create new strategy
    const newStrategy: Strategy = {
      id: `strat_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      description: body.description,
      creator: body.creator,
      version: body.version,
      performance: body.performance || {
        roi: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
      },
      pricing: body.pricing || {
        type: "free",
        amount: 0,
        currency: "USDC",
      },
      tags: body.tags || [],
      subscribers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: body.category || "other",
      verified: false,
      riskLevel: body.riskLevel || "medium",
    }

    // In production, save to database
    mockStrategies.push(newStrategy)

    return NextResponse.json(
      {
        success: true,
        data: newStrategy,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create strategy",
      },
      { status: 500 }
    )
  }
}

