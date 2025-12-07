import { NextRequest, NextResponse } from "next/server"
import type { Agent } from "../route"

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
    capabilities: ["MEV Protection", "Flash Loan Integration"],
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
    tags: ["MEV", "Arbitrage", "Fast"],
    subscribers: 1234,
    verified: true,
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-12-01T15:30:00.000Z",
  },
]

// GET /api/agents/[id] - Get agent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const agent = mockAgents.find((a) => a.id === id)

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: agent,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch agent",
      },
      { status: 500 }
    )
  }
}

// PATCH /api/agents/[id] - Update agent
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const agentIndex = mockAgents.findIndex((a) => a.id === id)

    if (agentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent not found",
        },
        { status: 404 }
      )
    }

    // Update agent
    mockAgents[agentIndex] = {
      ...mockAgents[agentIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: mockAgents[agentIndex],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update agent",
      },
      { status: 500 }
    )
  }
}

// DELETE /api/agents/[id] - Delete agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const agentIndex = mockAgents.findIndex((a) => a.id === id)

    if (agentIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent not found",
        },
        { status: 404 }
      )
    }

    // Remove agent
    mockAgents.splice(agentIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete agent",
      },
      { status: 500 }
    )
  }
}

