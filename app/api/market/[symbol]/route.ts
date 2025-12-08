import { fetchCoinDetail } from '@/lib/market-data';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/market/[symbol] - Get detailed live market data for a specific asset
export async function GET(_request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params;
    const marketData = await fetchCoinDetail(symbol);

    if (!marketData) {
      return NextResponse.json({ success: false, error: 'Market data not found for symbol' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: marketData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch market data' }, { status: 502 });
  }
}
