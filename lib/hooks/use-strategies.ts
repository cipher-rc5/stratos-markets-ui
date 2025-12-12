"use client"

import { useEffect, useState } from "react"
import { apiClient } from "../api-client"

export interface Strategy {
  id: string
  name: string
  description: string
  creator: string
  version: string
  performance: { roi: number; sharpeRatio: number; maxDrawdown: number; winRate?: number; totalTrades?: number }
  pricing: { type: "flat" | "percentage" | "free"; amount: number; currency: string }
  tags: string[]
  subscribers: number
  createdAt: string
  updatedAt: string
  category?: string
  verified?: boolean
  riskLevel?: "low" | "medium" | "high"
}

const MOCK_STRATEGIES: Strategy[] = [
  {
    id: "1",
    name: "ETH Momentum Strategy",
    description: "Automated momentum trading for Ethereum with optimized entry and exit points",
    creator: "0x1234...5678",
    version: "2.1.0",
    performance: { roi: 45.2, sharpeRatio: 1.8, maxDrawdown: 12.5, winRate: 68, totalTrades: 245 },
    pricing: { type: "percentage", amount: 15, currency: "USD" },
    tags: ["momentum", "ethereum", "automated"],
    subscribers: 1247,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    category: "Trading",
    verified: true,
    riskLevel: "medium",
  },
  {
    id: "2",
    name: "DeFi Yield Optimizer",
    description: "Maximize yields across multiple DeFi protocols with automated rebalancing",
    creator: "0x9876...4321",
    version: "1.5.2",
    performance: { roi: 32.8, sharpeRatio: 2.1, maxDrawdown: 8.3, winRate: 75, totalTrades: 180 },
    pricing: { type: "percentage", amount: 10, currency: "USD" },
    tags: ["yield", "defi", "optimization"],
    subscribers: 892,
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
    category: "Yield Farming",
    verified: true,
    riskLevel: "low",
  },
]

export function useStrategies(filters?: {
  category?: string
  verified?: boolean
  riskLevel?: string
  search?: string
}) {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStrategies() {
      setLoading(true)
      setError(null)

      const response = await apiClient.strategies.list(filters)

      if (response.success && response.data) {
        setStrategies(response.data)
      } else {
        console.warn("[Strategies] API unavailable, using mock data:", response.error)
        setStrategies(MOCK_STRATEGIES)
        setError(`API unavailable: ${response.error}. Showing demo data.`)
      }

      setLoading(false)
    }

    fetchStrategies()
  }, [filters]) // Updated dependency array to use the entire filters object

  return { strategies, loading, error }
}

export function useStrategy(id: string) {
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStrategy() {
      if (!id) return

      setLoading(true)
      setError(null)

      const response = await apiClient.strategies.get(id)

      if (response.success && response.data) {
        setStrategy(response.data)
      } else {
        setError(response.error || "Failed to fetch strategy")
      }

      setLoading(false)
    }

    fetchStrategy()
  }, [id])

  const subscribe = async (walletAddress: string) => {
    const response = await apiClient.strategies.subscribe(id, walletAddress)
    return response
  }

  const unsubscribe = async (walletAddress: string) => {
    const response = await apiClient.strategies.unsubscribe(id, walletAddress)
    return response
  }

  return { strategy, loading, error, subscribe, unsubscribe }
}
