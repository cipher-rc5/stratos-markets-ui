"use client"

import { useState, useEffect } from "react"
import { apiClient } from "../api-client"

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

export interface Portfolio {
  id: string
  walletAddress: string
  assets: PortfolioAsset[]
  performance: {
    totalValue: number
    totalValueUSD: number
    dailyChange: number
    dailyChangePercent: number
    weeklyChange: number
    weeklyChangePercent: number
    monthlyChange: number
    monthlyChangePercent: number
  }
  activeStrategies: string[]
  activeAgents: string[]
  lastUpdated: string
}

export function usePortfolio(walletAddress: string | null) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPortfolio() {
      if (!walletAddress) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const response = await apiClient.portfolio.get(walletAddress)

      if (response.success && response.data) {
        setPortfolio(response.data)
      } else {
        setError(response.error || "Failed to fetch portfolio")
      }

      setLoading(false)
    }

    fetchPortfolio()
  }, [walletAddress])

  return { portfolio, loading, error }
}

export function usePortfolioHistory(
  walletAddress: string | null,
  timeframe: string = "30d"
) {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHistory() {
      if (!walletAddress) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const response = await apiClient.portfolio.getHistory(walletAddress, timeframe)

      if (response.success && response.data) {
        setHistory(response.data)
      } else {
        setError(response.error || "Failed to fetch portfolio history")
      }

      setLoading(false)
    }

    fetchHistory()
  }, [walletAddress, timeframe])

  return { history, loading, error }
}

export function useTransactions(walletAddress: string | null, type?: string) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransactions() {
      if (!walletAddress) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const response = await apiClient.portfolio.getTransactions(walletAddress, { type })

      if (response.success && response.data) {
        setTransactions(response.data)
      } else {
        setError(response.error || "Failed to fetch transactions")
      }

      setLoading(false)
    }

    fetchTransactions()
  }, [walletAddress, type])

  return { transactions, loading, error }
}

