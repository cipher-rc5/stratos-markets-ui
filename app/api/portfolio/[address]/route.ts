import { type NextRequest, NextResponse } from 'next/server';
import { fetchPortfolioData } from '../../../../lib/dune-api';

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string | string[] }> }) {
  try {
    const resolvedParams = await params;
    const rawAddress = Array.isArray(resolvedParams.address) ? resolvedParams.address[0] : resolvedParams.address;
    const address = rawAddress?.trim();
    console.log('[v0] API route called with address:', address);
    const searchParams = request.nextUrl.searchParams;
    const chainIdsParam = searchParams.get('chain_ids');

    // Validate address format (basic check)
    if (!address || typeof address !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      console.log('[v0] Invalid address format:', address);
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }

    // Parse chain IDs if provided
    const chainIds = chainIdsParam ? chainIdsParam.split(',').map((id) => Number.parseInt(id.trim(), 10)) : undefined;
    console.log('[v0] Fetching portfolio data for chains:', chainIds || 'all');

    // Fetch portfolio data from Dune API (server-side only)
    const data = await fetchPortfolioData(address, chainIds);
    console.log('[v0] Successfully fetched portfolio data:', {
      balances: data.balances?.length || 0,
      transactions: data.transactions?.length || 0,
      positions: data.defiPositions?.length || 0
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[v0] Error in portfolio API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
