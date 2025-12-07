import { NextRequest, NextResponse } from "next/server"

// Types
export interface Transaction {
  id: string
  hash: string
  type: "buy" | "sell" | "swap" | "transfer" | "strategy" | "agent"
  status: "pending" | "confirmed" | "failed"
  timestamp: string
  from: string
  to: string
  assetIn?: {
    symbol: string
    amount: number
    valueUSD: number
  }
  assetOut?: {
    symbol: string
    amount: number
    valueUSD: number
  }
  fee: {
    amount: number
    currency: string
    valueUSD: number
  }
  relatedStrategyId?: string
  relatedAgentId?: string
  blockNumber?: number
  confirmations?: number
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "tx_001",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    type: "swap",
    status: "confirmed",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    from: "0x1234567890abcdef",
    to: "0xuniswap",
    assetIn: {
      symbol: "USDC",
      amount: 1000,
      valueUSD: 1000,
    },
    assetOut: {
      symbol: "ETH",
      amount: 0.5,
      valueUSD: 1000,
    },
    fee: {
      amount: 0.003,
      currency: "ETH",
      valueUSD: 6.0,
    },
    blockNumber: 18500000,
    confirmations: 12,
  },
  {
    id: "tx_002",
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    type: "strategy",
    status: "confirmed",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    from: "0x1234567890abcdef",
    to: "0xstrategy",
    assetIn: {
      symbol: "ETH",
      amount: 1.0,
      valueUSD: 2000,
    },
    fee: {
      amount: 0.002,
      currency: "ETH",
      valueUSD: 4.0,
    },
    relatedStrategyId: "strat_abc123",
    blockNumber: 18499950,
    confirmations: 50,
  },
  {
    id: "tx_003",
    hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    type: "agent",
    status: "pending",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    from: "0x1234567890abcdef",
    to: "0xagent",
    assetIn: {
      symbol: "USDC",
      amount: 100,
      valueUSD: 100,
    },
    fee: {
      amount: 0.001,
      currency: "ETH",
      valueUSD: 2.0,
    },
    relatedAgentId: "agent_001",
    blockNumber: 18500020,
    confirmations: 2,
  },
]

// GET /api/portfolio/transactions - Get transaction history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet address is required",
        },
        { status: 400 }
      )
    }

    // Filter transactions
    let filteredTransactions = [...mockTransactions]

    if (type) {
      filteredTransactions = filteredTransactions.filter((t) => t.type === type)
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter((t) => t.status === status)
    }

    // Sort by timestamp (newest first)
    filteredTransactions.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // Paginate
    const total = filteredTransactions.length
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
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
        error: error.message || "Failed to fetch transactions",
      },
      { status: 500 }
    )
  }
}

