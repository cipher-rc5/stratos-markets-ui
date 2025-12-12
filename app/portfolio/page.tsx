'use client';

import Navbar from '@/components/navbar';
import type { DuneBalance, DuneDefiPosition, DuneTransaction } from '@/lib/dune-api';
import { TokenAAVE, TokenARB, TokenAVAX, TokenBNB, TokenBTC, TokenCOMP, TokenCRV, TokenDAI, TokenETH, TokenGMX, TokenLINK, TokenMATIC, TokenOP, TokenUNI, TokenUSDC, TokenUSDT, TokenWBTC } from '@web3icons/react';
import { NetworkArbitrumOne, NetworkAvalanche, NetworkBase, NetworkBinanceSmartChain, NetworkCelo, NetworkEthereum, NetworkOptimism, NetworkPolygon } from '@web3icons/react';
import { Activity, AlertCircle, ArrowRightLeft, CheckCircle, ChevronRight, DollarSign, ExternalLink, HistoryIcon, ImageIcon, Layers, Loader2, Search, Shield, TrendingUp, Wallet, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { JSX, MouseEvent } from 'react';

const TokenLogo = ({ symbol, size = 24, className }: { symbol: string, size?: number, className?: string }) => {
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
      className={`rounded-none flex items-center justify-center text-white font-bold font-mono ${bgColor} ${className ?? ''}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {symbol ? symbol.slice(0, 1).toUpperCase() : '?'}
    </div>
  );
};

const NetworkIcon = ({ chain, size = 20 }: { chain: string | number, size?: number }) => {
  const chainStr = typeof chain === 'number' ? chain.toString() : chain.toLowerCase();

  const networkMap: Record<string, typeof NetworkEthereum> = {
    '1': NetworkEthereum,
    eth: NetworkEthereum,
    ethereum: NetworkEthereum,
    mainnet: NetworkEthereum,
    '10': NetworkOptimism,
    op: NetworkOptimism,
    optimism: NetworkOptimism,
    '42161': NetworkArbitrumOne,
    arb: NetworkArbitrumOne,
    arbitrum: NetworkArbitrumOne,
    '137': NetworkPolygon,
    matic: NetworkPolygon,
    polygon: NetworkPolygon,
    '43114': NetworkAvalanche,
    avax: NetworkAvalanche,
    avalanche: NetworkAvalanche,
    '56': NetworkBinanceSmartChain,
    bsc: NetworkBinanceSmartChain,
    bnb: NetworkBinanceSmartChain,
    '8453': NetworkBase,
    base: NetworkBase,
    '42220': NetworkCelo,
    celo: NetworkCelo
  };

  const NetworkComponent = networkMap[chainStr];

  if (NetworkComponent) {
    return <NetworkComponent size={size} variant='branded' />;
  }

  // Fallback for unknown chains
  return (
    <div
      className='rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold'
      style={{ width: size, height: size, fontSize: size * 0.5 }}>
      ?
    </div>
  );
};

type IconRenderer = (props: { size?: number, className?: string }) => JSX.Element;

type TokenItem = {
  symbol: string,
  name: string,
  chain: string,
  balance: number,
  price: number,
  value: number,
  change24h: number,
  allocation: number,
  IconComponent: IconRenderer
};

type NftItem = { collection: string, tokenId: string, chain: string, value?: number, image: string | null };

type ProtocolPosition = { asset: string, type: string, value: number, apy: number };

type ProtocolItem = {
  name: string,
  chain: string,
  type: string,
  supplied?: number,
  liquidity?: number,
  fees24h?: number,
  IconComponent: IconRenderer,
  positions: ProtocolPosition[]
};

type TransactionItem = {
  type: string,
  from: string,
  to: string,
  fromAmount: number,
  chain: string,
  time: string,
  hash: string,
  status: 'confirmed' | 'failed',
  gas: number,
  fromIcon: IconRenderer,
  toIcon: IconRenderer
};

// --- CONFIGURATION ---
const web3IconMap: Record<string, typeof TokenETH> = {
  ETH: TokenETH,
  WETH: TokenETH,
  BTC: TokenBTC,
  WBTC: TokenWBTC,
  USDC: TokenUSDC,
  USDT: TokenUSDT,
  DAI: TokenDAI,
  OP: TokenOP,
  ARB: TokenARB,
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
    return ({ size = 24, className }) => <IconComponent size={size} className={className} variant='branded' />;
  }
  return (props: { size?: number, className?: string }) => <TokenLogo symbol={symbol} {...props} />;
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
      console.log('[v0] API Request: /api/portfolio/' + address);
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
      console.log('[v0] Portfolio data received:', {
        balances: data.balances?.length || 0,
        transactions: data.transactions?.length || 0,
        defiPositions: data.defiPositions?.length || 0
      });
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
    performSearch(searchAddress, false);
  };

  const defiTokenAddresses = useMemo(() => {
    const addresses = new Set<string>();
    defiPositions.forEach((position) => {
      if (position.token) addresses.add(position.token.toLowerCase());
      if (position.token0) addresses.add(position.token0.toLowerCase());
      if (position.token1) addresses.add(position.token1.toLowerCase());
    });
    return addresses;
  }, [defiPositions]);

  const tokenData: TokenItem[] = useMemo(() => {
    const mapped = balances.filter((balance) => balance.value_usd > 0 && !defiTokenAddresses.has(balance.address.toLowerCase())).map(
      (balance) => {
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
      }
    ).sort((a, b) => b.value - a.value);

    const total = mapped.reduce((acc, token) => acc + token.value, 0);
    return mapped.map((token) => ({ ...token, allocation: total > 0 ? (token.value / total) * 100 : 0 }));
  }, [balances, defiTokenAddresses]);

  const protocolData: ProtocolItem[] = useMemo(() => {
    const filtered = defiPositions.filter((position) => {
      const defiTypes = ['UniswapV2', 'UniswapV3', 'CompoundV2', 'CompoundV3', 'Moonwell', 'Aave', 'Lending', 'Liquidity'];
      const isDeFiProtocol = defiTypes.some((type) => position.type?.includes(type));
      const hasSupply = position.supply_quote && position.supply_quote.usd_value > 0;
      const hasDebt = position.debt_quote && position.debt_quote.usd_value > 0;
      const hasValue = position.usd_value > 0;

      return isDeFiProtocol || hasSupply || hasDebt || hasValue;
    });

    console.log('[v0] DeFi positions filtered:', filtered.length, 'from', defiPositions.length);

    return filtered.map((position) => ({
      name: position.protocol,
      chain: position.chain_id?.toString() ?? 'multi-chain',
      type: position.type ?? 'protocol',
      supplied: position.supply_quote?.usd_value,
      liquidity: position.usd_value,
      fees24h: undefined,
      IconComponent: getIconForSymbol(position.token_symbol ?? position.protocol),
      positions: [{
        asset: position.token_symbol ?? position.protocol,
        type: position.type ?? 'Position',
        value: position.usd_value ?? 0,
        apy: 0
      }]
    }));
  }, [defiPositions]);

  const txData: TransactionItem[] = useMemo(() => {
    console.log('[v0] Processing transactions:', transactionsRaw.length);

    return transactionsRaw.map((tx) => ({
      type: tx.decoded?.function_name ?? 'Transaction',
      from: tx.from_address === currentAddress ? 'Me' : (tx.from_address?.substring(0, 6) ?? '-'),
      to: tx.to_address?.substring(0, 6) ?? '-',
      fromAmount: tx.value ? Number.parseFloat(tx.value) / 1e18 : 0,
      chain: tx.chain ?? 'ethereum',
      time: tx.block_timestamp ? new Date(tx.block_timestamp).toLocaleDateString() : '',
      hash: tx.hash,
      status: tx.status === 1 ? 'confirmed' : 'failed',
      gas: Number.parseFloat(tx.transaction_fee ?? '0') / 1e18,
      fromIcon: getIconForSymbol('ETH'),
      toIcon: getIconForSymbol('USDC')
    }));
  }, [currentAddress, transactionsRaw]);

  const filteredTokens = useMemo(
    () => selectedChain === 'all' ? tokenData : tokenData.filter((token) => token.chain.toLowerCase() === selectedChain.toLowerCase()),
    [selectedChain, tokenData]
  );

  const totalValue = useMemo(
    () =>
      tokenData.reduce((acc, token) => acc + token.value, 0) + protocolData.reduce((acc, protocol) => acc + (protocol.liquidity ?? 0), 0),
    [protocolData, tokenData]
  );

  const performanceData = useMemo(
    () => ({ totalValue, totalPnL: 0, totalPnLPercent: 0, dayChange: 0, nftValue: 0, activeProtocols: protocolData.length }),
    [protocolData.length, totalValue]
  );

  const topAllocation = tokenData.length ? Math.max(...tokenData.map((token) => token.allocation)) : 0;
  const chainCount = new Set(tokenData.map((token) => token.chain)).size;
  const diversificationScore = Math.min(10, chainCount * 2 || 0);
  const portfolioHealth = Math.min(10, Math.max(1, diversificationScore + Math.min(protocolData.length, 5)));
  const exposureRisk = topAllocation > 50 ? 'High' : topAllocation > 25 ? 'Medium' : 'Low';
  const liquidationRisk = defiPositions.length > 0 ? 'Review' : 'Low';

  const riskMetrics = { portfolioHealth, diversificationScore, exposureRisk, liquidationRisk };

  const headingFontClass = 'font-[var(--font-orbitron)]';
  const bodyFontClass = 'font-[var(--font-rajdhani)]';
  const numericFontClass = 'font-[var(--font-orbitron)]';

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-[#ccff00] selection:text-black p-6 md:p-12 ${bodyFontClass}`}>
      <Navbar />
      <div className='max-w-[1920px] mx-auto'>
        {/* Header & Search Section */}
        <div className='mb-12'>
          <div className='flex items-center justify-between flex-wrap gap-4 mb-8'>
            <div>
              <div className='inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-4 animate-pulse'>
                ● DUNE ECHO API: LIVE
              </div>
              <h1
                className={`text-4xl md:text-5xl font-bold mb-2 tracking-tight ${headingFontClass}`}
                style={{ fontFamily: 'var(--font-orbitron)' }}>
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
                className='w-full bg-gray-900 border border-gray-800 focus:border-[#ccff00] pl-12 pr-32 py-4 text-sm focus:outline-none transition-all rounded-none placeholder:text-gray-600 font-mono text-white' />
              <button
                type='submit'
                disabled={isSearching}
                className='absolute inset-y-2 right-2 px-6 bg-[#ccff00] text-black font-bold text-sm hover:bg-[#b3e600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-none'>
                {isSearching ?
                  (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Syncing
                    </>
                  ) :
                  (
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
                    className='group flex items-center gap-1 px-3 py-1 bg-[#ccff00]/5 border border-[#ccff00]/20 hover:bg-[#ccff00]/20 text-[#ccff00] text-xs font-mono rounded-none transition-all'>
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
              <div className='mt-4 text-sm text-red-400 flex items-center gap-2 bg-red-900/10 p-3 border border-red-900/50 rounded-none'>
                <AlertCircle className='w-4 h-4' />
                {error}
              </div>
            )}

            {currentAddress && !error && (
              <div className={`mt-4 text-sm text-gray-500 flex items-center gap-2 ${headingFontClass}`}>
                <CheckCircle className='w-4 h-4 text-[#ccff00]' />
                Viewing wallet: <span className='text-white'>{currentAddress}</span>
              </div>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
            <div className='flex items-start justify-between mb-4'>
              <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold ${headingFontClass}`}>Net Worth</div>
              <DollarSign className='w-5 h-5 text-gray-700 group-hover:text-[#ccff00] transition-colors' />
            </div>
            <div className='text-3xl font-bold text-white mb-3 tracking-tight'>
              $
              {(performanceData.totalValue + performanceData.nftValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <TrendingUp className='w-4 h-4 text-[#ccff00]' />
              <span className='text-[#ccff00] font-medium'>+${performanceData.dayChange.toLocaleString()}</span>
            </div>
          </div>

          <div className='bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
            <div className='flex items-start justify-between mb-4'>
              <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold ${headingFontClass}`}>Est. P&L</div>
              <Activity className='w-5 h-5 text-gray-700 group-hover:text-[#ccff00] transition-colors' />
            </div>
            <div className='text-3xl font-bold text-[#ccff00] mb-3 tracking-tight'>+${performanceData.totalPnL.toLocaleString()}</div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-[#ccff00] font-medium'>+{performanceData.totalPnLPercent}%</span>
              <span className='text-gray-600'>All-time</span>
            </div>
          </div>

          <div className='bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
            <div className='flex items-start justify-between mb-4'>
              <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold ${headingFontClass}`}>DeFi Positions</div>
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
              <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 ${headingFontClass}`}>NFT Value</div>
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
              <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 ${headingFontClass}`}>Portfolio Health</div>
              <div className='text-2xl font-bold text-[#ccff00]'>{riskMetrics.portfolioHealth}/10</div>
              <div className='w-full h-1 bg-gray-900 mt-2 overflow-hidden'>
                <div className='h-full bg-[#ccff00]' style={{ width: `${riskMetrics.portfolioHealth * 10}%` }} />
              </div>
            </div>
            <div>
              <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 ${headingFontClass}`}>Diversification</div>
              <div className='text-2xl font-bold text-blue-400'>{riskMetrics.diversificationScore}/10</div>
            </div>
            <div>
              <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 ${headingFontClass}`}>Exposure Risk</div>
              <div className='text-2xl font-bold text-yellow-400'>{riskMetrics.exposureRisk}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-800 mb-8'>
          <div className='flex gap-1 overflow-x-auto'>
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'tokens', label: 'Tokens', icon: DollarSign },
              { id: 'nfts', label: 'NFTs', icon: ImageIcon },
              { id: 'protocols', label: 'DeFi Protocols', icon: Layers },
              { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === id ?
                    'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/5' :
                    'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
                }`}>
                <Icon className='w-4 h-4' />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'tokens' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className={`text-2xl font-bold ${headingFontClass}`}>Token Holdings</h2>
              <select
                value={selectedChain}
                onChange={(event) => setSelectedChain(event.target.value)}
                className='bg-gray-900 border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-[#ccff00] rounded-none'>
                <option value='all'>All Chains</option>
                <option value='ethereum'>Ethereum</option>
                <option value='optimism'>Optimism</option>
                <option value='arbitrum'>Arbitrum</option>
                <option value='polygon'>Polygon</option>
                <option value='avalanche'>Avalanche</option>
                <option value='bsc'>BSC</option>
              </select>
            </div>

            <div className='bg-black border border-gray-800 overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-gray-900/50'>
                  <tr>
                    <th className='text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Asset</th>
                    <th className='text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Chain</th>
                    <th className='text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Balance</th>
                    <th className='text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Price</th>
                    <th className='text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Value</th>
                    <th className='text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Allocation</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-800'>
                  {filteredTokens.map((token, idx) => (
                    <tr key={idx} className='hover:bg-gray-900/30 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-none flex items-center justify-center bg-gray-900'>
                            <token.IconComponent size={20} className='' />
                          </div>
                          <div>
                            <div className='text-sm font-bold'>{token.symbol}</div>
                            <div className='text-xs text-gray-600'>{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <NetworkIcon chain={token.chain} size={20} />
                          <span className='text-sm text-gray-400 capitalize'>{token.chain}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className={`font-medium text-white ${numericFontClass}`}>
                          {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className={`text-gray-400 ${numericFontClass}`}>
                          ${token.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className={`font-medium text-white ${numericFontClass}`}>
                          ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-3'>
                          <div className={`text-sm text-gray-400 ${numericFontClass}`}>{token.allocation.toFixed(1)}%</div>
                          <div className='w-20 h-2 bg-gray-900 overflow-hidden'>
                            <div className='h-full bg-[#ccff00]' style={{ width: `${token.allocation}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                    {nft.image ?
                      (
                        <img
                          src={nft.image || '/placeholder.svg'}
                          alt=''
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' />
                      ) :
                      <ImageIcon className='w-12 h-12 text-gray-700' />}
                    <div className='absolute top-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono border border-gray-700'>
                      {nft.tokenId}
                    </div>
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
            <div className='flex items-center justify-between'>
              <h2 className={`text-2xl font-bold ${headingFontClass}`}>DeFi Protocol Positions</h2>
              <div className='text-sm text-gray-500'>
                {protocolData.length} Active {protocolData.length === 1 ? 'Position' : 'Positions'}
              </div>
            </div>

            {protocolData.length === 0 ?
              (
                <div className='bg-black border border-gray-800 p-12 text-center'>
                  <Layers className='w-12 h-12 text-gray-700 mx-auto mb-4' />
                  <p className='text-gray-500'>No DeFi protocol positions found</p>
                </div>
              ) :
              (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {protocolData.map((protocol, idx) => (
                    <div key={idx} className='bg-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all group'>
                      <div className='flex items-start justify-between mb-6'>
                        <div className='flex items-center gap-3'>
                          <protocol.IconComponent size={40} className='' />
                          <div>
                            <h3 className='text-lg font-bold text-white'>{protocol.name}</h3>
                            <div className='flex items-center gap-1.5 text-sm text-gray-500 mt-1'>
                              <NetworkIcon chain={protocol.chain} size={16} />
                              <span className='capitalize'>{protocol.chain}</span>
                            </div>
                          </div>
                        </div>
                        <div className='text-xs text-gray-600 bg-gray-900 px-2 py-1 rounded-none'>{protocol.type}</div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        {protocol.supplied !== undefined && protocol.supplied > 0 && (
                          <div>
                            <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold mb-1 ${headingFontClass}`}>
                              Supplied
                            </div>
                            <div className={`text-xl font-bold text-[#ccff00] ${numericFontClass}`}>
                              ${protocol.supplied.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        )}
                        {protocol.liquidity !== undefined && protocol.liquidity > 0 && (
                          <div>
                            <div className={`text-xs text-gray-500 uppercase tracking-wider font-bold mb-1 ${headingFontClass}`}>
                              Liquidity
                            </div>
                            <div className={`text-xl font-bold text-white ${numericFontClass}`}>
                              ${protocol.liquidity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        )}
                      </div>

                      {protocol.positions.length > 0 && (
                        <div className='mt-4 pt-4 border-t border-gray-800'>
                          <div className='text-xs text-gray-500 uppercase tracking-wider font-bold mb-2'>Positions</div>
                          <div className='space-y-2'>
                            {protocol.positions.map((pos, posIdx) => (
                              <div key={posIdx} className='flex items-center justify-between text-sm'>
                                <span className='text-gray-400'>{pos.asset} - {pos.type}</span>
                                <span className='text-white font-medium'>${pos.value.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className={`text-2xl font-bold ${headingFontClass}`}>Transaction History</h2>
              <div className='text-sm text-gray-500'>{txData.length} Transactions</div>
            </div>

            <div className='bg-black border border-gray-800 overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-gray-900/50'>
                  <tr>
                    <th className='text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Type</th>
                    <th className='text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Chain</th>
                    <th className='text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>From</th>
                    <th className='text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>To</th>
                    <th className='text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Amount</th>
                    <th className='text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Time</th>
                    <th className='text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                    <th className='text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>View</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-800'>
                  {txData.map((tx, idx) => (
                    <tr key={idx} className='hover:bg-gray-900/30 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='text-sm font-medium text-white'>{tx.type}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <NetworkIcon chain={tx.chain} size={18} />
                          <span className='text-sm text-gray-400 capitalize'>{tx.chain}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-400 font-mono'>{tx.from}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-400 font-mono'>{tx.to}</div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className={`text-sm font-medium text-white ${numericFontClass}`}>{tx.fromAmount.toFixed(4)} ETH</div>
                        <div className='text-xs text-gray-500'>Gas: {tx.gas.toFixed(6)} ETH</div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='text-sm text-gray-400'>{tx.time}</div>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-none ${
                            tx.status === 'confirmed' ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'bg-red-900/10 text-red-400'
                          }`}>
                          {tx.status === 'confirmed' ? <CheckCircle className='w-3 h-3' /> : <AlertCircle className='w-3 h-3' />}
                          {tx.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <button className='text-[#ccff00] hover:text-[#b3e600] transition-colors'>
                          <ExternalLink className='w-4 h-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    className='flex items-center justify-between p-3 hover:bg-gray-900/30 rounded-none transition-colors border border-transparent hover:border-gray-800'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-none flex items-center justify-center bg-gray-900'>
                        <token.IconComponent size={20} className='' />
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
