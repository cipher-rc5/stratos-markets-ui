"use client"

import { useState, useEffect } from "react"
import { apiClient } from "../api-client"

export interface MarketData {
  symbol: string
  name: string
  price: number
  priceChange24h: number
  priceChangePercent24h: number
  volume24h: number
  marketCap: number
  high24h: number
  low24h: number
  lastUpdated: string
}

export function useMarketData(symbols?: string[]) {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true)
      setError(null)

      const response = await apiClient.market.list({ symbols })

      if (response.success && response.data) {
        setMarketData(response.data)
      } else {
        setError(response.error || "Failed to fetch market data")
      }

      setLoading(false)
    }

    fetchMarketData()
  }, [symbols?.join(",")])

  return { marketData, loading, error }
}

export function useAssetPrice(symbol: string) {
  const [assetData, setAssetData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAssetData() {
      if (!symbol) return

      setLoading(true)
      setError(null)

      const response = await apiClient.market.get(symbol)

      if (response.success && response.data) {
        setAssetData(response.data)
      } else {
        setError(response.error || "Failed to fetch asset data")
      }

      setLoading(false)
    }

    fetchAssetData()
  }, [symbol])

  return { assetData, loading, error }
}

export function useChartData(symbol: string, interval = "1h", limit = 100) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChartData() {
      if (!symbol) return

      setLoading(true)
      setError(null)

      const response = await apiClient.market.getChart(symbol, interval, limit)

      if (response.success && response.data) {
        setChartData(response.data)
      } else {
        setError(response.error || "Failed to fetch chart data")
      }

      setLoading(false)
    }

    fetchChartData()
  }, [symbol, interval, limit])

  return { chartData, loading, error }
}

