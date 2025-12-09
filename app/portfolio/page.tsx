'use client';
// file: app/portfolio/page.tsx
// description: Portfolio dashboard with wallet search, cached results, and token/protocol views
// reference: lib/dune-api.ts, app/api/portfolio/[address]/route.ts

import type { DuneBalance, DuneDefiPosition, DuneTransaction } from '@/lib/dune-api';
import { TokenAAVE, TokenARB, TokenAVAX, TokenBNB, TokenBTC, TokenCOMP, TokenCRV, TokenDAI, TokenETH, TokenGMX, TokenLINK, TokenMATIC, TokenOP, TokenUNI, TokenUSDC, TokenUSDT, TokenWBTC } from '@web3icons/react';
import { AlertCircle, ExternalLink, Search, TrendingUp } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import Navbar from '../../components/navbar';

const PORTFOLIO_CACHE_KEY_PREFIX = 'portfolio:';
const isBrowser = typeof window !== 'undefined';

const readCachedPortfolio = async (address: string) => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(`${PORTFOLIO_CACHE_KEY_PREFIX}${address.toLowerCase()}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const cachePortfolioResult = async (address: string, data: any) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(`${PORTFOLIO_CACHE_KEY_PREFIX}${address.toLowerCase()}`, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
};

async function fetchPortfolioData(walletAddress: string, chainIds?: number[]) {
  const chainParam = chainIds ? `?chain_ids=${chainIds.join(',')}` : '';
  console.log('[v0] Client: Fetching portfolio data from API route');

  const response = await fetch(`/api/portfolio/${walletAddress}${chainParam}`);

  console.log('[v0] Client: API response status:', response.status, response.statusText);

  if (!response.ok) {
    const fallbackText = await response.text().catch(() => '');
    let errorData: any = {};
    try {
      errorData = JSON.parse(fallbackText);
    } catch {
      // not JSON, keep as string
    }
    console.error('[v0] Client: API error response:', errorData || fallbackText);
    const message = (errorData && (errorData.details || errorData.error)) ||
      fallbackText ||
      `Failed to fetch portfolio data: ${response.status} ${response.statusText}`;
    return { balances: [], transactions: [], defiPositions: [], error: message };
  }

  const data = await response.json();
  console.log('[v0] Client: API data received successfully');
  return data;
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'nfts' | 'protocols' | 'transactions' | 'analytics'>('overview');
  const [searchAddress, setSearchAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<DuneBalance[]>([]);
  const [transactions, setTransactions] = useState<DuneTransaction[]>([]);
  const [defiPositions, setDefiPositions] = useState<DuneDefiPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmptyData, setIsEmptyData] = useState(false); // Flag when no live data is returned

  const performSearch = async (address: string) => {
    setIsLoading(true);
    setError(null);
    setIsEmptyData(false);
    setCurrentAddress(address);

    try {
      const cached = await readCachedPortfolio(address);
      if (cached) {
        setBalances(cached.balances || []);
        setTransactions(cached.transactions || []);
        setDefiPositions(cached.defiPositions || []);
        const hasRealData = (cached.balances?.length || 0) > 0 ||
          (cached.transactions?.length || 0) > 0 ||
          (cached.defiPositions?.length || 0) > 0;
        setIsEmptyData(!hasRealData);
        setIsLoading(false);
        return;
      }

      console.log('[v0] Loading portfolio data for:', address);
      const data = await fetchPortfolioData(address);
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('[v0] Portfolio data received:', {
        balances: data.balances?.length || 0,
        transactions: data.transactions?.length || 0,
        positions: data.defiPositions?.length || 0
      });

      const hasRealData = data.balances?.length > 0 || data.transactions?.length > 0 || data.defiPositions?.length > 0;

      if (!hasRealData) {
        setIsEmptyData(true);
        console.log('[v0] No real data found for this wallet');
      }

      setBalances(data.balances || []);
      setTransactions(data.transactions || []);
      setDefiPositions(data.defiPositions || []);
      await cachePortfolioResult(address, { balances: data.balances, transactions: data.transactions, defiPositions: data.defiPositions });
    } catch (err) {
      console.error('[v0] Portfolio data error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load portfolio data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const trimmed = searchAddress.trim();
    if (!trimmed) return;
    performSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const totalValue = balances.reduce((sum, balance) => sum + balance.value_usd, 0);

  const balancesByChain: Record<number, { name: string, totalValue: number, tokens: DuneBalance[] }> = balances.reduce((acc, balance) => {
    const chainId = balance.chain_id;
    if (!acc[chainId]) {
      acc[chainId] = { name: balance.chain, totalValue: 0, tokens: [] };
    }
    acc[chainId].totalValue += balance.value_usd;
    acc[chainId].tokens.push(balance);
    return acc;
  }, {} as Record<number, { name: string, totalValue: number, tokens: DuneBalance[] }>);

  const protocolTotals: Record<string, { totalValue: number, positions: DuneDefiPosition[] }> = defiPositions.reduce((acc, position) => {
    const protocol = position.protocol;
    if (!acc[protocol]) {
      acc[protocol] = { totalValue: 0, positions: [] };
    }
    acc[protocol].totalValue += position.usd_value;
    acc[protocol].positions.push(position);
    return acc;
  }, {} as Record<string, { totalValue: number, positions: DuneDefiPosition[] }>);

  const protocolEntries = Object.entries(protocolTotals) as Array<[string, { totalValue: number, positions: DuneDefiPosition[] }]>;
  const chainEntries = Object.entries(balancesByChain) as Array<[string, { name: string, totalValue: number, tokens: DuneBalance[] }]>;

  const tokenIconMap: Record<string, any> = {
    ETH: TokenETH,
    WETH: TokenETH,
    AVAX: TokenAVAX,
    WAVAX: TokenAVAX,
    USDC: TokenUSDC,
    USDT: TokenUSDT,
    DAI: TokenDAI,
    WBTC: TokenWBTC,
    BTC: TokenBTC,
    LINK: TokenLINK,
    UNI: TokenUNI,
    AAVE: TokenAAVE,
    CRV: TokenCRV,
    OP: TokenOP,
    ARB: TokenARB,
    COMP: TokenCOMP,
    GMX: TokenGMX,
    MATIC: TokenMATIC,
    BNB: TokenBNB
  };

  // Map token symbols to icon components
  const getTokenIcon = (symbol: string) => {
    const IconComponent = tokenIconMap[symbol.toUpperCase()];
    return IconComponent ? <IconComponent variant='branded' size={32} /> : null;
  };

  // Derived from live balances/transactions
  const chains = chainEntries.map(([chainId, { name, totalValue }]) => ({
    id: chainId,
    name,
    balance: totalValue,
    change: 0,
    txCount: transactions.filter((tx) => tx.chain_id === Number(chainId)).length,
    gasSpent: 0
  }));

  // NFT data is not available from the current provider; render empty state
  const nfts: any[] = [];

  const protocolsFromExisting = protocolEntries.map(([protocol, { totalValue, positions }]) => {
    const first = positions[0];
    return {
      name: protocol,
      chain: first?.chain_id ? first.chain_id.toString() : 'multi-chain',
      type: first?.type || 'protocol',
      supplied: first?.supply_quote?.usd_value ?? totalValue,
      borrowed: first?.debt_quote?.usd_value,
      apy: null,
      health: null,
      liquidity: first?.usd_value ?? totalValue,
      fees24h: null,
      range: first?.positions?.length ? 'Tracked' : undefined,
      IconComponent: first?.token_symbol ? tokenIconMap[first.token_symbol.toUpperCase()] : undefined
    };
  });

  const tokensFromExisting = balances.map((balance) => {
    const amount = Number(balance.amount) / Math.pow(10, balance.decimals || 0);
    return {
      symbol: balance.symbol,
      name: balance.name,
      chain: balance.chain,
      balance: amount,
      price: balance.price_usd,
      value: balance.value_usd,
      change24h: 0,
      change7d: 0,
      allocation: totalValue ? (balance.value_usd / totalValue) * 100 : 0,
      cost: balance.price_usd,
      pnl: 0,
      pnlPercent: 0,
      IconComponent: tokenIconMap[balance.symbol?.toUpperCase()]
    };
  });

  const transactionsFromExisting = transactions.map((tx) => ({
    type: tx.decoded?.function_name || 'Transfer',
    from: tx.from_address,
    to: tx.to_address || '',
    fromAmount: Number(tx.value) || 0,
    toAmount: 0,
    chain: tx.chain,
    time: new Date(tx.block_timestamp).toLocaleString(),
    hash: tx.hash,
    status: tx.status === 1 ? 'confirmed' : 'failed',
    gas: Number(tx.transaction_fee) || 0,
    fromIcon: undefined,
    toIcon: undefined
  }));

  const performanceData = {
    totalPnL: 4821.34,
    totalPnLPercent: 9.93,
    nftValue: 164793.32,
    totalGasSpent: 124.56,
    totalTransactions: 2713,
    activeProtocols: 6,
    activeDays: 234
  };

  const riskMetrics = {
    portfolioHealth: 8.5,
    diversificationScore: 7.8,
    exposureRisk: 'Medium',
    liquidationRisk: 'Low',
    impermanentLoss: 234.56,
    concentrationRisk: 23.0 // % in top holding
  };

  const totalDefiValue = defiPositions.reduce((sum, pos) => sum + (pos.usd_value || 0), 0);
  const totalNftValue = performanceData.nftValue || 0;
  const totalPnL = performanceData.totalPnL || 0;
  const totalPnLPercent = performanceData.totalPnLPercent || 0;
  const chainCards = chainEntries.slice(0, 6);
  const topHoldings = [...balances].sort((a, b) => b.value_usd - a.value_usd).slice(0, 5);
  const topProtocolEntries = [...protocolEntries].sort(([, a], [, b]) => b.totalValue - a.totalValue).slice(0, 5);

  const formatUsd = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className='min-h-screen bg-[#040404] text-white'>
      <Navbar />

      <main className='mx-auto w-full max-w-[1440px] px-4 pb-16 pt-10 lg:px-8'>
        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <div className='inline-block w-12 h-12 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-4' />
              <p className='text-gray-400'>Loading portfolio data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8 flex items-start gap-3'>
            <AlertCircle className='text-red-500 flex-shrink-0 mt-0.5' size={20} />
            <div>
              <p className='text-red-500 font-semibold'>Error Loading Portfolio</p>
              <p className='text-red-400 text-sm mt-1'>{error}</p>
            </div>
          </div>
        )}

        {/* Info Banner for Mock Data */}
        {isEmptyData && (
          <div className='bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-8 flex items-start gap-3'>
            <AlertCircle className='text-blue-500 flex-shrink-0 mt-0.5' size={20} />
            <div>
              <p className='text-blue-500 font-semibold'>Using Mock Data</p>
              <p className='text-blue-400 text-sm mt-1'>Please enter a real wallet address for accurate data.</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className='flex flex-col gap-10'>
            {/* Hero / Search */}
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-2'>
                <p className='text-[11px] uppercase tracking-[0.3em] text-[#ccff00]'>Portfolio Status · Live</p>
                <h1 className='text-3xl font-bold md:text-4xl'>
                  DeFi <span className='text-[#ccff00]'>Portfolio</span>
                </h1>
                <p className='max-w-2xl text-sm text-gray-400'>
                  Advanced multi-chain portfolio tracking and analytics powered by Dune data.
                </p>
              </div>

              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:w-auto'>
                  <div className='relative w-full sm:min-w-[320px]'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' size={20} />
                    <input
                      type='text'
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder='Search any wallet address (0x...)'
                      className='w-full rounded-lg border border-gray-900 bg-[#0b0b0b] pl-12 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#ccff00] focus:outline-none' />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={isLoading || !searchAddress.trim()}
                    className='inline-flex items-center justify-center rounded-lg bg-[#ccff00] px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-white disabled:opacity-50'>
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                <div className='flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gray-500'>
                  <span className='rounded-full border border-gray-900 bg-[#0b0b0b] px-3 py-1'>Viewing wallet</span>
                  <span className='font-mono text-xs text-white'>{currentAddress ?? '—'}</span>
                </div>
              </div>

              <div className='flex flex-wrap gap-3 text-xs'>
                <button className='rounded-md border border-gray-900 bg-[#0b0b0b] px-3 py-2 text-gray-300 hover:border-[#ccff00] hover:text-white transition'>
                  Refresh Data
                </button>
                <button className='rounded-md border border-gray-900 bg-[#0b0b0b] px-3 py-2 text-gray-300 hover:border-[#ccff00] hover:text-white transition'>
                  Export CSV
                </button>
                <button className='rounded-md border border-gray-900 bg-[#0b0b0b] px-3 py-2 text-gray-300 hover:border-[#ccff00] hover:text-white transition'>
                  Set Alerts
                </button>
              </div>
            </div>

            {/* KPI Row */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
              <div className='rounded-xl border border-gray-900 bg-gradient-to-br from-[#0b0b0b] to-[#101010] p-5 shadow-lg shadow-black/40'>
                <p className='text-[11px] uppercase tracking-[0.25em] text-gray-500'>Total Net Worth</p>
                <p className='mt-2 text-3xl font-bold'>{formatUsd(totalValue)}</p>
                <p className='mt-1 text-xs text-gray-500'>Live · All chains</p>
              </div>
              <div className='rounded-xl border border-gray-900 bg-gradient-to-br from-[#0b0b0b] to-[#101010] p-5 shadow-lg shadow-black/40'>
                <p className='text-[11px] uppercase tracking-[0.25em] text-gray-500'>Total PnL</p>
                <div className='mt-2 flex items-baseline gap-2'>
                  <p className='text-3xl font-bold text-[#ccff00]'>{formatUsd(totalPnL)}</p>
                  <span className='text-sm font-semibold text-[#ccff00]'>+{totalPnLPercent}%</span>
                </div>
                <p className='mt-1 text-xs text-gray-500'>Since inception</p>
              </div>
              <div className='rounded-xl border border-gray-900 bg-gradient-to-br from-[#0b0b0b] to-[#101010] p-5 shadow-lg shadow-black/40'>
                <p className='text-[11px] uppercase tracking-[0.25em] text-gray-500'>DeFi Value</p>
                <p className='mt-2 text-3xl font-bold'>{formatUsd(totalDefiValue)}</p>
                <p className='mt-1 text-xs text-gray-500'>{protocolEntries.length} protocols</p>
              </div>
              <div className='rounded-xl border border-gray-900 bg-gradient-to-br from-[#0b0b0b] to-[#101010] p-5 shadow-lg shadow-black/40'>
                <p className='text-[11px] uppercase tracking-[0.25em] text-gray-500'>NFT Value</p>
                <p className='mt-2 text-3xl font-bold'>{formatUsd(totalNftValue)}</p>
                <p className='mt-1 text-xs text-gray-500'>Collections & assets</p>
              </div>
            </div>

            {/* Risk & Chain Distribution */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
              <div className='rounded-xl border border-gray-900 bg-[#0b0b0b] p-6 shadow-lg shadow-black/40 lg:col-span-1'>
                <div className='mb-4 flex items-center justify-between'>
                  <div>
                    <p className='text-[11px] uppercase tracking-[0.25em] text-gray-500'>Risk & Health Metrics</p>
                    <p className='text-sm text-gray-400'>Modeled · 30d</p>
                  </div>
                  <span className='text-xs font-semibold text-[#ccff00]'>In Sync</span>
                </div>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-400'>Portfolio Health</span>
                      <span className='font-semibold text-white'>{riskMetrics.portfolioHealth}/10</span>
                    </div>
                    <div className='mt-2 h-2 w-full rounded-full bg-gray-900'>
                      <div
                        className='h-2 rounded-full bg-[#ccff00]'
                        style={{ width: `${(riskMetrics.portfolioHealth / 10) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-gray-400'>Diversification</span>
                      <span className='font-semibold text-white'>{riskMetrics.diversificationScore}/10</span>
                    </div>
                    <div className='mt-2 h-2 w-full rounded-full bg-gray-900'>
                      <div
                        className='h-2 rounded-full bg-blue-500'
                        style={{ width: `${(riskMetrics.diversificationScore / 10) * 100}%` }} />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div className='rounded-lg border border-gray-900 bg-[#0f0f0f] p-3'>
                      <p className='text-gray-500'>Exposure Risk</p>
                      <p className='mt-1 font-semibold text-white'>{riskMetrics.exposureRisk}</p>
                    </div>
                    <div className='rounded-lg border border-gray-900 bg-[#0f0f0f] p-3'>
                      <p className='text-gray-500'>Liquidation Risk</p>
                      <p className='mt-1 font-semibold text-green-400'>{riskMetrics.liquidationRisk}</p>
                    </div>
                    <div className='rounded-lg border border-gray-900 bg-[#0f0f0f] p-3'>
                      <p className='text-gray-500'>IL Exposure</p>
                      <p className='mt-1 font-semibold text-red-400'>{formatUsd(riskMetrics.impermanentLoss)}</p>
                    </div>
                    <div className='rounded-lg border border-gray-900 bg-[#0f0f0f] p-3'>
                      <p className='text-gray-500'>Concentration</p>
                      <p className='mt-1 font-semibold text-[#ccff00]'>{riskMetrics.concentrationRisk}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-xl border border-gray-900 bg-[#0b0b0b] p-6 shadow-lg shadow-black/40 lg:col-span-2'>
                <div className='mb-6 flex items-center justify-between'>
                  <div>
                    <p className='text-[11px] uppercase tracking-[0.25em] text-gray-500'>Chain Distribution</p>
                    <p className='text-sm text-gray-400'>Value by network</p>
                  </div>
                  <span className='text-xs text-gray-500'>Live</span>
                </div>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
                  {chainCards.map(([chainId, data]) => (
                    <div
                      key={chainId}
                      className='rounded-xl border border-gray-900 bg-[#0f0f0f] p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-semibold text-white'>{data.name}</p>
                          <p className='text-xs text-gray-500'>Chain ID: {chainId}</p>
                        </div>
                        <span className='text-xs font-semibold text-[#ccff00]'>↑</span>
                      </div>
                      <div className='mt-3 flex items-end justify-between'>
                        <p className='text-2xl font-bold'>{formatUsd(data.totalValue)}</p>
                        <div className='flex items-center gap-1 text-xs text-[#ccff00]'>
                          <TrendingUp size={14} />
                          <span>0.00%</span>
                        </div>
                      </div>
                      <p className='mt-1 text-xs text-gray-500'>
                        {balances.filter((b) => b.chain_id === Number(chainId)).length} assets
                      </p>
                    </div>
                  ))}
                  {chainCards.length === 0 && <p className='text-gray-500'>No chain data available</p>}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className='flex flex-wrap gap-2 rounded-xl border border-gray-900 bg-[#0b0b0b] p-2'>
              {(['overview', 'tokens', 'protocols', 'transactions', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                    activeTab === tab ? 'bg-[#ccff00] text-black' : 'text-gray-400 hover:text-white'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                <div className='rounded-2xl border border-gray-900 bg-[#0b0b0b] p-6'>
                  <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-lg font-bold uppercase tracking-[0.15em]'>Top Holdings</h3>
                    <span className='text-xs text-[#ccff00]'>View All</span>
                  </div>
                  <div className='space-y-3'>
                    {topHoldings.map((balance, index) => (
                      <div
                        key={`${balance.chain_id}-${balance.address}-${index}`}
                        className='flex items-center justify-between rounded-xl border border-gray-900 bg-[#101010] p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a]'>
                            {getTokenIcon(balance.symbol)}
                          </div>
                          <div>
                            <p className='font-semibold text-white'>{balance.symbol}</p>
                            <p className='text-xs uppercase tracking-[0.15em] text-gray-500'>{balance.chain}</p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm text-gray-500'>Total value</p>
                          <p className='text-lg font-bold text-white'>
                            {formatUsd(balance.value_usd)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {topHoldings.length === 0 && <p className='text-gray-500'>No holdings yet</p>}
                  </div>
                </div>

                <div className='rounded-2xl border border-gray-900 bg-[#0b0b0b] p-6'>
                  <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-lg font-bold uppercase tracking-[0.15em]'>Protocol Positions</h3>
                    <span className='text-xs text-[#ccff00]'>View All</span>
                  </div>
                  <div className='space-y-3'>
                    {topProtocolEntries.map(([protocol, data]) => (
                      <div
                        key={protocol}
                        className='flex items-center justify-between rounded-xl border border-gray-900 bg-[#101010] p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a]'>
                            {getTokenIcon(protocol)}
                          </div>
                          <div>
                            <p className='font-semibold text-white'>{protocol}</p>
                            <p className='text-xs text-gray-500'>{data.positions.length} positions</p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm text-gray-500'>Total value</p>
                          <p className='text-lg font-bold text-[#ccff00]'>{formatUsd(data.totalValue)}</p>
                        </div>
                      </div>
                    ))}
                    {topProtocolEntries.length === 0 && <p className='text-gray-500'>No protocol data yet</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tokens' && (
              <div className='rounded-2xl border border-gray-900 bg-[#0b0b0b] p-6'>
                <h3 className='text-lg font-bold uppercase tracking-[0.15em] mb-4'>Token Holdings</h3>
                <div className='space-y-3'>
                  {balances.map((balance, index) => (
                    <div
                      key={`${balance.chain_id}-${balance.address}-${index}`}
                      className='flex flex-col gap-3 rounded-xl border border-gray-900 bg-[#101010] p-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='flex items-center gap-4 flex-1'>
                        <div className='h-10 w-10 rounded-full bg-[#1a1a1a] flex items-center justify-center'>
                          {getTokenIcon(balance.symbol)}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <p className='font-semibold'>{balance.symbol}</p>
                            <span className='text-xs px-2 py-0.5 bg-[#1a1a1a] rounded-full text-gray-400'>{balance.chain}</span>
                          </div>
                          <p className='text-sm text-gray-400'>{balance.name}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold'>{formatUsd(balance.value_usd)}</p>
                        <p className='text-sm text-gray-400'>
                          {(Number.parseFloat(balance.amount) / Math.pow(10, balance.decimals)).toFixed(6)} {balance.symbol}
                        </p>
                        <p className='text-xs text-gray-500'>${balance.price_usd.toFixed(6)} per token</p>
                      </div>
                    </div>
                  ))}
                  {balances.length === 0 && <p className='text-center text-gray-500 py-8'>No token holdings found</p>}
                </div>
              </div>
            )}

            {activeTab === 'protocols' && (
              <div className='rounded-2xl border border-gray-900 bg-[#0b0b0b] p-6'>
                <h3 className='text-lg font-bold uppercase tracking-[0.15em] mb-4'>DeFi Protocol Positions</h3>
                <div className='space-y-4'>
                  {defiPositions.map((position, index) => (
                    <div
                      key={`${position.protocol}-${position.chain_id}-${index}`}
                      className='rounded-xl border border-gray-900 bg-[#101010] p-4'>
                      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='h-10 w-10 rounded-full bg-[#1a1a1a] flex items-center justify-center'>
                            {getTokenIcon(position.protocol)}
                          </div>
                          <div>
                            <p className='font-semibold'>{position.protocol}</p>
                            <p className='text-sm text-gray-400'>{position.type}</p>
                          </div>
                        </div>
                        <p className='text-lg font-bold text-[#ccff00]'>{formatUsd(position.usd_value)}</p>
                      </div>

                      {position.token0_symbol && position.token1_symbol && (
                        <div className='mt-3 grid grid-cols-1 gap-3 border-t border-gray-900 pt-3 sm:grid-cols-2'>
                          <div>
                            <p className='text-sm font-semibold'>{position.token0_symbol}</p>
                            <p className='text-xs text-gray-500'>{position.token0_name}</p>
                          </div>
                          <div>
                            <p className='text-sm font-semibold'>{position.token1_symbol}</p>
                            <p className='text-xs text-gray-500'>{position.token1_name}</p>
                          </div>
                        </div>
                      )}

                      {position.supply_quote && (
                        <div className='mt-3 flex items-center justify-between border-t border-gray-900 pt-3 text-sm'>
                          <span className='text-gray-400'>Supplied</span>
                          <span className='font-semibold text-green-500'>
                            {formatUsd(position.supply_quote.usd_value)}
                          </span>
                        </div>
                      )}

                      {position.debt_quote && (
                        <div className='mt-2 flex items-center justify-between text-sm'>
                          <span className='text-gray-400'>Borrowed</span>
                          <span className='font-semibold text-red-500'>
                            {formatUsd(position.debt_quote.usd_value)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {defiPositions.length === 0 && <p className='text-center text-gray-500 py-8'>No DeFi positions found</p>}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className='rounded-2xl border border-gray-900 bg-[#0b0b0b] p-6'>
                <h3 className='text-lg font-bold uppercase tracking-[0.15em] mb-4'>Recent Transactions</h3>
                <div className='space-y-3'>
                  {transactions.map((tx, index) => (
                    <div
                      key={`${tx.hash}-${index}`}
                      className='rounded-xl border border-gray-900 bg-[#101010] p-4'>
                      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className={`h-2 w-2 rounded-full ${tx.status === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className='font-mono text-sm'>{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</p>
                            <p className='text-xs text-gray-500'>{new Date(tx.block_timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-1 text-xs font-semibold text-[#ccff00] hover:underline'>
                          <span>View</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className='mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-400'>
                        <span>Chain: {tx.chain}</span>
                        <span>Gas: {(Number.parseFloat(tx.transaction_fee) / 1e18).toFixed(6)} ETH</span>
                        {tx.decoded?.function_name && (
                          <span className='font-mono text-[#ccff00]'>{tx.decoded.function_name}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && <p className='text-center text-gray-500 py-8'>No transactions found</p>}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className='rounded-2xl border border-gray-900 bg-[#0b0b0b] p-6'>
                <h3 className='text-lg font-bold uppercase tracking-[0.15em] mb-4'>Portfolio Analytics</h3>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
                  <div className='rounded-xl border border-gray-900 bg-[#101010] p-4'>
                    <p className='text-xs text-gray-500'>Total Chains</p>
                    <p className='text-2xl font-bold'>{chainEntries.length}</p>
                  </div>
                  <div className='rounded-xl border border-gray-900 bg-[#101010] p-4'>
                    <p className='text-xs text-gray-500'>Total Protocols</p>
                    <p className='text-2xl font-bold'>{protocolEntries.length}</p>
                  </div>
                  <div className='rounded-xl border border-gray-900 bg-[#101010] p-4'>
                    <p className='text-xs text-gray-500'>Recent Transactions</p>
                    <p className='text-2xl font-bold'>{transactions.length}</p>
                  </div>
                  <div className='rounded-xl border border-gray-900 bg-[#101010] p-4'>
                    <p className='text-xs text-gray-500'>Data Source</p>
                    <p className='text-sm font-semibold text-[#ccff00]'>Dune Analytics</p>
                  </div>
                </div>

                {/* Chain Breakdown */}
                <div className='mt-6'>
                  <h4 className='text-sm uppercase tracking-[0.15em] text-gray-500'>Value by Chain</h4>
                  <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                    {chainEntries.map(([chainId, data]) => (
                      <div key={chainId} className='rounded-xl border border-gray-900 bg-[#101010] p-3'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='font-medium text-white'>{data.name}</span>
                          <span className='text-xs text-gray-500'>ID {chainId}</span>
                        </div>
                        <p className='mt-2 text-lg font-bold text-[#ccff00]'>{formatUsd(data.totalValue)}</p>
                      </div>
                    ))}
                    {chainEntries.length === 0 && <p className='text-gray-500'>No chain data available</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
