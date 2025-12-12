// file: app/api/market/[symbol]/route.ts
// description: API route returning detailed live market data for a specific symbol
// reference: lib/market-data.ts

import { NextRequest, NextResponse } from 'next/server';

import { fetchCoinDetail } from '@/lib/market-data';

const FALLBACK_ERROR_MESSAGE = 'Failed to fetch market data';

// GET /api/market/[symbol] - Get detailed live market data for a specific asset
export async function GET(_request: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const marketData = await fetchCoinDetail(symbol);

    if (!marketData) {
      return NextResponse.json({ success: false, error: 'Market data not found for symbol' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: marketData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE;
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
