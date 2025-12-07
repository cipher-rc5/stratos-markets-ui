import { NextRequest, NextResponse } from "next/server"

// Types
export interface Agent {
  id: string
  name: string
  description: string
  creator: string
  version: string
  type: "trading" | "analytics" | "automation" | "monitoring"
  status: "active" | "inactive" | "maintenance"
  capabilities: string[]
  pricing: {
    type: "flat" | "usage-based" | "free"
    amount: number
    currency: string
    billingPeriod?: "monthly" | "daily" | "per-transaction"
  }
  metrics: {
    totalExecutions: number
    successRate: number
    avgExecutionTime: number
    uptime: number
  }
  tags: string[]
  subscribers: number
  verified: boolean
  createdAt: string
  updatedAt: string
}

// Mock data
const mockAgents: Agent[] = [
  {
    id: "agent_001",
    name: "Alpha Sniper Bot",
    description: "Fast execution bot for capturing alpha opportunities in real-time",
    creator: "0x1234567890abcdef",
    version: "2.3.1",
    type: "trading",
    status: "active",
    capabilities: [
      "MEV Protection",
      "Flash Loan Integration",
      "Multi-DEX Support",
      "Gas Optimization",
    ],
    pricing: {
      type: "usage-based",
      amount: 0.1,
      currency: "ETH",
      billingPeriod: "per-transaction",
    },
    metrics: {
      totalExecutions: 15420,
      successRate: 94.5,
      avgExecutionTime: 2.3,
      uptime: 99.8,
    },
    tags: ["MEV", "Arbitrage", "Fast", "Verified"],
    subscribers: 1234,
    verified: true,
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-12-01T15:30:00.000Z",
  },
  {
    id: "agent_002",
    name: "Portfolio Rebalancer",
    description: "Automated portfolio rebalancing based on risk tolerance and market conditions",
    creator: "0xabcdef1234567890",
    version: "1.5.0",
    type: "automation",
    status: "active",
    capabilities: [
      "Risk Assessment",
      "Auto-Rebalancing",
      "Tax Optimization",
      "Multi-Asset Support",
    ],
    pricing: {
      type: "flat",
      amount: 50,
      currency: "USDC",
      billingPeriod: "monthly",
    },
    metrics: {
      totalExecutions: 8932,
      successRate: 98.2,
      avgExecutionTime: 15.7,
      uptime: 99.9,
    },
    tags: ["Portfolio", "Automation", "Risk Management"],
    subscribers: 892,
    verified: true,
    createdAt: "2025-09-15T08:00:00.000Z",
    updatedAt: "2025-11-28T12:00:00.000Z",
  },
  {
    id: "agent_003",
    name: "Market Sentiment Analyzer",
    description: "AI-powered sentiment analysis from social media, news, and on-chain data",
    creator: "0x9876543210fedcba",
    version: "3.1.2",
    type: "analytics",
    status: "active",
    capabilities: [
      "Social Media Analysis",
      "On-chain Analytics",
      "News Aggregation",
      "Sentiment Scoring",
    ],
    pricing: {
      type: "flat",
      amount: 100,
      currency: "USDC",
      billingPeriod: "monthly",
    },
    metrics: {
      totalExecutions: 45678,
      successRate: 91.3,
      avgExecutionTime: 5.2,
      uptime: 99.5,
    },
    tags: ["Analytics", "AI", "Sentiment", "Data"],
    subscribers: 2341,
    verified: true,
    createdAt: "2025-08-20T14:00:00.000Z",
    updatedAt: "2025-12-05T09:15:00.000Z",
  },
  {
    id: "agent_004",
    name: "Whale Watcher",
    description: "Real-time monitoring and alerts for large wallet movements",
    creator: "0xfedcba0987654321",
    version: "1.2.3",
    type: "monitoring",
    status: "active",
    capabilities: [
      "Whale Detection",
      "Real-time Alerts",
      "Pattern Recognition",
      "Multi-chain Support",
    ],
    pricing: {
      type: "flat",
      amount: 75,
      currency: "USDC",
      billingPeriod: "monthly",
    },
    metrics: {
      totalExecutions: 32145,
      successRate: 96.8,
      avgExecutionTime: 1.8,
      uptime: 99.7,
    },
    tags: ["Monitoring", "Alerts", "Whale", "On-chain"],
    subscribers: 1567,
    verified: true,
    createdAt: "2025-07-10T11:00:00.000Z",
    updatedAt: "2025-11-30T16:45:00.000Z",
  },
]

// GET /api/agents - List all agents with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const verified = searchParams.get("verified")
    const minSuccessRate = searchParams.get("minSuccessRate")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "subscribers"
    const order = searchParams.get("order") || "desc"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Filter agents
    let filteredAgents = [...mockAgents]

    if (type) {
      filteredAgents = filteredAgents.filter((a) => a.type === type)
    }

    if (status) {
      filteredAgents = filteredAgents.filter((a) => a.status === status)
    }

    if (verified === "true") {
      filteredAgents = filteredAgents.filter((a) => a.verified === true)
    }

    if (minSuccessRate) {
      filteredAgents = filteredAgents.filter(
        (a) => a.metrics.successRate >= parseFloat(minSuccessRate)
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredAgents = filteredAgents.filter(
        (a) =>
          a.name.toLowerCase().includes(searchLower) ||
          a.description.toLowerCase().includes(searchLower) ||
          a.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          a.capabilities.some((cap) => cap.toLowerCase().includes(searchLower))
      )
    }

    // Sort agents
    filteredAgents.sort((a, b) => {
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
    const total = filteredAgents.length
    const paginatedAgents = filteredAgents.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedAgents,
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
        error: error.message || "Failed to fetch agents",
      },
      { status: 500 }
    )
  }
}

// POST /api/agents - Deploy a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "creator", "type"]
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

    // Create new agent
    const newAgent: Agent = {
      id: `agent_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      description: body.description,
      creator: body.creator,
      version: body.version || "1.0.0",
      type: body.type,
      status: "inactive",
      capabilities: body.capabilities || [],
      pricing: body.pricing || {
        type: "free",
        amount: 0,
        currency: "USDC",
      },
      metrics: {
        totalExecutions: 0,
        successRate: 0,
        avgExecutionTime: 0,
        uptime: 0,
      },
      tags: body.tags || [],
      subscribers: 0,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In production, save to database
    mockAgents.push(newAgent)

    return NextResponse.json(
      {
        success: true,
        data: newAgent,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to deploy agent",
      },
      { status: 500 }
    )
  }
}

