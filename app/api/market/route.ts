import { fetchMarketSnapshots } from '@/lib/market-data';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/market - Get live market data for multiple assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols')?.split(',').filter(Boolean);
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'marketCap';
    const order = searchParams.get('order') || 'desc';

    const data = await fetchMarketSnapshots(symbols, limit);

    const sorted = [...data].sort((a: any, b: any) => {
      const aValue = a?.[sortBy];
      const bValue = b?.[sortBy];
      if (order === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return NextResponse.json({
      success: true,
      data: sorted.slice(0, limit),
      meta: { total: sorted.length, lastUpdated: new Date().toISOString() }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch market data' }, { status: 502 });
  }
}
