import { fetchTransactions } from '@/lib/dune-api';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/portfolio/transactions - Get transaction history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const chainIdsParam = searchParams.get('chain_ids');

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    const chainIds = chainIdsParam ? chainIdsParam.split(',').map((id) => Number.parseInt(id.trim(), 10)) : undefined;
    const transactions = await fetchTransactions(walletAddress, chainIds);
    let filteredTransactions = [...transactions];

    if (status) {
      const normalizedStatus = status.toLowerCase();
      filteredTransactions = filteredTransactions.filter((t) => {
        if (normalizedStatus === 'confirmed' || normalizedStatus === 'success') return t.status === 1;
        if (normalizedStatus === 'failed') return t.status !== 1;
        return t.status.toString() === status;
      });
    }

    // Type filtering is skipped because the upstream provider does not classify transaction intent.

    // Sort by timestamp (newest first)
    filteredTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Paginate
    const total = filteredTransactions.length;
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      meta: { total, limit, offset, hasMore: offset + limit < total }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch transactions' }, { status: 500 });
  }
}
