import { fetchBalances } from '@/lib/dune-api';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/portfolio/history - Return latest live snapshot (no mock data)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const chainIdsParam = searchParams.get('chain_ids');
    const timeframe = searchParams.get('timeframe') || '30d'; // preserved for compatibility

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    const chainIds = chainIdsParam ? chainIdsParam.split(',').map((id) => Number.parseInt(id.trim(), 10)) : undefined;
    const balances = await fetchBalances(walletAddress, chainIds);

    const totalValueUSD = balances.reduce((sum, balance) => sum + balance.value_usd, 0);
    const assets = balances.reduce<Record<string, { amount: number, value: number, price: number }>>((acc, balance) => {
      const amount = Number(balance.amount) / Math.pow(10, balance.decimals || 0);
      const price = balance.price_usd;
      acc[balance.symbol] = { amount, value: balance.value_usd, price };
      return acc;
    }, {});

    const historyPoint = { timestamp: new Date().toISOString(), totalValue: totalValueUSD, totalValueUSD, assets };

    return NextResponse.json({
      success: true,
      data: [historyPoint],
      meta: {
        walletAddress,
        timeframe,
        dataPoints: 1,
        note: 'Historical curves require a time-series provider; returning the latest live snapshot.'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch portfolio history' }, { status: 500 });
  }
}
