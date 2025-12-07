"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, ExternalLink, AlertCircle } from "lucide-react"
import {
  TokenETH,
  TokenAVAX,
  TokenUSDC,
  TokenUSDT,
  TokenDAI,
  TokenWBTC,
  TokenLINK,
  TokenUNI,
  TokenAAVE,
  TokenCRV,
  TokenOP,
  TokenARB,
  TokenCOMP,
  TokenGMX,
  TokenMATIC,
  TokenBNB,
  TokenBTC,
} from "@web3icons/react"
import Navbar from "../../components/navbar"

async function fetchPortfolioData(walletAddress: string, chainIds?: number[]) {
  const chainParam = chainIds ? `?chain_ids=${chainIds.join(",")}` : ""
  console.log("[v0] Client: Fetching portfolio data from API route")

  const response = await fetch(`/api/portfolio/${walletAddress}${chainParam}`)

  console.log("[v0] Client: API response status:", response.status, response.statusText)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("[v0] Client: API error response:", errorData)
    throw new Error(errorData.details || errorData.error || `Failed to fetch portfolio data: ${response.statusText}`)
  }

  const data = await response.json()
  console.log("[v0] Client: API data received successfully")
  return data
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "tokens" | "nfts" | "protocols" | "transactions" | "analytics"
  >("overview")
  const [searchAddress, setSearchAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [currentAddress, setCurrentAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
  const [balances, setBalances] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [defiPositions, setDefiPositions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMockData, setIsMockData] = useState(false) // New state to track if mock data is used

  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!currentAddress) return

      setIsLoading(true)
      setError(null)
      setIsMockData(false)

      try {
        console.log("[v0] Loading portfolio data for:", currentAddress)
        const data = await fetchPortfolioData(currentAddress)
        console.log("[v0] Portfolio data received:", {
          balances: data.balances?.length || 0,
          transactions: data.transactions?.length || 0,
          positions: data.defiPositions?.length || 0,
        })

        const hasRealData = data.balances?.length > 0 || data.transactions?.length > 0 || data.defiPositions?.length > 0

        if (!hasRealData) {
          setIsMockData(true)
          console.log("[v0] No real data found, using fallback")
        }

        setBalances(data.balances || [])
        setTransactions(data.transactions || [])
        setDefiPositions(data.defiPositions || [])
      } catch (err) {
        console.error("[v0] Portfolio data error:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(`Failed to load portfolio data: ${errorMessage}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolioData()
  }, [currentAddress])

  const handleSearch = () => {
    if (!searchAddress.trim()) return
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setCurrentAddress(searchAddress)
      setIsSearching(false)
    }, 500)
  }

  const totalValue = balances.reduce((sum, balance) => sum + balance.value_usd, 0)

  const balancesByChain = balances.reduce(
    (acc, balance) => {
      const chainId = balance.chain_id
      if (!acc[chainId]) {
        acc[chainId] = {
          name: balance.chain,
          totalValue: 0,
          tokens: [],
        }
      }
      acc[chainId].totalValue += balance.value_usd
      acc[chainId].tokens.push(balance)
      return acc
    },
    {} as Record<number, { name: string; totalValue: number; tokens: any[] }>,
  )

  const protocolTotals = defiPositions.reduce(
    (acc, position) => {
      const protocol = position.protocol
      if (!acc[protocol]) {
        acc[protocol] = {
          totalValue: 0,
          positions: [],
        }
      }
      acc[protocol].totalValue += position.usd_value
      acc[protocol].positions.push(position)
      return acc
    },
    {} as Record<string, { totalValue: number; positions: any[] }>,
  )

  // Map token symbols to icon components
  const getTokenIcon = (symbol: string) => {
    const iconMap: Record<string, any> = {
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
      BNB: TokenBNB,
    }
    const IconComponent = iconMap[symbol.toUpperCase()]
    return IconComponent ? <IconComponent variant="branded" size={32} /> : null
  }

  // Dummy data from the existing code, to be replaced by API data for specific sections
  const chains = [
    { id: "ethereum", name: "Ethereum", balance: 15420.5, change: 2.34, txCount: 1234, gasSpent: 0.45 },
    { id: "avalanche", name: "Avalanche", balance: 8932.12, change: 1.87, txCount: 456, gasSpent: 12.3 },
    { id: "arbitrum", name: "Arbitrum", balance: 5240.88, change: -0.45, txCount: 789, gasSpent: 0.12 },
    { id: "optimism", name: "Optimism", balance: 3156.2, change: 3.21, txCount: 234, gasSpent: 0.08 },
    { id: "polygon", name: "Polygon", balance: 2145.67, change: 1.45, txCount: 567, gasSpent: 2.34 },
    { id: "bsc", name: "BSC", balance: 1876.34, change: -1.23, txCount: 345, gasSpent: 0.56 },
  ]

  const nfts = [
    {
      collection: "Bored Ape Yacht Club",
      tokenId: "#4521",
      chain: "Ethereum",
      floorPrice: 45.2,
      lastSale: 42.0,
      value: 106089.84,
      image: "/generic-ape.png",
      pnl: 4089.84,
      pnlPercent: 4.01,
    },
    {
      collection: "Azuki",
      tokenId: "#2341",
      chain: "Ethereum",
      floorPrice: 12.5,
      lastSale: 15.2,
      value: 29320.88,
      image: "/azuki-beans.png",
      pnl: -6323.12,
      pnlPercent: -17.74,
    },
    {
      collection: "Pudgy Penguins",
      tokenId: "#7890",
      chain: "Ethereum",
      floorPrice: 8.9,
      lastSale: 7.5,
      value: 20876.46,
      image: "/pudgy-penguin.jpg",
      pnl: 3281.46,
      pnlPercent: 18.66,
    },
    {
      collection: "Doodles",
      tokenId: "#1234",
      chain: "Ethereum",
      floorPrice: 3.2,
      lastSale: 4.1,
      value: 7506.14,
      image: "/nft-doodle.png",
      pnl: -2111.86,
      pnlPercent: -21.96,
    },
  ]

  // Dummy icons for protocols, replace with actual icon fetching logic if needed
  // Updated protocols to include component reference
  const protocolsFromExisting = [
    {
      name: "Aave", // Changed from "Aave V3" for brevity
      chain: "Ethereum",
      type: "Lending", // Added type
      supplied: 8234.56, // Updated values for example
      borrowed: 3456.78,
      apy: 4.23,
      health: 2.38,
      IconComponent: TokenAAVE,
    },
    {
      name: "Uniswap V3",
      chain: "Ethereum",
      type: "LP", // Added type
      liquidity: 15678.9, // Updated values for example
      fees24h: 45.67, // Renamed from fees
      apy: 12.45,
      range: "In Range", // Added range status
      IconComponent: TokenUNI,
    },
    {
      name: "Trader Joe",
      chain: "Avalanche",
      type: "LP", // Added type
      liquidity: 4567.89, // Updated values for example
      fees24h: 12.34, // Renamed from fees
      apy: 8.9,
      range: "In Range", // Added range status
      IconComponent: TokenAVAX,
    },
    {
      name: "Curve", // Changed from "Curve Finance" for brevity
      chain: "Ethereum",
      type: "LP", // Added type
      liquidity: 23456.78, // Updated values for example
      fees24h: 67.89, // Renamed from fees
      apy: 5.67,
      range: "In Range", // Added range status
      IconComponent: TokenCRV,
    },
    {
      name: "Compound", // Changed from "Compound V3" for brevity
      chain: "Ethereum",
      type: "Lending", // Added type
      supplied: 5678.9, // Updated values for example
      borrowed: 2345.67,
      apy: 3.45,
      health: 2.42,
      IconComponent: TokenCOMP,
    },
    {
      name: "GMX",
      chain: "Arbitrum",
      type: "Perpetuals", // Added type
      position: 3456.78, // Updated values for example
      pnl: 234.56,
      leverage: "3x", // Added leverage
      IconComponent: TokenGMX,
    },
  ]

  // Dummy icons for tokens, replace with actual icon fetching logic if needed
  const tokensFromExisting = [
    {
      symbol: "ETH",
      name: "Ethereum",
      chain: "Ethereum",
      balance: 5.234,
      price: 2345.67,
      value: 12276.64,
      change24h: 2.34,
      change7d: 5.67,
      allocation: 23.0,
      cost: 2100.0,
      pnl: 1285.67,
      pnlPercent: 11.7,
      IconComponent: TokenETH,
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      chain: "Avalanche",
      balance: 234.5,
      price: 32.45,
      value: 7609.53,
      change24h: 1.87,
      change7d: 4.23,
      allocation: 14.3,
      cost: 28.0,
      pnl: 1042.53,
      pnlPercent: 15.9,
      IconComponent: TokenAVAX,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      chain: "Multiple",
      balance: 15234,
      price: 1.0,
      value: 15234.0,
      change24h: 0.01,
      change7d: 0.02,
      allocation: 28.6,
      cost: 1.0,
      pnl: 0,
      pnlPercent: 0,
      IconComponent: TokenUSDC,
    },
    {
      symbol: "ARB",
      name: "Arbitrum",
      chain: "Arbitrum",
      balance: 1045.2,
      price: 1.12,
      value: 1170.62,
      change24h: -0.45,
      change7d: 2.34,
      allocation: 2.2,
      cost: 1.05,
      pnl: 73.16,
      pnlPercent: 6.67,
      IconComponent: TokenARB,
    },
    {
      symbol: "OP",
      name: "Optimism",
      chain: "Optimism",
      balance: 678.9,
      price: 2.34,
      value: 1588.63,
      change24h: 3.21,
      change7d: 8.45,
      allocation: 3.0,
      cost: 1.89,
      pnl: 305.51,
      pnlPercent: 23.8,
      IconComponent: TokenOP,
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      chain: "Ethereum",
      balance: 145.3,
      price: 14.56,
      value: 2115.97,
      change24h: 5.67,
      change7d: 12.34,
      allocation: 4.0,
      cost: 12.0,
      pnl: 372.37,
      pnlPercent: 21.4,
      IconComponent: TokenLINK,
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      chain: "Polygon",
      balance: 2456.8,
      price: 0.87,
      value: 2137.42,
      change24h: 1.23,
      change7d: 3.45,
      allocation: 4.0,
      cost: 0.75,
      pnl: 294.82,
      pnlPercent: 16.0,
      IconComponent: TokenMATIC,
    },
    {
      symbol: "BNB",
      name: "BNB",
      chain: "BSC",
      balance: 6.5,
      price: 288.67,
      value: 1876.36,
      change24h: -1.23,
      change7d: 0.89,
      allocation: 3.5,
      cost: 275.0,
      pnl: 88.86,
      pnlPercent: 4.97,
      IconComponent: TokenBNB,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      chain: "Bitcoin",
      balance: 0.123,
      price: 42345.67,
      value: 5207.79,
      change24h: 1.56,
      change7d: 3.45,
      allocation: 9.8,
      cost: 40000.0,
      pnl: 1207.79,
      pnlPercent: 15.1,
      IconComponent: TokenBTC,
    },
  ]

  // Updated transactions to use icon components and adjust structure
  const transactionsFromExisting = [
    {
      type: "Swap",
      from: "ETH",
      to: "USDC",
      fromAmount: 2.5,
      toAmount: 5864.18,
      chain: "Ethereum",
      time: "2 mins ago",
      hash: "0xabc...def",
      status: "confirmed",
      gas: 0.0023,
      fromIcon: TokenETH,
      toIcon: TokenUSDC,
    },
    {
      type: "Supply",
      from: "USDC",
      to: "Aave", // Represents the protocol
      fromAmount: 5000,
      toAmount: 0,
      chain: "Ethereum",
      time: "1 hour ago",
      hash: "0x123...456",
      status: "confirmed",
      gas: 0.0018,
      fromIcon: TokenUSDC,
      toIcon: TokenAAVE,
    },
    {
      type: "Add Liquidity",
      from: "AVAX", // Represents the asset pair
      to: "Trader Joe", // Represents the protocol
      fromAmount: 50,
      toAmount: 0,
      chain: "Avalanche",
      time: "3 hours ago",
      hash: "0x789...abc",
      status: "confirmed",
      gas: 0.12,
      fromIcon: TokenAVAX,
      toIcon: TokenAVAX, // Trader Joe's icon for simplicity here
    },
    {
      type: "Swap",
      from: "LINK",
      to: "ETH",
      fromAmount: 100,
      toAmount: 0.62,
      chain: "Ethereum",
      time: "5 hours ago",
      hash: "0xdef...789",
      status: "confirmed",
      gas: 0.0021,
      fromIcon: TokenLINK,
      toIcon: TokenETH,
    },
    {
      type: "Borrow",
      from: "Aave", // Represents the protocol
      to: "USDC",
      fromAmount: 0,
      toAmount: 3000,
      chain: "Ethereum",
      time: "1 day ago",
      hash: "0x456...def",
      status: "confirmed",
      gas: 0.0025,
      fromIcon: TokenAAVE,
      toIcon: TokenUSDC,
    },
  ]

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
    activeDays: 234,
  }

  const riskMetrics = {
    portfolioHealth: 8.5,
    diversificationScore: 7.8,
    exposureRisk: "Medium",
    liquidationRisk: "Low",
    impermanentLoss: 234.56,
    concentrationRisk: 23.0, // % in top holding
  }

  // Dummy variable to resolve undeclared variable error
  const protocolPositions = protocolsFromExisting

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currentPage="portfolio" />

      <main className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search wallet address (0x...)"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchAddress.trim()}
              className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-lg hover:bg-[#b8e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Currently viewing: <span className="text-[#ccff00] font-mono">{currentAddress}</span>
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">Loading portfolio data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-500 font-semibold">Error Loading Portfolio</p>
              <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Info Banner for Mock Data */}
        {isMockData && (
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-blue-500 font-semibold">Using Mock Data</p>
              <p className="text-blue-400 text-sm mt-1">Please enter a real wallet address for accurate data.</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && (
          <>
            {/* Portfolio Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                <p className="text-gray-400 text-sm mb-2">Total Portfolio Value</p>
                <p className="text-3xl font-bold mb-2">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="text-[#ccff00]" size={16} />
                  <span className="text-[#ccff00]">Real-time data via Dune Analytics</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                <p className="text-gray-400 text-sm mb-2">Total Tokens</p>
                <p className="text-3xl font-bold mb-2">{balances.length}</p>
                <p className="text-sm text-gray-400">Across {Object.keys(balancesByChain).length} chains</p>
              </div>

              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                <p className="text-gray-400 text-sm mb-2">DeFi Positions</p>
                <p className="text-3xl font-bold mb-2">{defiPositions.length}</p>
                <p className="text-sm text-gray-400">Active protocol positions</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {(["overview", "tokens", "protocols", "transactions", "analytics"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "bg-[#ccff00] text-black"
                      : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Top Holdings */}
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Top Holdings</h3>
                  <div className="space-y-3">
                    {balances
                      .sort((a, b) => b.value_usd - a.value_usd)
                      .slice(0, 5)
                      .map((balance, index) => (
                        <div
                          key={`${balance.chain_id}-${balance.address}-${index}`}
                          className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                              {getTokenIcon(balance.symbol)}
                            </div>
                            <div>
                              <p className="font-semibold">{balance.symbol}</p>
                              <p className="text-sm text-gray-400">{balance.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              $
                              {balance.value_usd.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-sm text-gray-400">
                              {(Number.parseFloat(balance.amount) / Math.pow(10, balance.decimals)).toFixed(4)}{" "}
                              {balance.symbol}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Top Protocols */}
                {Object.keys(protocolTotals).length > 0 && (
                  <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Top Protocols</h3>
                    <div className="space-y-3">
                      {Object.entries(protocolTotals)
                        .sort(([, a], [, b]) => b.totalValue - a.totalValue)
                        .slice(0, 5)
                        .map(([protocol, data]) => (
                          <div
                            key={protocol}
                            className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]"
                          >
                            <div>
                              <p className="font-semibold">{protocol}</p>
                              <p className="text-sm text-gray-400">{data.positions.length} positions</p>
                            </div>
                            <p className="font-semibold text-[#ccff00]">
                              $
                              {data.totalValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tokens" && (
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Token Holdings</h3>
                <div className="space-y-3">
                  {balances.map((balance, index) => (
                    <div
                      key={`${balance.chain_id}-${balance.address}-${index}`}
                      className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                          {getTokenIcon(balance.symbol)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{balance.symbol}</p>
                            <span className="text-xs px-2 py-0.5 bg-[#2a2a2a] rounded-full text-gray-400">
                              {balance.chain}
                            </span>
                            {balance.low_liquidity && (
                              <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full">
                                Low Liquidity
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{balance.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          $
                          {balance.value_usd.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-sm text-gray-400">
                          {(Number.parseFloat(balance.amount) / Math.pow(10, balance.decimals)).toFixed(6)}{" "}
                          {balance.symbol}
                        </p>
                        <p className="text-xs text-gray-500">${balance.price_usd.toFixed(6)} per token</p>
                      </div>
                    </div>
                  ))}
                  {balances.length === 0 && <p className="text-center text-gray-400 py-8">No token holdings found</p>}
                </div>
              </div>
            )}

            {activeTab === "protocols" && (
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">DeFi Protocol Positions</h3>
                <div className="space-y-4">
                  {defiPositions.map((position, index) => (
                    <div
                      key={`${position.protocol}-${position.chain_id}-${index}`}
                      className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                            {getTokenIcon(position.protocol)}
                          </div>
                          <div>
                            <p className="font-semibold">{position.protocol}</p>
                            <p className="text-sm text-gray-400">{position.type}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-[#ccff00]">
                          $
                          {position.usd_value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>

                      {position.token0_symbol && position.token1_symbol && (
                        <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                          <p className="text-sm text-gray-400 mb-2">Pool Tokens:</p>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-semibold">{position.token0_symbol}</p>
                              <p className="text-xs text-gray-400">{position.token0_name}</p>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">{position.token1_symbol}</p>
                              <p className="text-xs text-gray-400">{position.token1_name}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {position.supply_quote && (
                        <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">Supplied:</p>
                            <p className="text-sm font-semibold text-green-500">
                              $
                              {position.supply_quote.usd_value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {position.debt_quote && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">Borrowed:</p>
                            <p className="text-sm font-semibold text-red-500">
                              $
                              {position.debt_quote.usd_value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {defiPositions.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No DeFi positions found</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.map((tx, index) => (
                    <div
                      key={`${tx.hash}-${index}`}
                      className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#ccff00]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${tx.status === 1 ? "bg-green-500" : "bg-red-500"}`} />
                          <div>
                            <p className="font-mono text-sm">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </p>
                            <p className="text-xs text-gray-400">{new Date(tx.block_timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ccff00] hover:underline flex items-center gap-1"
                        >
                          <span className="text-sm">View</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Chain: {tx.chain}</span>
                        <span className="text-gray-400">
                          Gas: {(Number.parseFloat(tx.transaction_fee) / 1e18).toFixed(6)} ETH
                        </span>
                      </div>
                      {tx.decoded && (
                        <div className="mt-2 pt-2 border-t border-[#2a2a2a]">
                          <p className="text-xs text-gray-400">Function:</p>
                          <p className="text-sm font-mono text-[#ccff00]">{tx.decoded.function_name}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {transactions.length === 0 && <p className="text-center text-gray-400 py-8">No transactions found</p>}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Portfolio Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <p className="text-sm text-gray-400 mb-2">Total Chains</p>
                    <p className="text-2xl font-bold">{Object.keys(balancesByChain).length}</p>
                  </div>
                  <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <p className="text-sm text-gray-400 mb-2">Total Protocols</p>
                    <p className="text-2xl font-bold">{Object.keys(protocolTotals).length}</p>
                  </div>
                  <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <p className="text-sm text-gray-400 mb-2">Recent Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                  <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <p className="text-sm text-gray-400 mb-2">Data Source</p>
                    <p className="text-sm font-semibold text-[#ccff00]">Dune Analytics</p>
                  </div>
                </div>

                {/* Chain Breakdown */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Value by Chain</h4>
                  <div className="space-y-3">
                    {Object.entries(balancesByChain).map(([chainId, data]) => (
                      <div
                        key={chainId}
                        className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]"
                      >
                        <span className="font-medium">{data.name}</span>
                        <span className="text-[#ccff00] font-semibold">
                          $
                          {data.totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
  )
}
