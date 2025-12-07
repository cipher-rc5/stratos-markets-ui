import { NextRequest, NextResponse } from "next/server"

// Types
export interface ChartDataPoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Generate mock chart data
function generateChartData(
  symbol: string,
  interval: string,
  limit: number
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = Date.now()
  
  // Base price for each symbol
  const basePrices: { [key: string]: number } = {
    BTC: 42500,
    ETH: 2245,
    USDC: 1,
    LINK: 18.45,
    UNI: 8.32,
  }

  const basePrice = basePrices[symbol.toUpperCase()] || 100
  
  // Interval to milliseconds
  const intervalMs: { [key: string]: number } = {
    "1m": 60 * 1000,
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "4h": 4 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
  }

  const ms = intervalMs[interval] || intervalMs["1h"]

  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * ms).toISOString()
    
    // Generate realistic OHLCV data
    const variation = (Math.random() - 0.5) * basePrice * 0.02
    const open = basePrice + variation
    const high = open + Math.random() * basePrice * 0.01
    const low = open - Math.random() * basePrice * 0.01
    const close = low + Math.random() * (high - low)
    const volume = Math.random() * 1000000000

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    })

    // Update base price for next candle
    basePrice = close
  }

  return data
}

// GET /api/market/[symbol]/chart - Get chart data for a specific asset
export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params
    const { searchParams } = new URL(request.url)
    
    const interval = searchParams.get("interval") || "1h" // 1m, 5m, 15m, 1h, 4h, 1d, 1w
    const limit = parseInt(searchParams.get("limit") || "100")

    // Generate chart data
    const chartData = generateChartData(symbol, interval, limit)

    return NextResponse.json({
      success: true,
      data: chartData,
      meta: {
        symbol: symbol.toUpperCase(),
        interval,
        dataPoints: chartData.length,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch chart data",
      },
      { status: 500 }
    )
  }
}

