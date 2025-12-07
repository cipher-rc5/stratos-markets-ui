"use client"

import type React from "react"
import { useState } from "react"
import {
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Zap,
  Shield,
  Droplets,
  Coins,
  ArrowRightLeft,
  ExternalLink,
  Search,
  ImageIcon,
  Wallet,
  Loader2,
  CheckCircle,
  Target,
  AlertCircle,
  LineChart,
  Award,
  TrendingDown,
} from "lucide-react"
import Navbar from "../../components/navbar"
import { usePortfolio, usePortfolioHistory, useTransactions } from "@/lib/hooks/use-portfolio"

export default function PortfolioPage() {
  const [walletAddress, setWalletAddress] = useState("")
  const [searchAddress, setSearchAddress] = useState("")
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d")
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "tokens" | "nfts" | "protocols" | "transactions" | "analytics"
  >("overview")
  const [selectedChain, setSelectedChain] = useState<string>("all")

  // Fetch portfolio data from API
  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolio(walletAddress || null)
  const { history, loading: historyLoading } = usePortfolioHistory(walletAddress || null, timeframe)
  const { transactions, loading: transactionsLoading } = useTransactions(walletAddress || null)
  
  const isLoading = portfolioLoading || historyLoading || transactionsLoading

  const fetchWalletData = async (address: string) => {
    console.log("[v0] Fetching data for wallet:", address)

    // Data will be fetched automatically by hooks
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setWalletAddress(address)
    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchAddress.trim()) {
      fetchWalletData(searchAddress)
    }
  }

  const chains = [
    { id: "ethereum", name: "Ethereum", balance: 15420.5, change: 2.34, txCount: 1234, gasSpent: 0.45 },
    { id: "avalanche", name: "Avalanche", balance: 8932.12, change: 1.87, txCount: 456, gasSpent: 12.3 },
    { id: "arbitrum", name: "Arbitrum", balance: 5240.88, change: -0.45, txCount: 789, gasSpent: 0.12 },
    { id: "optimism", name: "Optimism", balance: 3156.2, change: 3.21, txCount: 234, gasSpent: 0.08 },
    { id: "polygon", name: "Polygon", balance: 2145.67, change: 1.45, txCount: 567, gasSpent: 2.34 },
    { id: "bsc", name: "BSC", balance: 1876.34, change: -1.23, txCount: 345, gasSpent: 0.56 },
  ]

  // Dummy icons for tokens, replace with actual icon fetching logic if needed
  const tokens = [
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
      icon: { hex: "607B9F", path: "M12 2L2 20h20z", title: "Ethereum" }, // Example path for ETH icon
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
      icon: { hex: "E84142", path: "M12 0L0 21h24L12 0z", title: "Avalanche" }, // Example path for AVAX icon
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
      icon: {
        hex: "2775CA",
        path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z",
        title: "USD Coin",
      }, // Example path for USDC icon
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
      icon: {
        hex: "E3132C",
        path: "M12 0L0 12 12 0zm0 24L0 12 12 24zm24-12L12 0 24 12zm0 0L12 24 24 12z",
        title: "Arbitrum",
      }, // Example path for ARB icon
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
      icon: {
        hex: "FE1A2B",
        path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z",
        title: "Optimism",
      }, // Example path for OP icon
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
      icon: { hex: "3757FF", path: "M12 2L2 20h20z", title: "Chainlink" }, // Example path for LINK icon
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
      icon: { hex: "8247E5", path: "M12 2L0 20h24L12 2z", title: "Polygon" }, // Example path for MATIC icon
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
      icon: { hex: "F0B90B", path: "M12 0L0 21h24L12 0z", title: "BNB" }, // Example path for BNB icon
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
      icon: {
        hex: "F7931A",
        path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z",
        title: "Bitcoin",
      }, // Example path for BTC icon
    },
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
  const protocols = [
    {
      name: "Aave V3",
      protocol: "aave",
      chain: "Ethereum",
      tvl: 8456.78,
      positions: [
        { asset: "ETH", type: "Supply", supplied: 2.5, value: 5864.18, apy: 2.45, earned: 45.23 },
        { asset: "USDC", type: "Supply", supplied: 5000, value: 5000, apy: 3.82, earned: 127.33 },
        { asset: "USDC", type: "Borrow", borrowed: 2000, value: -2000, apy: 5.24, paid: 87.47 },
      ],
      totalValue: 8864.18,
      earnings: 85.09,
      health: 2.34,
      icon: {
        hex: "075757",
        path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z",
        title: "Aave",
      },
    },
    {
      name: "Uniswap V3",
      protocol: "uniswap",
      chain: "Ethereum",
      tvl: 4567.89,
      positions: [
        {
          asset: "ETH-USDC",
          type: "LP",
          liquidity: 8500,
          value: 8547.23,
          apy: 28.5,
          fees: 234.12,
          range: "$2100-$2500",
          inRange: true,
        },
      ],
      totalValue: 8547.23,
      earnings: 234.12,
      icon: { hex: "691574", path: "M12 2L2 20h20z", title: "Uniswap" },
    },
    {
      name: "Trader Joe",
      protocol: "traderjoe",
      chain: "Avalanche",
      tvl: 2345.67,
      positions: [
        {
          asset: "AVAX-USDC",
          type: "LP",
          liquidity: 3200,
          value: 3245.87,
          apy: 45.2,
          fees: 145.8,
          range: "$28-$38",
          inRange: true,
        },
      ],
      totalValue: 3245.87,
      earnings: 145.8,
      icon: { hex: "E84142", path: "M12 0L0 21h24L12 0z", title: "Trader Joe" },
    },
    {
      name: "GMX",
      protocol: "gmx",
      chain: "Arbitrum",
      tvl: 1234.56,
      positions: [{ asset: "GLP", type: "Stake", staked: 2500, value: 2567.34, apy: 18.4, earned: 67.89 }],
      totalValue: 2567.34,
      earnings: 67.89,
      icon: { hex: "627575", path: "M12 0L0 24h24L12 0zm0 12l6 12h-12l6-12z", title: "GMX" },
    },
    {
      name: "Curve Finance",
      protocol: "curve",
      chain: "Ethereum",
      tvl: 987.65,
      positions: [{ asset: "3pool", type: "LP", liquidity: 4500, value: 4523.45, apy: 12.3, fees: 92.45 }],
      totalValue: 4523.45,
      earnings: 92.45,
      icon: {
        hex: "00D1A1",
        path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z",
        title: "Curve",
      },
    },
    {
      name: "Compound V3",
      protocol: "compound",
      chain: "Ethereum",
      tvl: 543.21,
      positions: [{ asset: "USDC", type: "Supply", supplied: 3000, value: 3000, apy: 4.12, earned: 45.67 }],
      totalValue: 3000,
      earnings: 45.67,
      icon: {
        hex: "025C56",
        path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z",
        title: "Compound",
      },
    },
  ]

  const transactions = [
    {
      id: 1,
      type: "swap",
      chain: "Ethereum",
      from: "ETH",
      to: "USDC",
      amount: 1.5,
      value: 3518.51,
      timestamp: "2 hours ago",
      hash: "0x7a8b...4d2f",
      status: "confirmed",
      gasUsed: 0.0045,
      gasCost: 10.57,
    },
    {
      id: 2,
      type: "supply",
      chain: "Ethereum",
      protocol: "Aave V3",
      asset: "USDC",
      amount: 5000,
      value: 5000,
      timestamp: "5 hours ago",
      hash: "0x3c5e...9a1b",
      status: "confirmed",
      gasUsed: 0.0032,
      gasCost: 7.52,
    },
    {
      id: 3,
      type: "add_liquidity",
      chain: "Ethereum",
      protocol: "Uniswap V3",
      asset: "ETH-USDC",
      amount: 8500,
      value: 8500,
      timestamp: "1 day ago",
      hash: "0x9f2d...7c4a",
      status: "confirmed",
      gasUsed: 0.0067,
      gasCost: 15.73,
    },
    {
      id: 4,
      type: "claim",
      chain: "Avalanche",
      protocol: "Trader Joe",
      asset: "JOE",
      amount: 45.2,
      value: 89.45,
      timestamp: "2 days ago",
      hash: "0x1a7c...5e8f",
      status: "confirmed",
      gasUsed: 0.0012,
      gasCost: 0.04,
    },
    {
      id: 5,
      type: "stake",
      chain: "Arbitrum",
      protocol: "GMX",
      asset: "GLP",
      amount: 2500,
      value: 2500,
      timestamp: "3 days ago",
      hash: "0x8d4b...3f9c",
      status: "confirmed",
      gasUsed: 0.0008,
      gasCost: 0.02,
    },
    {
      id: 6,
      type: "mint",
      chain: "Ethereum",
      asset: "Pudgy Penguins #7890",
      amount: 1,
      value: 17595.0,
      timestamp: "4 days ago",
      hash: "0x2b9e...6d1a",
      status: "confirmed",
      gasUsed: 0.0089,
      gasCost: 20.89,
    },
    {
      id: 7,
      type: "remove_liquidity",
      chain: "Ethereum",
      protocol: "Curve Finance",
      asset: "3pool",
      amount: 1500,
      value: 1508.23,
      timestamp: "5 days ago",
      hash: "0x5c3f...8a2d",
      status: "confirmed",
      gasUsed: 0.0043,
      gasCost: 10.09,
    },
    {
      id: 8,
      type: "borrow",
      chain: "Ethereum",
      protocol: "Aave V3",
      asset: "USDC",
      amount: 2000,
      value: 2000,
      timestamp: "6 days ago",
      hash: "0x4d8a...9b7c",
      status: "confirmed",
      gasUsed: 0.0038,
      gasCost: 8.92,
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
  const protocolPositions = protocols

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12">
        {/* Header with Search */}
        <div className="mb-12">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-4">
                ● PORTFOLIO STATUS: LIVE
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-2">
                DeFi <span className="text-[#ccff00]">Portfolio</span>
              </h1>
              <p className="text-gray-400 text-lg">Advanced multi-chain portfolio tracking and analytics</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Search any wallet address (0x...)"
                className="w-full bg-gray-900 border border-gray-800 focus:border-[#ccff00]/50 pl-12 pr-32 py-4 text-sm focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute inset-y-0 right-0 px-6 bg-[#ccff00] text-black font-bold text-sm hover:bg-[#b3e600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
            {walletAddress && (
              <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#ccff00]" />
                Viewing wallet: <span className="text-white font-mono">{walletAddress}</span>
              </div>
            )}
          </form>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-all border border-gray-800 hover:border-[#ccff00]/30">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh Data</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-all border border-gray-800 hover:border-[#ccff00]/30">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export CSV</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-all border border-gray-800 hover:border-[#ccff00]/30">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Set Alerts</span>
            </button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Net Worth</div>
                <DollarSign className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-white mb-3">
                ${(performanceData.totalValue + performanceData.nftValue).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-[#ccff00]" />
                <span className="text-[#ccff00] font-medium">+${performanceData.dayChange.toLocaleString()}</span>
                <span className="text-gray-600">({performanceData.dayChangePercent}%)</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total P&L</div>
                <Activity className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-[#ccff00] mb-3">
                +${performanceData.totalPnL.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#ccff00] font-medium">+{performanceData.totalPnLPercent}%</span>
                <span className="text-gray-600">All-time</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">DeFi Value</div>
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-white mb-3">
                ${(performanceData.totalValue + performanceData.protocolValue).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{protocolPositions.length} protocols</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">NFT Value</div>
                <ImageIcon className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-white mb-3">${performanceData.nftValue.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{nfts.length} NFTs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#ccff00]" />
            Risk & Health Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Portfolio Health</div>
              <div className="text-2xl font-bold text-[#ccff00]">{riskMetrics.portfolioHealth}/10</div>
              <div className="w-full h-2 bg-gray-900 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#ccff00]" style={{ width: `${riskMetrics.portfolioHealth * 10}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Diversification</div>
              <div className="text-2xl font-bold text-blue-400">{riskMetrics.diversificationScore}/10</div>
              <div className="w-full h-2 bg-gray-900 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: `${riskMetrics.diversificationScore * 10}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Exposure Risk</div>
              <div className="text-2xl font-bold text-yellow-400">{riskMetrics.exposureRisk}</div>
              <div className="text-xs text-gray-600 mt-2">Balanced exposure</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Liquidation Risk</div>
              <div className="text-2xl font-bold text-green-400">{riskMetrics.liquidationRisk}</div>
              <div className="text-xs text-gray-600 mt-2">Healthy collateral</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">IL Exposure</div>
              <div className="text-2xl font-bold text-red-400">${riskMetrics.impermanentLoss}</div>
              <div className="text-xs text-gray-600 mt-2">From LP positions</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Concentration</div>
              <div className="text-2xl font-bold text-orange-400">{riskMetrics.concentrationRisk}%</div>
              <div className="text-xs text-gray-600 mt-2">Top holding</div>
            </div>
          </div>
        </div>

        {/* Chain Distribution */}
        <div className="bg-black border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold font-['Orbitron'] mb-6">Chain Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chains.map((chain) => (
              <div
                key={chain.id}
                className="bg-gray-900/50 border border-gray-800 p-4 hover:border-[#ccff00]/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-400">{chain.name}</span>
                  {chain.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-[#ccff00]" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-2">${chain.balance.toLocaleString()}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${chain.change >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
                    {chain.change >= 0 ? "+" : ""}
                    {chain.change}%
                  </span>
                  <span className="text-gray-600">{chain.txCount} txns</span>
                </div>
                <div className="text-xs text-gray-600 mt-2">Gas: ${chain.gasSpent}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {(
            [
              { id: "overview", label: "Overview" },
              { id: "tokens", label: "Tokens" },
              { id: "nfts", label: "NFTs" },
              { id: "protocols", label: "Protocols" },
              { id: "transactions", label: "Transactions" },
              { id: "analytics", label: "Analytics" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-3 text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? "bg-[#ccff00] text-black"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tokens Tab */}
        {selectedTab === "tokens" && (
          <div className="bg-black border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-['Orbitron']">Token Holdings</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="bg-gray-900 border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-[#ccff00]/50"
                  >
                    <option value="all">All Chains</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="avalanche">Avalanche</option>
                    <option value="arbitrum">Arbitrum</option>
                    <option value="optimism">Optimism</option>
                    <option value="polygon">Polygon</option>
                    <option value="bsc">BSC</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950">
                    <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Token</th>
                    <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Chain</th>
                    <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Balance</th>
                    <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Price</th>
                    <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Value</th>
                    <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">24h</th>
                    <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">7d</th>
                    <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">P&L</th>
                    <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
                      Allocation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-900 hover:bg-gray-950/50 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `#${token.icon.hex}20` }}
                          >
                            <svg
                              role="img"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill={`#${token.icon.hex}`}
                            >
                              <title>{token.icon.title}</title>
                              <path d={token.icon.path} />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-bold">{token.symbol}</div>
                            <div className="text-xs text-gray-600">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-400">{token.chain}</td>
                      <td className="p-4 text-sm text-right font-mono text-white">{token.balance.toLocaleString()}</td>
                      <td className="p-4 text-sm text-right font-mono text-gray-400">
                        ${token.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-right font-mono text-white font-bold">
                        ${token.value.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`text-sm font-bold ${token.change24h >= 0 ? "text-[#ccff00]" : "text-red-500"}`}
                        >
                          {token.change24h >= 0 ? "+" : ""}
                          {token.change24h}%
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`text-sm font-bold ${token.change7d >= 0 ? "text-[#ccff00]" : "text-red-500"}`}
                        >
                          {token.change7d >= 0 ? "+" : ""}
                          {token.change7d}%
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-sm font-bold text-white">${token.pnl.toLocaleString()}</div>
                        <div className={`text-xs ${token.pnlPercent >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
                          {token.pnlPercent >= 0 ? "+" : ""}
                          {token.pnlPercent}%
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-2 bg-gray-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#ccff00]"
                              style={{ width: `${Math.min(token.allocation, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-10">{token.allocation}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "nfts" && (
          <div className="bg-black border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-['Orbitron']">NFT Collection</h2>
                <div className="text-sm text-gray-400">Total Value: ${performanceData.nftValue.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nfts.map((nft, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-gray-800 hover:border-[#ccff00]/30 transition-all group cursor-pointer"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={`${nft.collection} ${nft.tokenId}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono">{nft.tokenId}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold mb-1">{nft.collection}</div>
                    <div className="text-xs text-gray-600">{nft.chain}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Floor</span>
                      <span className="text-sm font-mono text-white">{nft.floorPrice} ETH</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Value</span>
                      <span className="text-sm font-mono text-white font-bold">${nft.value.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">P&L</span>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${nft.pnl >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
                            {nft.pnl >= 0 ? "+" : ""}${Math.abs(nft.pnl).toLocaleString()}
                          </div>
                          <div className={`text-xs ${nft.pnlPercent >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
                            {nft.pnlPercent >= 0 ? "+" : ""}
                            {nft.pnlPercent}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Protocols Tab */}
        {selectedTab === "protocols" && (
          <div className="space-y-6">
            {protocols.map((protocol, idx) => (
              <div key={idx} className="bg-black border border-gray-800">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill={`#${protocol.icon.hex}`}
                        >
                          <title>{protocol.icon.title}</title>
                          <path d={protocol.icon.path} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{protocol.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{protocol.chain}</span>
                          <span className="text-xs text-gray-700">•</span>
                          <span className="text-xs text-gray-500">DeFi</span>
                          {"health" in protocol && (
                            <>
                              <span className="text-xs text-gray-700">•</span>
                              <span className="text-xs text-[#ccff00]">Health: {protocol.health}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${protocol.totalValue.toLocaleString()}</div>
                      <div className="text-sm text-[#ccff00] mt-1">+${protocol.earnings.toLocaleString()} earned</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-900 bg-gray-950">
                        <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
                          Asset
                        </th>
                        <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Type</th>
                        <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
                          Amount
                        </th>
                        <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
                          Value
                        </th>
                        <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">APY</th>
                        <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
                          Earned
                        </th>
                        {protocol.positions[0].range && (
                          <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
                            Range
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {protocol.positions.map((position, posIdx) => (
                        <tr key={posIdx} className="border-b border-gray-900 hover:bg-gray-950/50 transition-colors">
                          <td className="p-4 text-sm font-medium">{position.asset}</td>
                          <td className="p-4">
                            <span className="text-xs px-2 py-1 bg-gray-900 text-gray-400 rounded">{position.type}</span>
                          </td>
                          <td className="p-4 text-sm text-right font-mono text-gray-400">
                            {"supplied" in position
                              ? position.supplied.toLocaleString()
                              : "borrowed" in position
                                ? position.borrowed.toLocaleString()
                                : "liquidity" in position
                                  ? `$${position.liquidity.toLocaleString()}`
                                  : "staked" in position
                                    ? position.staked.toLocaleString()
                                    : "-"}
                          </td>
                          <td className="p-4 text-sm text-right font-mono text-white font-bold">
                            ${Math.abs(position.value).toLocaleString()}
                          </td>
                          <td className="p-4 text-sm text-right font-bold text-[#ccff00]">{position.apy}%</td>
                          <td className="p-4 text-sm text-right">
                            {"earned" in position && (
                              <span className="text-[#ccff00]">+${position.earned.toLocaleString()}</span>
                            )}
                            {"paid" in position && (
                              <span className="text-red-400">-${position.paid.toLocaleString()}</span>
                            )}
                            {"fees" in position && (
                              <span className="text-[#ccff00]">${position.fees.toLocaleString()}</span>
                            )}
                          </td>
                          {"range" in position && (
                            <td className="p-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono text-xs">{position.range}</span>
                                {position.inRange ? (
                                  <CheckCircle className="w-3 h-3 text-[#ccff00]" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions Tab */}
        {selectedTab === "transactions" && (
          <div className="bg-black border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-['Orbitron']">Transaction History</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 text-sm transition-all border border-gray-800">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    Total: {performanceData.totalTransactions} • Gas: ${performanceData.totalGasSpent}
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-900">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-6 hover:bg-gray-950/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                        {tx.type === "swap" && <ArrowRightLeft className="w-5 h-5 text-[#ccff00]" />}
                        {tx.type === "supply" && <Shield className="w-5 h-5 text-blue-400" />}
                        {tx.type === "add_liquidity" && <Droplets className="w-5 h-5 text-cyan-400" />}
                        {tx.type === "remove_liquidity" && <Droplets className="w-5 h-5 text-orange-400" />}
                        {tx.type === "claim" && <Coins className="w-5 h-5 text-yellow-400" />}
                        {tx.type === "stake" && <Zap className="w-5 h-5 text-purple-400" />}
                        {tx.type === "borrow" && <Shield className="w-5 h-5 text-red-400" />}
                        {tx.type === "mint" && <ImageIcon className="w-5 h-5 text-pink-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold capitalize">{tx.type.replace("_", " ")}</span>
                          {"protocol" in tx && <span className="text-xs text-gray-600">• {tx.protocol}</span>}
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              tx.status === "confirmed"
                                ? "bg-[#ccff00]/10 text-[#ccff00]"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{tx.chain}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tx.timestamp}
                          </span>
                          <span>•</span>
                          <span>Gas: ${tx.gasCost}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-sm font-bold mb-1">
                        {tx.type === "swap" ? `${tx.amount} ${tx.from} → ${tx.to}` : `${tx.amount} ${tx.asset}`}
                      </div>
                      <div className="text-xs text-gray-500">${tx.value.toLocaleString()}</div>
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#ccff00] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "analytics" && (
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="bg-black border border-gray-800 p-6">
              <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-[#ccff00]" />
                Performance Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">24h Change</div>
                  <div className="text-2xl font-bold text-[#ccff00] mb-1">
                    +${performanceData.dayChange.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">+{performanceData.dayChangePercent}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">7d Change</div>
                  <div className="text-2xl font-bold text-[#ccff00] mb-1">
                    +${performanceData.weekChange.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">+{performanceData.weekChangePercent}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">30d Change</div>
                  <div className="text-2xl font-bold text-[#ccff00] mb-1">
                    +${performanceData.monthChange.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">+{performanceData.monthChangePercent}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">1y Change</div>
                  <div className="text-2xl font-bold text-[#ccff00] mb-1">
                    +${performanceData.yearChange.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">+{performanceData.yearChangePercent}%</div>
                </div>
              </div>
            </div>

            {/* Activity Metrics */}
            <div className="bg-black border border-gray-800 p-6">
              <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#ccff00]" />
                Activity Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900/50 border border-gray-800 p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
                    Total Transactions
                  </div>
                  <div className="text-3xl font-bold text-white">{performanceData.totalTransactions}</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Active Days</div>
                  <div className="text-3xl font-bold text-white">{performanceData.activeDays}</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Active Protocols</div>
                  <div className="text-3xl font-bold text-white">{performanceData.activeProtocols}</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Total Gas Spent</div>
                  <div className="text-3xl font-bold text-red-400">${performanceData.totalGasSpent}</div>
                </div>
              </div>
            </div>

            {/* Historical Performance */}
            <div className="bg-black border border-gray-800 p-6">
              <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ccff00]" />
                Historical Milestones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-[#ccff00]" />
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">All-Time High</div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${performanceData.allTimeHigh.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    Current:{" "}
                    {(
                      ((performanceData.totalValue + performanceData.nftValue) / performanceData.allTimeHigh) *
                      100
                    ).toFixed(2)}
                    % of ATH
                  </div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">All-Time Low</div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${performanceData.allTimeLow.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    Growth:{" "}
                    {(
                      ((performanceData.totalValue + performanceData.nftValue - performanceData.allTimeLow) /
                        performanceData.allTimeLow) *
                      100
                    ).toFixed(2)}
                    % from ATL
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab - Default */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Top Tokens */}
            <div className="bg-black border border-gray-800">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold font-['Orbitron']">Top Holdings</h2>
                <button
                  onClick={() => setSelectedTab("tokens")}
                  className="text-sm text-[#ccff00] hover:text-[#b3e600] transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokens.slice(0, 6).map((token, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/50 border border-gray-800 p-4 hover:border-[#ccff00]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `#${token.icon.hex}20` }}
                        >
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill={`#${token.icon.hex}`}
                          >
                            <title>{token.icon.title}</title>
                            <path d={token.icon.path} />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-bold">{token.symbol}</div>
                          <div className="text-xs text-gray-600">{token.chain}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${token.change24h >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h}%
                      </span>
                    </div>
                    <div className="text-xl font-bold mb-1">${token.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">
                      {token.balance.toLocaleString()} {token.symbol}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Summary */}
            <div className="bg-black border border-gray-800">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold font-['Orbitron']">Protocol Positions</h2>
                <button
                  onClick={() => setSelectedTab("protocols")}
                  className="text-sm text-[#ccff00] hover:text-[#b3e600] transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {protocols.map((protocol, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 hover:border-[#ccff00]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `#${protocol.icon.hex}20` }}
                      >
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill={`#${protocol.icon.hex}`}
                        >
                          <title>{protocol.icon.title}</title>
                          <path d={protocol.icon.path} />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold">{protocol.name}</div>
                        <div className="text-xs text-gray-600">{protocol.chain} • DeFi</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${protocol.tvl.toLocaleString()}</div>
                      <div className="text-xs text-[#ccff00]">+${protocol.earnings} earned</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NFT Preview */}
            <div className="bg-black border border-gray-800">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold font-['Orbitron']">NFT Collection</h2>
                <button
                  onClick={() => setSelectedTab("nfts")}
                  className="text-sm text-[#ccff00] hover:text-[#b3e600] transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {nfts.slice(0, 4).map((nft, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/50 border border-gray-800 hover:border-[#ccff00]/30 transition-all group cursor-pointer"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={`${nft.collection} ${nft.tokenId}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold mb-1 truncate">{nft.collection}</div>
                      <div className="text-xs text-gray-600">{nft.floorPrice} ETH</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
