'use client';

import type { DuneBalance, DuneDefiPosition, DuneTransaction } from '@/lib/dune-api';
import { TokenAAVE, TokenARB, TokenAVAX, TokenBNB, TokenBTC, TokenCOMP, TokenCRV, TokenDAI, TokenETH, TokenGMX, TokenLINK, TokenMATIC, TokenOP, TokenUNI, TokenUSDC, TokenUSDT, TokenWBTC } from '@web3icons/react';
import { AlertCircle, ExternalLink, Search, TrendingUp } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import Navbar from '../../components/navbar';

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
    totalValue: 53369.87,
    totalPnL: 4821.34,
    totalPnLPercent: 9.93,
    dayChange: 542.18,
    dayChangePercent: 1.02,
    weekChange: 1240.55,
    weekChangePercent: 2.38,
    monthChange: 2847.92,
    monthChangePercent: 5.63,
    yearChange: 8234.56,
    yearChangePercent: 18.24,
    allTimeHigh: 67842.34,
    allTimeLow: 12456.78,
    nftValue: 164793.32,
    protocolValue: 30747.87,
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

  // Dummy variable to resolve undeclared variable error
  const protocolPositions = protocolsFromExisting;

  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />

      <main className='container mx-auto px-4 py-8 max-w-[1400px]'>
        {/* Search Section */}
        <div className='mb-8'>
          <div className='flex gap-4 items-center'>
            <div className='flex-1 relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='text'
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Search wallet address (0x...)'
                className='w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-none pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors' />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchAddress.trim()}
              className='px-6 py-3 bg-[#ccff00] text-black font-bold rounded-none hover:bg-[#b8e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <p className='text-sm text-gray-400 mt-2'>
            Currently viewing: <span className='text-[#ccff00] font-mono'>{currentAddress ?? 'None'}</span>
          </p>
        </div>

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

        {/* Main Content */}
        {!isLoading && !error && (
          <>
            {/* Portfolio Value Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6'>
                <p className='text-gray-400 text-sm mb-2'>Total Portfolio Value</p>
                <p className='text-3xl font-bold mb-2'>
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className='flex items-center gap-2 text-sm'>
                  <TrendingUp className='text-[#ccff00]' size={16} />
                  <span className='text-[#ccff00]'>Real-time data via Dune Analytics</span>
                </div>
              </div>

              <div className='bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6'>
                <p className='text-gray-400 text-sm mb-2'>Total Tokens</p>
                <p className='text-3xl font-bold mb-2'>{balances.length}</p>
                <p className='text-sm text-gray-400'>Across {Object.keys(balancesByChain).length} chains</p>
              </div>

              <div className='bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6'>
                <p className='text-gray-400 text-sm mb-2'>DeFi Positions</p>
                <p className='text-3xl font-bold mb-2'>{defiPositions.length}</p>
                <p className='text-sm text-gray-400'>Active protocol positions</p>
              </div>
            </div>

            {/* Tabs */}
            <div className='flex gap-2 mb-6 overflow-x-auto'>
              {(['overview', 'tokens', 'protocols', 'transactions', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-[#ccff00] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'
                  }`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className='space-y-6'>
                {/* Top Holdings */}
                <div className='bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6'>
                  <h3 className='text-xl font-bold mb-4'>Top Holdings</h3>
                  <div className='space-y-3'>
                    {balances.sort((a, b) => b.value_usd - a.value_usd).slice(0, 5).map((balance, index) => (
                      <div
                        key={`${balance.chain_id}-${balance.address}-${index}`}
                        className='flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors'>
                        <div className='flex items-center gap-4'>
                          <div className='w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center'>
                            {getTokenIcon(balance.symbol)}
                          </div>
                          <div>
                            <p className='font-semibold'>{balance.symbol}</p>
                            <p className='text-sm text-gray-400'>{balance.name}</p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='font-semibold'>
                            $
                            {balance.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className='text-sm text-gray-400'>
                            {(Number.parseFloat(balance.amount) / Math.pow(10, balance.decimals)).toFixed(4)} {balance.symbol}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Protocols */}
                {protocolEntries.length > 0 && (
                  <div className='bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6'>
                    <h3 className='text-xl font-bold mb-4'>Top Protocols</h3>
                    <div className='space-y-3'>
                      {protocolEntries.sort(([, a], [, b]) => b.totalValue - a.totalValue).slice(0, 5).map(([protocol, data]) => (
                        <div
                          key={protocol}
                          className='flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]'>
                          <div>
                            <p className='font-semibold'>{protocol}</p>
                            <p className='text-sm text-gray-400'>{data.positions.length} positions</p>
                          </div>
                          <p className='font-semibold text-[#ccff00]'>
                            $
                            {data.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tokens' && (
              <div className='bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6'>
                <h3 className='text-xl font-bold mb-4'>Token Holdings</h3>
                <div className='space-y-3'>
                  {balances.map((balance, index) => (
                    <div
                      key={`${balance.chain_id}-${balance.address}-${index}`}
                      className='flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors'>
                      <div className='flex items-center gap-4 flex-1'>
                        <div className='w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center'>
                          {getTokenIcon(balance.symbol)}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <p className='font-semibold'>{balance.symbol}</p>
                            <span className='text-xs px-2 py-0.5 bg-[#2a2a2a] rounded-full text-gray-400'>{balance.chain}</span>
                            {balance.low_liquidity && (
                              <span className='text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full'>Low Liquidity</span>
                            )}
                          </div>
                          <p className='text-sm text-gray-400'>{balance.name}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold'>
                          $
                          {balance.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className='text-sm text-gray-400'>
                          {(Number.parseFloat(balance.amount) / Math.pow(10, balance.decimals)).toFixed(6)} {balance.symbol}
                        </p>
                        <p className='text-xs text-gray-500'>${balance.price_usd.toFixed(6)} per token</p>
                      </div>
                    </div>
                  ))}
                  {balances.length === 0 && <p className='text-center text-gray-400 py-8'>No token holdings found</p>}
                </div>
              </div>
            )}

            {activeTab === 'protocols' && (
              <div className='bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6'>
                <h3 className='text-xl font-bold mb-4'>DeFi Protocol Positions</h3>
                <div className='space-y-4'>
                  {defiPositions.map((position, index) => (
                    <div
                      key={`${position.protocol}-${position.chain_id}-${index}`}
                      className='p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors'>
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center'>
                            {getTokenIcon(position.protocol)}
                          </div>
                          <div>
                            <p className='font-semibold'>{position.protocol}</p>
                            <p className='text-sm text-gray-400'>{position.type}</p>
                          </div>
                        </div>
                        <p className='text-lg font-bold text-[#ccff00]'>
                          $
                          {position.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>

                      {position.token0_symbol && position.token1_symbol && (
                        <div className='mt-3 pt-3 border-t border-[#2a2a2a]'>
                          <p className='text-sm text-gray-400 mb-2'>Pool Tokens:</p>
                          <div className='flex gap-4'>
                            <div className='flex-1'>
                              <p className='text-sm font-semibold'>{position.token0_symbol}</p>
                              <p className='text-xs text-gray-400'>{position.token0_name}</p>
                            </div>
                            <div className='flex-1'>
                              <p className='text-sm font-semibold'>{position.token1_symbol}</p>
                              <p className='text-xs text-gray-400'>{position.token1_name}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {position.supply_quote && (
                        <div className='mt-3 pt-3 border-t border-[#2a2a2a]'>
                          <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-400'>Supplied:</p>
                            <p className='text-sm font-semibold text-green-500'>
                              $
                              {position.supply_quote.usd_value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {position.debt_quote && (
                        <div className='mt-2'>
                          <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-400'>Borrowed:</p>
                            <p className='text-sm font-semibold text-red-500'>
                              $
                              {position.debt_quote.usd_value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {defiPositions.length === 0 && <p className='text-center text-gray-400 py-8'>No DeFi positions found</p>}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className='bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6'>
                <h3 className='text-xl font-bold mb-4'>Recent Transactions</h3>
                <div className='space-y-3'>
                  {transactions.map((tx, index) => (
                    <div
                      key={`${tx.hash}-${index}`}
                      className='p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-3'>
                          <div className={`w-2 h-2 rounded-full ${tx.status === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className='font-mono text-sm'>{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</p>
                            <p className='text-xs text-gray-400'>{new Date(tx.block_timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-[#ccff00] hover:underline flex items-center gap-1'>
                          <span className='text-sm'>View</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-400'>Chain: {tx.chain}</span>
                        <span className='text-gray-400'>Gas: {(Number.parseFloat(tx.transaction_fee) / 1e18).toFixed(6)} ETH</span>
                      </div>
                      {tx.decoded && (
                        <div className='mt-2 pt-2 border-t border-[#2a2a2a]'>
                          <p className='text-xs text-gray-400'>Function:</p>
                          <p className='text-sm font-mono text-[#ccff00]'>{tx.decoded.function_name}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {transactions.length === 0 && <p className='text-center text-gray-400 py-8'>No transactions found</p>}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className='bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6'>
                <h3 className='text-xl font-bold mb-4'>Portfolio Analytics</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]'>
                    <p className='text-sm text-gray-400 mb-2'>Total Chains</p>
                    <p className='text-2xl font-bold'>{chainEntries.length}</p>
                  </div>
                  <div className='p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]'>
                    <p className='text-sm text-gray-400 mb-2'>Total Protocols</p>
                    <p className='text-2xl font-bold'>{protocolEntries.length}</p>
                  </div>
                  <div className='p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]'>
                    <p className='text-sm text-gray-400 mb-2'>Recent Transactions</p>
                    <p className='text-2xl font-bold'>{transactions.length}</p>
                  </div>
                  <div className='p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]'>
                    <p className='text-sm text-gray-400 mb-2'>Data Source</p>
                    <p className='text-sm font-semibold text-[#ccff00]'>Dune Analytics</p>
                  </div>
                </div>

                {/* Chain Breakdown */}
                <div className='mt-6'>
                  <h4 className='text-lg font-semibold mb-3'>Value by Chain</h4>
                  <div className='space-y-3'>
                    {chainEntries.map(([chainId, data]) => (
                      <div key={chainId} className='flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]'>
                        <span className='font-medium'>{data.name}</span>
                        <span className='text-[#ccff00] font-semibold'>
                          $
                          {data.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
