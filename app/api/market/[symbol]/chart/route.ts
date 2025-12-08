import { fetchOhlcWithVolumes } from '@/lib/market-data';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/market/[symbol]/chart - Get chart data for a specific asset
export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params;
    const { searchParams } = new URL(request.url);

    const interval = searchParams.get('interval') || '1h'; // 1m, 5m, 15m, 1h, 4h, 1d, 1w
    const limit = parseInt(searchParams.get('limit') || '100');

    const chartData = await fetchOhlcWithVolumes(symbol, interval, limit);

    if (!chartData.length) {
      return NextResponse.json({ success: false, error: 'No chart data available for symbol' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: chartData,
      meta: { symbol: symbol.toUpperCase(), interval, dataPoints: chartData.length, lastUpdated: new Date().toISOString() }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch chart data' }, { status: 502 });
  }
}
