import { NextRequest, NextResponse } from 'next/server';

// Types
export interface PortfolioHistoryPoint {
  timestamp: string;
  totalValue: number;
  totalValueUSD: number;
  assets: { [symbol: string]: { amount: number, value: number, price: number } };
}

// Mock data - generate historical data
function generateHistoricalData(days: number): PortfolioHistoryPoint[] {
  const data: PortfolioHistoryPoint[] = [];
  const now = Date.now();
  let baseValue = 20000;

  for (let i = days;i >= 0;i--) {
    const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();

    // Add some random variation
    const variation = (Math.random() - 0.5) * 1000;
    const totalValueUSD = baseValue + variation;
    baseValue += variation * 0.1; // Trend component

    data.push({
      timestamp,
      totalValue: totalValueUSD / 4.5, // Rough conversion
      totalValueUSD,
      assets: {
        ETH: { amount: 5.2345, value: totalValueUSD * 0.45, price: (totalValueUSD * 0.45) / 5.2345 },
        BTC: { amount: 0.1234, value: totalValueUSD * 0.21, price: (totalValueUSD * 0.21) / 0.1234 },
        USDC: { amount: 5000, value: 5000, price: 1 },
        LINK: { amount: 150, value: totalValueUSD * 0.12, price: (totalValueUSD * 0.12) / 150 }
      }
    });
  }

  return data;
}

// GET /api/portfolio/history - Get portfolio historical data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const timeframe = searchParams.get('timeframe') || '30d'; // 7d, 30d, 90d, 1y, all

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    // Map timeframe to days
    const timeframeMap: { [key: string]: number } = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      all: 730 // 2 years
    };

    const days = timeframeMap[timeframe] || 30;

    // In production, fetch from database
    const history = generateHistoricalData(days);

    return NextResponse.json({ success: true, data: history, meta: { walletAddress, timeframe, dataPoints: history.length } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch portfolio history' }, { status: 500 });
  }
}
