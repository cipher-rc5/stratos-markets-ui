// file: app/portfolio/page.tsx
// description: DeFi portfolio dashboard with live search, history, and multi-tab analytics
// reference: lib/dune-api.ts, app/api/portfolio/[address]/route.ts

'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DuneBalance, DuneDefiPosition, DuneTransaction } from '@/lib/dune-api';
import {
  TokenAAVE,
  TokenAVAX,
  TokenBNB,
  TokenBTC,
  TokenCOMP,
  TokenCRV,
  TokenETH,
  TokenGMX,
  TokenLINK,
  TokenMATIC,
  TokenOP,
  TokenUNI,
  TokenUSDC,
  TokenWBTC,
  NetworkArbitrumOne
} from '@web3icons/react';
import {
  Activity,
  AlertCircle,
  ArrowRightLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  History as HistoryIcon,
  ImageIcon,
  Layers,
  Loader2,
  Search,
  Shield,
  TrendingUp,
  Wallet,
  X
} from 'lucide-react';
import type { JSX, MouseEvent } from 'react';

// Fallback icon for symbols without a dedicated Web3Icon
const TokenLogo = ({
  symbol,
  size = 24,
  className
}: {
  symbol: string;
  size?: number;
  className?: string;
}) => {
  const colors: Record<string, string> = {
    ETH: 'bg-blue-600',
    WETH: 'bg-blue-600',
    USDC: 'bg-blue-500',
    AVAX: 'bg-red-600',
    ARB: 'bg-blue-400',
    OP: 'bg-red-500',
    BTC: 'bg-orange-500',
    WBTC: 'bg-orange-500',
    AAVE: 'bg-purple-500',
    UNI: 'bg-pink-500',
    LINK: 'bg-blue-700',
    MATIC: 'bg-purple-600',
    BNB: 'bg-yellow-500',
    DAI: 'bg-yellow-600',
    USDT: 'bg-green-500'
  };
  const bgColor = colors[symbol?.toUpperCase()] || 'bg-gray-800';

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold font-mono ${bgColor} ${className ?? ''}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {symbol ? symbol.slice(0, 1).toUpperCase() : '?'}
    </div>
  );
};

type IconRenderer = (props: { size?: number; className?: string }) => JSX.Element;

type TokenItem = {
  symbol: string;
  name: string;
  chain: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  allocation: number;
  IconComponent: IconRenderer;
};

type NftItem = {
  collection: string;
  tokenId: string;
  chain: string;
  value?: number;
  image: string | null;
};

type ProtocolPosition = {
  asset: string;
  type: string;
  value: number;
  apy: number;
};

type ProtocolItem = {
  name: string;
  chain: string;
  type: string;
  supplied?: number;
  liquidity?: number;
  fees24h?: number;
  IconComponent: IconRenderer;
  positions: ProtocolPosition[];
};

type TransactionItem = {
  type: string;
  from: string;
  to: string;
  fromAmount: number;
  chain: string;
  time: string;
  hash: string;
  status: 'confirmed' | 'failed';
  gas: number;
  fromIcon: IconRenderer;
  toIcon: IconRenderer;
};

// --- CONFIGURATION ---
const web3IconMap: Record<string, typeof TokenETH> = {
  ETH: TokenETH,
  WETH: TokenETH,
  BTC: TokenBTC,
  WBTC: TokenWBTC,
  USDC: TokenUSDC,
  USDT: TokenUSDC,
  OP: TokenOP,
  ARB: NetworkArbitrumOne,
  MATIC: TokenMATIC,
  AVAX: TokenAVAX,
  BNB: TokenBNB,
  AAVE: TokenAAVE,
  UNI: TokenUNI,
  LINK: TokenLINK,
  GMX: TokenGMX,
  CRV: TokenCRV,
  COMP: TokenCOMP
};

const getIconForSymbol = (symbol: string): IconRenderer => {
  const IconComponent = web3IconMap[symbol?.toUpperCase()];
  if (IconComponent) {
    return ({ size = 24, className }) => (
      <IconComponent size={size} className={className} variant='branded' />
    );
  }
  return (props: { size?: number; className?: string }) => <TokenLogo symbol={symbol} {...props} />;
};

const PortfolioPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'nfts' | 'protocols' | 'transactions'>('overview');
  const [searchAddress, setSearchAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<DuneBalance[]>([]);
  const [transactionsRaw, setTransactionsRaw] = useState<DuneTransaction[]>([]);
  const [defiPositions, setDefiPositions] = useState<DuneDefiPosition[]>([]);

  const nftData: NftItem[] = [];

  // --- INITIALIZATION ---
  useEffect(() => {
    const saved = localStorage.getItem('dune_portfolio_recent');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    if (currentAddress) {
      performSearch(currentAddress, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAddress]);

  const addToHistory = (address: string) => {
    const normalized = address.toLowerCase();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== normalized);
      const updated = [address, ...filtered].slice(0, 5);
      localStorage.setItem('dune_portfolio_recent', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('dune_portfolio_recent');
  };

  const performSearch = async (address: string, isInitial = false) => {
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/portfolio/${address}`);
      if (!response.ok) {
        const details = await response.text().catch(() => '');
        setBalances([]);
        setTransactionsRaw([]);
        setDefiPositions([]);
        setError(details || 'Failed to fetch portfolio data.');
        return;
      }

      const data = await response.json();
      setBalances(data.balances ?? []);
      setTransactionsRaw(data.transactions ?? []);
      setDefiPositions(data.defiPositions ?? []);
      if (!isInitial) addToHistory(address);
    } catch (err) {
      console.error('Failed to fetch Dune data', err);
      setError('Network connection failed.');
      setBalances([]);
      setTransactionsRaw([]);
      setDefiPositions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!searchAddress.trim()) return;
    if (!searchAddress.startsWith('0x')) {
      alert('Please enter a valid EVM address starting with 0x');
      return;
    }
    setCurrentAddress(searchAddress);
  };

  const tokenData: TokenItem[] = useMemo(() => {
    const mapped = balances
      .filter((balance) => balance.value_usd > 0)
      .map((balance) => {
        const amount = Number.parseFloat(balance.amount) / Math.pow(10, balance.decimals || 0);
        return {
          symbol: balance.symbol,
          name: balance.name,
          chain: balance.chain,
          balance: amount,
          price: balance.price_usd,
          value: balance.value_usd,
          change24h: 0,
          allocation: 0,
          IconComponent: getIconForSymbol(balance.symbol)
        };
      })
      .sort((a, b) => b.value - a.value);

    const total = mapped.reduce((acc, token) => acc + token.value, 0);
    return mapped.map((token) => ({
      ...token,
      allocation: total > 0 ? (token.value / total) * 100 : 0
    }));
  }, [balances]);

  const protocolData: ProtocolItem[] = useMemo(() => {
    return defiPositions.map((position) => ({
      name: position.protocol,
      chain: position.chain_id?.toString() ?? 'multi-chain',
      type: position.type ?? 'protocol',
      supplied: position.supply_quote?.usd_value,
      liquidity: position.usd_value,
      fees24h: undefined,
      IconComponent: getIconForSymbol(position.token_symbol ?? position.protocol),
      positions: [
        {
          asset: position.token_symbol ?? position.protocol,
          type: position.type ?? 'Position',
          value: position.usd_value ?? 0,
          apy: 0
        }
      ]
    }));
  }, [defiPositions]);

  const txData: TransactionItem[] = useMemo(
    () =>
      transactionsRaw.map((tx) => ({
        type: tx.decoded?.function_name ?? 'Transaction',
        from: tx.from_address === currentAddress ? 'Me' : tx.from_address?.substring(0, 6) ?? '-',
        to: tx.to_address?.substring(0, 6) ?? '-',
        fromAmount: tx.value ? Number.parseFloat(tx.value) / 1e18 : 0,
        chain: tx.chain ?? 'ethereum',
        time: tx.block_timestamp ? new Date(tx.block_timestamp).toLocaleDateString() : '',
        hash: tx.hash,
        status: tx.status === 1 ? 'confirmed' : 'failed',
        gas: Number.parseFloat(tx.transaction_fee ?? '0') / 1e18,
        fromIcon: getIconForSymbol('ETH'),
        toIcon: getIconForSymbol('USDC')
      })),
    [currentAddress, transactionsRaw]
  );

  const filteredTokens = useMemo(
    () =>
      selectedChain === 'all'
        ? tokenData
        : tokenData.filter((token) => token.chain.toLowerCase() === selectedChain.toLowerCase()),
    [selectedChain, tokenData]
  );

  const totalValue = useMemo(
    () =>
      tokenData.reduce((acc, token) => acc + token.value, 0) +
      protocolData.reduce((acc, protocol) => acc + (protocol.liquidity ?? protocol.supplied ?? 0), 0),
    [protocolData, tokenData]
  );

  const performanceData = useMemo(
    () => ({
      totalValue,
      totalPnL: 0,
      totalPnLPercent: 0,
      dayChange: 0,
      nftValue: 0,
      activeProtocols: protocolData.length
    }),
    [protocolData.length, totalValue]
  );

  const topAllocation = tokenData.length ? Math.max(...tokenData.map((token) => token.allocation)) : 0;
  const chainCount = new Set(tokenData.map((token) => token.chain)).size;
  const diversificationScore = Math.min(10, chainCount * 2 || 0);
  const portfolioHealth = Math.min(10, Math.max(1, diversificationScore + Math.min(protocolData.length, 5)));
  const exposureRisk = topAllocation > 50 ? 'High' : topAllocation > 25 ? 'Medium' : 'Low';
  const liquidationRisk = defiPositions.length > 0 ? 'Review' : 'Low';

  const riskMetrics = {
    portfolioHealth,
    diversificationScore,
    exposureRisk,
    liquidationRisk
  };

  const headingFontClass = 'font-[var(--font-orbitron)]';
  const bodyFontClass = 'font-[var(--font-sans)]';
  const numericFontClass = 'font-[var(--font-sans)]';

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-[#ccff00] selection:text-black p-6 md:p-12 ${bodyFontClass}`}>
      <div className='max-w-[1920px] mx-auto'>
        {/* Header & Search Section */}
        <div className='mb-12'>
          <div className='flex items-center justify-between flex-wrap gap-4 mb-8'>
            <div>
              <div className='inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-4 animate-pulse'>
                ● DUNE ECHO API: LIVE
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold mb-2 tracking-tight ${headingFontClass}`}>
                DeFi <span className='text-[#ccff00]'>Portfolio</span>
              </h1>
              <p className='text-gray-400 text-lg'>Real-time multi-chain portfolio tracking</p>
            </div>
          </div>

          <div className='max-w-2xl'>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
              className='relative group mb-3'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-gray-500 group-focus-within:text-[#ccff00] transition-colors' />
              </div>
              <input
                type='text'
                value={searchAddress}
                onChange={(event) => setSearchAddress(event.target.value)}
                placeholder='Search EVM wallet address (0x...)'
                className='w-full bg-gray-900 border border-gray-800 focus:border-[#ccff00] pl-12 pr-32 py-4 text-sm focus:outline-none transition-all rounded-sm placeholder:text-gray-600 font-mono text-white'
              />
              <button
                type='submit'
                disabled={isSearching}
                className='absolute inset-y-2 right-2 px-6 bg-[#ccff00] text-black font-bold text-sm hover:bg-[#b3e600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-sm'>
                {isSearching ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Syncing
                  </>
                ) : (
                  <>
                    <Wallet className='w-4 h-4' />
                    Track
                  </>
                )}
              </button>
            </form>

            {recentSearches.length > 0 && (
              <div className='flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300'>
                <div className='flex items-center gap-1 text-xs text-gray-500 mr-1'>
                  <HistoryIcon className='w-3 h-3' />
                  <span>Recent:</span>
                </div>
                {recentSearches.map((addr) => (
                  <button
                    key={addr}
                    onClick={() => {
                      setSearchAddress(addr);
                      setCurrentAddress(addr);
                    }}
                    className='group flex items-center gap-1 px-3 py-1 bg-[#ccff00]/5 border border-[#ccff00]/20 hover:bg-[#ccff00]/20 text-[#ccff00] text-xs font-mono rounded-sm transition-all'>
                    {addr.substring(0, 6)}...{addr.substring(addr.length - 4)}
                  </button>
                ))}
                <button
                  onClick={clearHistory}
                  className='p-1 hover:text-red-400 text-gray-600 transition-colors ml-auto'
                  title='Clear History'>
                  <X className='w-3 h-3' />
                </button>
              </div>
            )}

            {error && (
              <div className='mt-4 text-sm text-red-400 flex items-center gap-2 bg-red-900/10 p-3 border border-red-900/50 rounded-sm'>
                <AlertCircle className='w-4 h-4' />
                {error}
              </div>
            )}

            {currentAddress && !error && (
              <div className={`mt-4 text-sm text-gray-500 flex items-center gap-2 ${numericFontClass}`}>
                <CheckCircle className='w-4 h-4 text-[#ccff00]' />
                Viewing wallet: <span className='text-white font-mono'>{currentAddress}</span>
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-500 uppercase tracking-wider font-bold'>Net Worth</div>
              <DollarSign className='w-5 h-5 text-gray-700 group-hover:text-[#ccff00] transition-colors' />
            </div>
            <div className='text-3xl font-bold text-white mb-3 tracking-tight'>
              ${(performanceData.totalValue + performanceData.nftValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <TrendingUp className='w-4 h-4 text-[#ccff00]' />
              <span className='text-[#ccff00] font-medium'>+${performanceData.dayChange.toLocaleString()}</span>
            </div>
          </div>

          <div className='bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-500 uppercase tracking-wider font-bold'>Est. P&L</div>
              <Activity className='w-5 h-5 text-gray-700 group-hover:text-[#ccff00] transition-colors' />
            </div>
            <div className='text-3xl font-bold text-[#ccff00] mb-3 tracking-tight'>
              +${performanceData.totalPnL.toLocaleString()}
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-[#ccff00] font-medium'>+{performanceData.totalPnLPercent}%</span>
              <span className='text-gray-600'>All-time</span>
            </div>
          </div>

          <div className='bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-500 uppercase tracking-wider font-bold'>DeFi Positions</div>
              <Layers className='w-5 h-5 text-gray-700 group-hover:text-[#ccff00] transition-colors' />
            </div>
            <div className='text-3xl font-bold text-white mb-3 tracking-tight'>
              {performanceData.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-gray-400'>{tokenData.length} Tokens</span>
              <span className='text-gray-600'>•</span>
              <span className='text-gray-400'>{performanceData.activeProtocols} Protocols</span>
            </div>
          </div>

          <div className='bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-500 uppercase tracking-wider font-bold'>NFT Value</div>
              <ImageIcon className='w-5 h-5 text-gray-700 group-hover:text-[#ccff00] transition-colors' />
            </div>
            <div className='text-3xl font-bold text-white mb-3 tracking-tight'>${performanceData.nftValue.toLocaleString()}</div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-gray-400'>{nftData.length} Collectibles</span>
            </div>
          </div>
        </div>

        <div className='bg-black border border-gray-800 p-6 mb-8'>
          <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${headingFontClass}`}>
            <Shield className='w-5 h-5 text-[#ccff00]' />
            Risk & Health Metrics
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            <div>
              <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-2'>Portfolio Health</div>
              <div className='text-2xl font-bold text-[#ccff00]'>{riskMetrics.portfolioHealth}/10</div>
              <div className='w-full h-1 bg-gray-900 mt-2 overflow-hidden'>
                <div className='h-full bg-[#ccff00]' style={{ width: `${riskMetrics.portfolioHealth * 10}%` }} />
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-2'>Diversification</div>
              <div className='text-2xl font-bold text-blue-400'>{riskMetrics.diversificationScore}/10</div>
            </div>
            <div>
              <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-2'>Exposure Risk</div>
              <div className='text-2xl font-bold text-yellow-400'>{riskMetrics.exposureRisk}</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-800'>
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'tokens', label: 'Tokens' },
              { id: 'nfts', label: 'NFTs' },
              { id: 'protocols', label: 'Protocols' },
              { id: 'transactions', label: 'Transactions' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap border-b-2 -mb-[2px] ${headingFontClass} ${
                activeTab === tab.id
                  ? 'border-[#ccff00] text-white'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tokens' && (
          <div className='bg-black border border-gray-800'>
            <div className='p-6 border-b border-gray-800 flex justify-between items-center'>
              <h2 className={`text-xl font-bold ${headingFontClass}`}>Token Holdings</h2>
              <select
                value={selectedChain}
                onChange={(event) => setSelectedChain(event.target.value)}
                className='bg-gray-900 border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-[#ccff00]/50 text-gray-400'>
                <option value='all'>All Chains</option>
                <option value='ethereum'>Ethereum</option>
                <option value='optimism'>Optimism</option>
              </select>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-800 bg-gray-950/50'>
                    <th className='text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold'>Token</th>
                    <th className='text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold'>Chain</th>
                    <th className='text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold'>Balance</th>
                    <th className='text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold'>Value</th>
                    <th className='text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold'>Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.map((token, idx) => (
                    <tr key={idx} className='border-b border-gray-900 hover:bg-gray-950/50 transition-colors group'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 group-hover:bg-[#ccff00]/20 transition-colors'>
                            <token.IconComponent size={20} className='text-gray-400 group-hover:text-[#ccff00]' />
                          </div>
                          <div>
                            <div className='text-sm font-bold'>{token.symbol}</div>
                            <div className='text-xs text-gray-600'>{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className='p-4 text-sm text-gray-400 capitalize'>{token.chain}</td>
                      <td className={`p-4 text-sm text-right font-mono text-white ${numericFontClass}`}>
                        {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>
                      <td className={`p-4 text-sm text-right font-mono text-white font-bold ${numericFontClass}`}>
                        ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className='p-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <div className='w-20 h-1 bg-gray-900 overflow-hidden'>
                            <div className='h-full bg-[#ccff00]' style={{ width: `${Math.min(token.allocation, 100)}%` }} />
                          </div>
                          <span className={`text-xs text-gray-500 w-10 text-right ${numericFontClass}`}>{token.allocation.toFixed(2)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTokens.length === 0 && (
                    <tr>
                      <td colSpan={5} className='p-8 text-center text-gray-500'>
                        No tokens found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className='bg-black border border-gray-800 p-6'>
            <h2 className={`text-xl font-bold mb-6 ${headingFontClass}`}>NFT Collection</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {nftData.map((nft, idx) => (
                <div key={idx} className='bg-gray-900/50 border border-gray-800 hover:border-[#ccff00]/30 transition-all group'>
                  <div className='aspect-square relative overflow-hidden bg-gray-800 flex items-center justify-center'>
                    {nft.image ? (
                      <img src={nft.image} alt='' className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' />
                    ) : (
                      <ImageIcon className='w-12 h-12 text-gray-700' />
                    )}
                    <div className='absolute top-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono border border-gray-700'>{nft.tokenId}</div>
                  </div>
                  <div className='p-4'>
                    <div className='text-sm font-bold mb-1 truncate'>{nft.collection}</div>
                    <div className='text-xs text-gray-600 capitalize'>{nft.chain}</div>
                  </div>
                </div>
              ))}
              {nftData.length === 0 && <div className='text-gray-500'>No NFTs found.</div>}
            </div>
          </div>
        )}

        {activeTab === 'protocols' && (
          <div className='space-y-6'>
            {protocolData.map((protocol, idx) => (
              <div key={idx} className='bg-black border border-gray-800'>
                <div className='p-6 border-b border-gray-800 flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gray-900 flex items-center justify-center border border-gray-800'>
                      <protocol.IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${headingFontClass}`}>{protocol.name}</h3>
                      <div className='flex items-center gap-3 mt-1'>
                        <span className='text-xs text-gray-500'>{protocol.chain}</span>
                        <span className='text-xs text-gray-700'>•</span>
                        <span className='text-xs text-gray-500'>{protocol.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold'>
                      ${(protocol.liquidity ?? protocol.supplied ?? 0).toLocaleString()}
                    </div>
                    <div className='text-sm text-[#ccff00] mt-1'>
                      +${(protocol.fees24h ?? 0).toLocaleString()} earned
                    </div>
                  </div>
                </div>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-gray-900 bg-gray-950/50'>
                        <th className='text-left p-4 text-xs text-gray-500 uppercase'>Asset</th>
                        <th className='text-left p-4 text-xs text-gray-500 uppercase'>Type</th>
                        <th className='text-right p-4 text-xs text-gray-500 uppercase'>Value</th>
                        <th className='text-right p-4 text-xs text-gray-500 uppercase'>APY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {protocol.positions.map((position, posIdx) => (
                        <tr key={posIdx} className='border-b border-gray-900 hover:bg-gray-950/50 transition-colors'>
                          <td className='p-4 text-sm font-medium'>{position.asset}</td>
                          <td className='p-4'>
                            <span className='text-xs px-2 py-1 bg-gray-900 text-gray-400 border border-gray-800'>
                              {position.type}
                            </span>
                          </td>
                          <td className={`p-4 text-sm text-right font-mono text-white font-bold ${numericFontClass}`}>
                            ${(position.value ?? 0).toLocaleString()}
                          </td>
                          <td className={`p-4 text-sm text-right font-bold text-[#ccff00] ${numericFontClass}`}>
                            {position.apy}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className='bg-black border border-gray-800'>
            <div className='p-6 border-b border-gray-800'>
              <h2 className={`text-xl font-bold ${headingFontClass}`}>History</h2>
            </div>
            <div className='divide-y divide-gray-900'>
              {txData.map((tx, idx) => (
                <div key={idx} className='p-6 hover:bg-gray-950/50 transition-colors'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4 flex-1'>
                      <div className='w-8 h-8 flex items-center justify-center bg-gray-900 rounded-full'>
                        <ArrowRightLeft className='w-4 h-4 text-gray-500' />
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-1'>
                          <span className='text-sm font-bold capitalize'>{tx.type.replace(/_/g, ' ')}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              tx.status === 'confirmed' ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'bg-red-500/10 text-red-500'
                            }`}>
                            {tx.status}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-xs text-gray-500'>
                          <span className='uppercase'>{tx.chain}</span>
                          <span>•</span>
                          <span className='flex items-center gap-1'>
                            <Clock className='w-3 h-3' /> {tx.time}
                          </span>
                          <span>•</span>
                          <span className={numericFontClass}>Gas: ${tx.gas.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-right mr-4 ${numericFontClass}`}>
                      <div className='text-sm font-bold mb-1 font-mono'>{tx.fromAmount > 0 ? tx.fromAmount.toFixed(4) : ''} ETH</div>
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-600 hover:text-[#ccff00]'>
                      <ExternalLink className='w-4 h-4' />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className='space-y-8'>
            <div className='bg-black border border-gray-800'>
              <div className='p-6 border-b border-gray-800 flex items-center justify-between'>
                <h2 className={`text-xl font-bold ${headingFontClass}`}>Top Holdings</h2>
                <button
                  onClick={() => setActiveTab('tokens')}
                  className='text-sm text-[#ccff00] hover:text-[#b3e600] flex items-center gap-1'>
                  View All <ChevronRight className='w-4 h-4' />
                </button>
              </div>
              <div className='p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {tokenData.slice(0, 5).map((token, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-3 hover:bg-gray-900/30 rounded-lg transition-colors border border-transparent hover:border-gray-800'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-900'>
                        <token.IconComponent size={20} />
                      </div>
                      <div>
                        <div className='text-sm font-bold'>{token.symbol}</div>
                        <div className='text-xs text-gray-600'>{token.name}</div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-bold text-white'>
                        ${token.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <div className='text-xs text-gray-500'>{token.balance.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
