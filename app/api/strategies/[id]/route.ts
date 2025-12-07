import { NextRequest, NextResponse } from "next/server"
import type { Strategy } from "../route"

// Mock data - would come from database in production
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
]

// GET /api/strategies/[id] - Get strategy by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const strategy = mockStrategies.find((s) => s.id === id)

    if (!strategy) {
      return NextResponse.json(
        {
          success: false,
          error: "Strategy not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: strategy,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch strategy",
      },
      { status: 500 }
    )
  }
}

// PATCH /api/strategies/[id] - Update strategy
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const strategyIndex = mockStrategies.findIndex((s) => s.id === id)

    if (strategyIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Strategy not found",
        },
        { status: 404 }
      )
    }

    // Update strategy
    mockStrategies[strategyIndex] = {
      ...mockStrategies[strategyIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockStrategies[strategyIndex],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update strategy",
      },
      { status: 500 }
    )
  }
}

// DELETE /api/strategies/[id] - Delete strategy
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const strategyIndex = mockStrategies.findIndex((s) => s.id === id)

    if (strategyIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Strategy not found",
        },
        { status: 404 }
      )
    }

    // Remove strategy
    mockStrategies.splice(strategyIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Strategy deleted successfully",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete strategy",
      },
      { status: 500 }
    )
  }
}

