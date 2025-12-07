"use client"

import { useState, useEffect } from "react"
import { apiClient } from "../api-client"

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
        setError(response.error || "Failed to fetch strategies")
      }

      setLoading(false)
    }

    fetchStrategies()
  }, [filters?.category, filters?.verified, filters?.riskLevel, filters?.search])

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

