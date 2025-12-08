import { fetchPortfolioData } from '@/lib/dune-api';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/portfolio - proxy to live Dune-backed wallet snapshot
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const chainIdsParam = searchParams.get('chain_ids');

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    const chainIds = chainIdsParam ? chainIdsParam.split(',').map((id) => Number.parseInt(id.trim(), 10)) : undefined;

    const data = await fetchPortfolioData(walletAddress, chainIds);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch portfolio' }, { status: 502 });
  }
}

// POST /api/portfolio - not available without a persistence layer
export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Portfolio persistence is not available in this build. Connect a database-backed service to enable writes.'
  }, { status: 501 });
}
