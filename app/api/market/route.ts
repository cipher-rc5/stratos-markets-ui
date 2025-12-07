import { NextRequest, NextResponse } from 'next/server';

// Types
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  circulatingSupply: number;
  totalSupply: number;
  lastUpdated: string;
}

// Mock market data
const mockMarketData: MarketData[] = [{
  symbol: 'BTC',
  name: 'Bitcoin',
  price: 42500.5,
  priceChange24h: 1250.3,
  priceChangePercent24h: 3.03,
  volume24h: 28500000000,
  marketCap: 832000000000,
  high24h: 43200.0,
  low24h: 41000.0,
  circulatingSupply: 19500000,
  totalSupply: 21000000,
  lastUpdated: new Date().toISOString()
}, {
  symbol: 'ETH',
  name: 'Ethereum',
  price: 2245.75,
  priceChange24h: 85.25,
  priceChangePercent24h: 3.95,
  volume24h: 15200000000,
  marketCap: 269000000000,
  high24h: 2280.0,
  low24h: 2150.0,
  circulatingSupply: 120000000,
  totalSupply: 120000000,
  lastUpdated: new Date().toISOString()
}, {
  symbol: 'USDC',
  name: 'USD Coin',
  price: 1.0,
  priceChange24h: 0.0,
  priceChangePercent24h: 0.0,
  volume24h: 5800000000,
  marketCap: 28000000000,
  high24h: 1.001,
  low24h: 0.999,
  circulatingSupply: 28000000000,
  totalSupply: 28000000000,
  lastUpdated: new Date().toISOString()
}, {
  symbol: 'LINK',
  name: 'Chainlink',
  price: 18.45,
  priceChange24h: -0.55,
  priceChangePercent24h: -2.89,
  volume24h: 680000000,
  marketCap: 10800000000,
  high24h: 19.2,
  low24h: 18.1,
  circulatingSupply: 587000000,
  totalSupply: 1000000000,
  lastUpdated: new Date().toISOString()
}, {
  symbol: 'UNI',
  name: 'Uniswap',
  price: 8.32,
  priceChange24h: 0.42,
  priceChangePercent24h: 5.32,
  volume24h: 125000000,
  marketCap: 6240000000,
  high24h: 8.5,
  low24h: 7.85,
  circulatingSupply: 750000000,
  totalSupply: 1000000000,
  lastUpdated: new Date().toISOString()
}];

// GET /api/market - Get market data for multiple assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols')?.split(',');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'marketCap';
    const order = searchParams.get('order') || 'desc';

    // Filter by symbols if provided
    let filteredData = symbols ? mockMarketData.filter((m) => symbols.includes(m.symbol)) : [...mockMarketData];

    // Sort data
    filteredData.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Limit results
    const limitedData = filteredData.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedData,
      meta: { total: limitedData.length, lastUpdated: new Date().toISOString() }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch market data' }, { status: 500 });
  }
}
