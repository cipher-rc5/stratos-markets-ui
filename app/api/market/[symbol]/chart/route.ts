// file: app/api/market/[symbol]/chart/route.ts
// description: API route returning OHLCV chart data for a specific market symbol
// reference: lib/market-data.ts

import { NextRequest, NextResponse } from 'next/server';

import { fetchOhlcWithVolumes } from '@/lib/market-data';

const FALLBACK_ERROR_MESSAGE = 'Failed to fetch chart data';

// GET /api/market/[symbol]/chart - Get chart data for a specific asset
export async function GET(request: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);

    const interval = searchParams.get('interval') || '1h'; // 1m, 5m, 15m, 1h, 4h, 1d, 1w
    const limit = Number.parseInt(searchParams.get('limit') || '100', 10);

    const chartData = await fetchOhlcWithVolumes(symbol, interval, limit);

    if (!chartData.length) {
      return NextResponse.json({ success: false, error: 'No chart data available for symbol' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: chartData,
      meta: { symbol: symbol.toUpperCase(), interval, dataPoints: chartData.length, lastUpdated: new Date().toISOString() }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE;
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
