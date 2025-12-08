const COINGECKO_BASE_URL = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';

export interface MarketSnapshot {
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
  totalSupply: number | null;
  lastUpdated: string;
}

export interface DetailedMarketData extends MarketSnapshot {
  allTimeHigh?: number;
  allTimeLow?: number;
  volatility?: number | null;
  beta?: number | null;
  correlations?: Record<string, number>;
  technicalIndicators?: { rsi?: number, macd?: number, movingAverage50?: number, movingAverage200?: number };
}

async function handleCoingeckoResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Coingecko error ${response.status}: ${text || response.statusText}`);
  }
  return response.json();
}

export async function resolveCoinId(symbol: string): Promise<string | null> {
  const response = await fetch(`${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(symbol)}`);
  const data = await handleCoingeckoResponse(response);
  const normalized = symbol.toLowerCase();

  const exactSymbol = data.coins?.find((coin: any) => coin.symbol?.toLowerCase() === normalized);
  if (exactSymbol) return exactSymbol.id;

  return data.coins?.[0]?.id || null;
}

export async function fetchMarketSnapshots(symbols?: string[], limit = 20): Promise<MarketSnapshot[]> {
  let url =
    `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;

  if (symbols && symbols.length > 0) {
    const ids = (await Promise.all(symbols.map(resolveCoinId))).filter((id): id is string => Boolean(id));
    if (ids.length === 0) {
      return [];
    }

    url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&per_page=${
      Math.min(ids.length, limit)
    }&page=1&sparkline=false&price_change_percentage=24h`;
  }

  const response = await fetch(url);
  const data = await handleCoingeckoResponse(response);

  return (data || []).map((item: any) => ({
    symbol: item.symbol?.toUpperCase(),
    name: item.name,
    price: item.current_price,
    priceChange24h: item.price_change_24h,
    priceChangePercent24h: item.price_change_percentage_24h,
    volume24h: item.total_volume,
    marketCap: item.market_cap,
    high24h: item.high_24h,
    low24h: item.low_24h,
    circulatingSupply: item.circulating_supply,
    totalSupply: item.total_supply ?? null,
    lastUpdated: item.last_updated
  }));
}

export async function fetchCoinDetail(symbol: string): Promise<DetailedMarketData | null> {
  const coinId = await resolveCoinId(symbol);
  if (!coinId) return null;

  const response = await fetch(
    `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  const data = await handleCoingeckoResponse(response);
  const market = data.market_data;

  return {
    symbol: data.symbol?.toUpperCase(),
    name: data.name,
    price: market?.current_price?.usd,
    priceChange24h: market?.price_change_24h,
    priceChangePercent24h: market?.price_change_percentage_24h,
    volume24h: market?.total_volume?.usd,
    marketCap: market?.market_cap?.usd,
    high24h: market?.high_24h?.usd,
    low24h: market?.low_24h?.usd,
    circulatingSupply: market?.circulating_supply,
    totalSupply: market?.total_supply ?? null,
    lastUpdated: data.last_updated,
    allTimeHigh: market?.ath?.usd,
    allTimeLow: market?.atl?.usd,
    volatility: market?.price_change_percentage_60d_in_currency?.usd ?? null,
    beta: null,
    correlations: {},
    technicalIndicators: {
      rsi: market?.price_change_percentage_7d_in_currency?.usd,
      macd: market?.price_change_percentage_14d_in_currency?.usd,
      movingAverage50: market?.ath_change_percentage?.usd,
      movingAverage200: market?.atl_change_percentage?.usd
    }
  };
}

const intervalToDays: Record<string, number> = { '1m': 1, '5m': 1, '15m': 1, '1h': 1, '4h': 7, '1d': 30, '1w': 365 };

export async function fetchOhlcWithVolumes(symbol: string, interval: string, limit: number) {
  const coinId = await resolveCoinId(symbol);
  if (!coinId) return [];

  const days = intervalToDays[interval] || 30;

  const [ohlcResponse, volumeResponse] = await Promise.all([
    fetch(`${COINGECKO_BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`),
    fetch(`${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`)
  ]);

  const ohlcData = await handleCoingeckoResponse(ohlcResponse);
  const volumeData = await handleCoingeckoResponse(volumeResponse);
  const volumes: Array<[number, number]> = volumeData?.total_volumes || [];

  const findVolume = (timestamp: number) => {
    if (!volumes.length) return 0;
    let closest = volumes[0];
    for (const entry of volumes) {
      if (Math.abs(entry[0] - timestamp) < Math.abs(closest[0] - timestamp)) {
        closest = entry;
      }
    }
    return closest?.[1] || 0;
  };

  return (ohlcData || []).slice(-limit).map(([timestamp, open, high, low, close]: [number, number, number, number, number]) => ({
    timestamp: new Date(timestamp).toISOString(),
    open,
    high,
    low,
    close,
    volume: findVolume(timestamp)
  }));
}
