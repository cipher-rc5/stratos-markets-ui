// "use client"
// import { useState } from "react"
// import {
//   TrendingUp,
//   DollarSign,
//   Activity,
//   BarChart3,
//   ArrowUpRight,
//   ArrowDownRight,
//   Clock,
//   Filter,
//   Download,
//   RefreshCw,
//   ChevronRight,
//   Shield,
//   ArrowRightLeft,
//   ExternalLink,
//   Search,
//   ImageIcon,
//   Wallet,
//   Loader2,
//   CheckCircle,
//   Target,
//   AlertCircle,
//   LineChart,
//   Award,
//   TrendingDown,
// } from "lucide-react"
// import {
//   TokenETH,
//   TokenAVAX,
//   TokenUSDC,
//   TokenARB,
//   TokenOP,
//   TokenLINK,
//   TokenMATIC,
//   TokenBNB,
//   TokenBTC,
//   TokenAAVE,
//   TokenUNI,
//   TokenCRV,
//   TokenCOMP,
//   TokenGMX,
// } from "@web3icons/react"
// import Navbar from "../../components/navbar"

// export default function PortfolioPage() {
//   // Renamed selectedTab to activeTab and updated its type
//   const [activeTab, setActiveTab] = useState<
//     "overview" | "tokens" | "nfts" | "protocols" | "transactions" | "analytics"
//   >("overview")
//   const [searchAddress, setSearchAddress] = useState("")
//   // Renamed isLoading to isSearching and walletAddress to currentAddress
//   const [isSearching, setIsSearching] = useState(false)
//   const [currentAddress, setCurrentAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
//   const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d")
//   const [selectedChain, setSelectedChain] = useState<string>("all")

//   // Updated handleSearch logic and state names
//   const handleSearch = () => {
//     if (!searchAddress.trim()) return
//     setIsSearching(true)
//     // Simulate search delay
//     setTimeout(() => {
//       setCurrentAddress(searchAddress)
//       setIsSearching(false)
//     }, 1500)
//   }

//   const chains = [
//     { id: "ethereum", name: "Ethereum", balance: 15420.5, change: 2.34, txCount: 1234, gasSpent: 0.45 },
//     { id: "avalanche", name: "Avalanche", balance: 8932.12, change: 1.87, txCount: 456, gasSpent: 12.3 },
//     { id: "arbitrum", name: "Arbitrum", balance: 5240.88, change: -0.45, txCount: 789, gasSpent: 0.12 },
//     { id: "optimism", name: "Optimism", balance: 3156.2, change: 3.21, txCount: 234, gasSpent: 0.08 },
//     { id: "polygon", name: "Polygon", balance: 2145.67, change: 1.45, txCount: 567, gasSpent: 2.34 },
//     { id: "bsc", name: "BSC", balance: 1876.34, change: -1.23, txCount: 345, gasSpent: 0.56 },
//   ]

//   // Dummy icons for tokens, replace with actual icon fetching logic if needed
//   const tokens = [
//     {
//       symbol: "ETH",
//       name: "Ethereum",
//       chain: "Ethereum",
//       balance: 5.234,
//       price: 2345.67,
//       value: 12276.64,
//       change24h: 2.34,
//       change7d: 5.67,
//       allocation: 23.0,
//       cost: 2100.0,
//       pnl: 1285.67,
//       pnlPercent: 11.7,
//       IconComponent: TokenETH,
//     },
//     {
//       symbol: "AVAX",
//       name: "Avalanche",
//       chain: "Avalanche",
//       balance: 234.5,
//       price: 32.45,
//       value: 7609.53,
//       change24h: 1.87,
//       change7d: 4.23,
//       allocation: 14.3,
//       cost: 28.0,
//       pnl: 1042.53,
//       pnlPercent: 15.9,
//       IconComponent: TokenAVAX,
//     },
//     {
//       symbol: "USDC",
//       name: "USD Coin",
//       chain: "Multiple",
//       balance: 15234,
//       price: 1.0,
//       value: 15234.0,
//       change24h: 0.01,
//       change7d: 0.02,
//       allocation: 28.6,
//       cost: 1.0,
//       pnl: 0,
//       pnlPercent: 0,
//       IconComponent: TokenUSDC,
//     },
//     {
//       symbol: "ARB",
//       name: "Arbitrum",
//       chain: "Arbitrum",
//       balance: 1045.2,
//       price: 1.12,
//       value: 1170.62,
//       change24h: -0.45,
//       change7d: 2.34,
//       allocation: 2.2,
//       cost: 1.05,
//       pnl: 73.16,
//       pnlPercent: 6.67,
//       IconComponent: TokenARB,
//     },
//     {
//       symbol: "OP",
//       name: "Optimism",
//       chain: "Optimism",
//       balance: 678.9,
//       price: 2.34,
//       value: 1588.63,
//       change24h: 3.21,
//       change7d: 8.45,
//       allocation: 3.0,
//       cost: 1.89,
//       pnl: 305.51,
//       pnlPercent: 23.8,
//       IconComponent: TokenOP,
//     },
//     {
//       symbol: "LINK",
//       name: "Chainlink",
//       chain: "Ethereum",
//       balance: 145.3,
//       price: 14.56,
//       value: 2115.97,
//       change24h: 5.67,
//       change7d: 12.34,
//       allocation: 4.0,
//       cost: 12.0,
//       pnl: 372.37,
//       pnlPercent: 21.4,
//       IconComponent: TokenLINK,
//     },
//     {
//       symbol: "MATIC",
//       name: "Polygon",
//       chain: "Polygon",
//       balance: 2456.8,
//       price: 0.87,
//       value: 2137.42,
//       change24h: 1.23,
//       change7d: 3.45,
//       allocation: 4.0,
//       cost: 0.75,
//       pnl: 294.82,
//       pnlPercent: 16.0,
//       IconComponent: TokenMATIC,
//     },
//     {
//       symbol: "BNB",
//       name: "BNB",
//       chain: "BSC",
//       balance: 6.5,
//       price: 288.67,
//       value: 1876.36,
//       change24h: -1.23,
//       change7d: 0.89,
//       allocation: 3.5,
//       cost: 275.0,
//       pnl: 88.86,
//       pnlPercent: 4.97,
//       IconComponent: TokenBNB,
//     },
//     {
//       symbol: "BTC",
//       name: "Bitcoin",
//       chain: "Bitcoin",
//       balance: 0.123,
//       price: 42345.67,
//       value: 5207.79,
//       change24h: 1.56,
//       change7d: 3.45,
//       allocation: 9.8,
//       cost: 40000.0,
//       pnl: 1207.79,
//       pnlPercent: 15.1,
//       IconComponent: TokenBTC,
//     },
//   ]

//   const nfts = [
//     {
//       collection: "Bored Ape Yacht Club",
//       tokenId: "#4521",
//       chain: "Ethereum",
//       floorPrice: 45.2,
//       lastSale: 42.0,
//       value: 106089.84,
//       image: "/generic-ape.png",
//       pnl: 4089.84,
//       pnlPercent: 4.01,
//     },
//     {
//       collection: "Azuki",
//       tokenId: "#2341",
//       chain: "Ethereum",
//       floorPrice: 12.5,
//       lastSale: 15.2,
//       value: 29320.88,
//       image: "/azuki-beans.png",
//       pnl: -6323.12,
//       pnlPercent: -17.74,
//     },
//     {
//       collection: "Pudgy Penguins",
//       tokenId: "#7890",
//       chain: "Ethereum",
//       floorPrice: 8.9,
//       lastSale: 7.5,
//       value: 20876.46,
//       image: "/pudgy-penguin.jpg",
//       pnl: 3281.46,
//       pnlPercent: 18.66,
//     },
//     {
//       collection: "Doodles",
//       tokenId: "#1234",
//       chain: "Ethereum",
//       floorPrice: 3.2,
//       lastSale: 4.1,
//       value: 7506.14,
//       image: "/nft-doodle.png",
//       pnl: -2111.86,
//       pnlPercent: -21.96,
//     },
//   ]

//   // Dummy icons for protocols, replace with actual icon fetching logic if needed
//   // Updated protocols to include component reference
//   const protocols = [
//     {
//       name: "Aave", // Changed from "Aave V3" for brevity
//       chain: "Ethereum",
//       type: "Lending", // Added type
//       supplied: 8234.56, // Updated values for example
//       borrowed: 3456.78,
//       apy: 4.23,
//       health: 2.38,
//       IconComponent: TokenAAVE,
//     },
//     {
//       name: "Uniswap V3",
//       chain: "Ethereum",
//       type: "LP", // Added type
//       liquidity: 15678.9, // Updated values for example
//       fees24h: 45.67, // Renamed from fees
//       apy: 12.45,
//       range: "In Range", // Added range status
//       IconComponent: TokenUNI,
//     },
//     {
//       name: "Trader Joe",
//       chain: "Avalanche",
//       type: "LP", // Added type
//       liquidity: 4567.89, // Updated values for example
//       fees24h: 12.34, // Renamed from fees
//       apy: 8.9,
//       range: "In Range", // Added range status
//       IconComponent: TokenAVAX,
//     },
//     {
//       name: "Curve", // Changed from "Curve Finance" for brevity
//       chain: "Ethereum",
//       type: "LP", // Added type
//       liquidity: 23456.78, // Updated values for example
//       fees24h: 67.89, // Renamed from fees
//       apy: 5.67,
//       range: "In Range", // Added range status
//       IconComponent: TokenCRV,
//     },
//     {
//       name: "Compound", // Changed from "Compound V3" for brevity
//       chain: "Ethereum",
//       type: "Lending", // Added type
//       supplied: 5678.9, // Updated values for example
//       borrowed: 2345.67,
//       apy: 3.45,
//       health: 2.42,
//       IconComponent: TokenCOMP,
//     },
//     {
//       name: "GMX",
//       chain: "Arbitrum",
//       type: "Perpetuals", // Added type
//       position: 3456.78, // Updated values for example
//       pnl: 234.56,
//       leverage: "3x", // Added leverage
//       IconComponent: TokenGMX,
//     },
//   ]

//   // Updated transactions to use icon components and adjust structure
//   const transactions = [
//     {
//       type: "Swap",
//       from: "ETH",
//       to: "USDC",
//       fromAmount: 2.5,
//       toAmount: 5864.18,
//       chain: "Ethereum",
//       time: "2 mins ago",
//       hash: "0xabc...def",
//       status: "confirmed",
//       gas: 0.0023,
//       fromIcon: TokenETH,
//       toIcon: TokenUSDC,
//     },
//     {
//       type: "Supply",
//       from: "USDC",
//       to: "Aave", // Represents the protocol
//       fromAmount: 5000,
//       toAmount: 0,
//       chain: "Ethereum",
//       time: "1 hour ago",
//       hash: "0x123...456",
//       status: "confirmed",
//       gas: 0.0018,
//       fromIcon: TokenUSDC,
//       toIcon: TokenAAVE,
//     },
//     {
//       type: "Add Liquidity",
//       from: "AVAX", // Represents the asset pair
//       to: "Trader Joe", // Represents the protocol
//       fromAmount: 50,
//       toAmount: 0,
//       chain: "Avalanche",
//       time: "3 hours ago",
//       hash: "0x789...abc",
//       status: "confirmed",
//       gas: 0.12,
//       fromIcon: TokenAVAX,
//       toIcon: TokenAVAX, // Trader Joe's icon for simplicity here
//     },
//     {
//       type: "Swap",
//       from: "LINK",
//       to: "ETH",
//       fromAmount: 100,
//       toAmount: 0.62,
//       chain: "Ethereum",
//       time: "5 hours ago",
//       hash: "0xdef...789",
//       status: "confirmed",
//       gas: 0.0021,
//       fromIcon: TokenLINK,
//       toIcon: TokenETH,
//     },
//     {
//       type: "Borrow",
//       from: "Aave", // Represents the protocol
//       to: "USDC",
//       fromAmount: 0,
//       toAmount: 3000,
//       chain: "Ethereum",
//       time: "1 day ago",
//       hash: "0x456...def",
//       status: "confirmed",
//       gas: 0.0025,
//       fromIcon: TokenAAVE,
//       toIcon: TokenUSDC,
//     },
//   ]

//   const performanceData = {
//     totalValue: 53369.87,
//     totalPnL: 4821.34,
//     totalPnLPercent: 9.93,
//     dayChange: 542.18,
//     dayChangePercent: 1.02,
//     weekChange: 1240.55,
//     weekChangePercent: 2.38,
//     monthChange: 2847.92,
//     monthChangePercent: 5.63,
//     yearChange: 8234.56,
//     yearChangePercent: 18.24,
//     allTimeHigh: 67842.34,
//     allTimeLow: 12456.78,
//     nftValue: 164793.32,
//     protocolValue: 30747.87,
//     totalGasSpent: 124.56,
//     totalTransactions: 2713,
//     activeProtocols: 6,
//     activeDays: 234,
//   }

//   const riskMetrics = {
//     portfolioHealth: 8.5,
//     diversificationScore: 7.8,
//     exposureRisk: "Medium",
//     liquidationRisk: "Low",
//     impermanentLoss: 234.56,
//     concentrationRisk: 23.0, // % in top holding
//   }

//   // Dummy variable to resolve undeclared variable error
//   const protocolPositions = protocols

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Navbar />

//       <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-12">
//         {/* Header with Search */}
//         <div className="mb-12">
//           <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
//             <div>
//               <div className="inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-4">
//                 ● PORTFOLIO STATUS: LIVE
//               </div>
//               <h1 className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-2">
//                 DeFi <span className="text-[#ccff00]">Portfolio</span>
//               </h1>
//               <p className="text-gray-400 text-lg">Advanced multi-chain portfolio tracking and analytics</p>
//             </div>
//           </div>

//           {/* Updated search form and input/button */}
//           <form
//             onSubmit={(e) => {
//               e.preventDefault()
//               handleSearch()
//             }}
//             className="mb-8"
//           >
//             <div className="relative max-w-2xl">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-500" />
//               </div>
//               <input
//                 type="text"
//                 value={searchAddress}
//                 onChange={(e) => setSearchAddress(e.target.value)}
//                 placeholder="Search any wallet address (0x...)"
//                 className="w-full bg-gray-900 border border-gray-800 focus:border-[#ccff00]/50 pl-12 pr-32 py-4 text-sm focus:outline-none transition-all"
//               />
//               <button
//                 type="submit"
//                 // Updated disabled state and button text/icon
//                 disabled={isSearching}
//                 className="absolute inset-y-0 right-0 px-6 bg-[#ccff00] text-black font-bold text-sm hover:bg-[#b3e600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {isSearching ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Loading...
//                   </>
//                 ) : (
//                   <>
//                     <Wallet className="w-4 h-4" />
//                     Search
//                   </>
//                 )}
//               </button>
//             </div>
//             {/* Updated to show currentAddress */}
//             {currentAddress && (
//               <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-[#ccff00]" />
//                 Viewing wallet: <span className="text-white font-mono">{currentAddress}</span>
//               </div>
//             )}
//           </form>

//           {/* Quick Actions */}
//           <div className="flex gap-3">
//             <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-all border border-gray-800 hover:border-[#ccff00]/30">
//               <RefreshCw className="w-4 h-4" />
//               <span className="text-sm font-medium">Refresh Data</span>
//             </button>
//             <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-all border border-gray-800 hover:border-[#ccff00]/30">
//               <Download className="w-4 h-4" />
//               <span className="text-sm font-medium">Export CSV</span>
//             </button>
//             <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-all border border-gray-800 hover:border-[#ccff00]/30">
//               <Target className="w-4 h-4" />
//               <span className="text-sm font-medium">Set Alerts</span>
//             </button>
//           </div>
//         </div>

//         {/* Performance Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
//             <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Net Worth</div>
//                 <DollarSign className="w-5 h-5 text-gray-700" />
//               </div>
//               <div className="text-3xl font-bold text-white mb-3">
//                 ${(performanceData.totalValue + performanceData.nftValue).toLocaleString()}
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <TrendingUp className="w-4 h-4 text-[#ccff00]" />
//                 <span className="text-[#ccff00] font-medium">+${performanceData.dayChange.toLocaleString()}</span>
//                 <span className="text-gray-600">({performanceData.dayChangePercent}%)</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
//             <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total P&L</div>
//                 <Activity className="w-5 h-5 text-gray-700" />
//               </div>
//               <div className="text-3xl font-bold text-[#ccff00] mb-3">
//                 +${performanceData.totalPnL.toLocaleString()}
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-[#ccff00] font-medium">+{performanceData.totalPnLPercent}%</span>
//                 <span className="text-gray-600">All-time</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
//             <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">DeFi Value</div>
//                 <BarChart3 className="w-5 h-5 text-gray-700" />
//               </div>
//               <div className="text-3xl font-bold text-white mb-3">
//                 ${(performanceData.totalValue + performanceData.protocolValue).toLocaleString()}
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-400">{protocolPositions.length} protocols</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 p-6 hover:border-[#ccff00]/30 transition-all relative overflow-hidden group">
//             <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">NFT Value</div>
//                 <ImageIcon className="w-5 h-5 text-gray-700" />
//               </div>
//               <div className="text-3xl font-bold text-white mb-3">${performanceData.nftValue.toLocaleString()}</div>
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-400">{nfts.length} NFTs</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-black border border-gray-800 p-6 mb-8">
//           <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
//             <Shield className="w-5 h-5 text-[#ccff00]" />
//             Risk & Health Metrics
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
//             <div>
//               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Portfolio Health</div>
//               <div className="text-2xl font-bold text-[#ccff00]">{riskMetrics.portfolioHealth}/10</div>
//               <div className="w-full h-2 bg-gray-900 rounded-full mt-2 overflow-hidden">
//                 <div className="h-full bg-[#ccff00]" style={{ width: `${riskMetrics.portfolioHealth * 10}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Diversification</div>
//               <div className="text-2xl font-bold text-blue-400">{riskMetrics.diversificationScore}/10</div>
//               <div className="w-full h-2 bg-gray-900 rounded-full mt-2 overflow-hidden">
//                 <div className="h-full bg-blue-400" style={{ width: `${riskMetrics.diversificationScore * 10}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Exposure Risk</div>
//               <div className="text-2xl font-bold text-yellow-400">{riskMetrics.exposureRisk}</div>
//               <div className="text-xs text-gray-600 mt-2">Balanced exposure</div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Liquidation Risk</div>
//               <div className="text-2xl font-bold text-green-400">{riskMetrics.liquidationRisk}</div>
//               <div className="text-xs text-gray-600 mt-2">Healthy collateral</div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">IL Exposure</div>
//               <div className="text-2xl font-bold text-red-400">${riskMetrics.impermanentLoss}</div>
//               <div className="text-xs text-gray-600 mt-2">From LP positions</div>
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Concentration</div>
//               <div className="text-2xl font-bold text-orange-400">{riskMetrics.concentrationRisk}%</div>
//               <div className="text-xs text-gray-600 mt-2">Top holding</div>
//             </div>
//           </div>
//         </div>

//         {/* Chain Distribution */}
//         <div className="bg-black border border-gray-800 p-6 mb-8">
//           <h2 className="text-xl font-bold font-['Orbitron'] mb-6">Chain Distribution</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {chains.map((chain) => (
//               <div
//                 key={chain.id}
//                 className="bg-gray-900/50 border border-gray-800 p-4 hover:border-[#ccff00]/30 transition-all cursor-pointer group"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-medium text-gray-400">{chain.name}</span>
//                   {chain.change >= 0 ? (
//                     <ArrowUpRight className="w-4 h-4 text-[#ccff00]" />
//                   ) : (
//                     <ArrowDownRight className="w-4 h-4 text-red-500" />
//                   )}
//                 </div>
//                 <div className="text-2xl font-bold mb-2">${chain.balance.toLocaleString()}</div>
//                 <div className="flex items-center justify-between text-xs">
//                   <span className={`font-medium ${chain.change >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
//                     {chain.change >= 0 ? "+" : ""}
//                     {chain.change}%
//                   </span>
//                   <span className="text-gray-600">{chain.txCount} txns</span>
//                 </div>
//                 <div className="text-xs text-gray-600 mt-2">Gas: ${chain.gasSpent}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex items-center gap-2 mb-8 overflow-x-auto">
//           {(
//             [
//               { id: "overview", label: "Overview" },
//               { id: "tokens", label: "Tokens" },
//               { id: "nfts", label: "NFTs" },
//               { id: "protocols", label: "Protocols" },
//               { id: "transactions", label: "Transactions" },
//               { id: "analytics", label: "Analytics" },
//             ] as const
//           ).map((tab) => (
//             <button
//               key={tab.id}
//               // Updated onClick to use activeTab state
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-6 py-3 text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap ${activeTab === tab.id
//                   ? "bg-[#ccff00] text-black"
//                   : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
//                 }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Tokens Tab */}
//         {activeTab === "tokens" && (
//           <div className="bg-black border border-gray-800">
//             <div className="p-6 border-b border-gray-800">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold font-['Orbitron']">Token Holdings</h2>
//                 <div className="flex items-center gap-3">
//                   <select
//                     value={selectedChain}
//                     onChange={(e) => setSelectedChain(e.target.value)}
//                     className="bg-gray-900 border border-gray-800 px-4 py-2 text-sm focus:outline-none focus:border-[#ccff00]/50"
//                   >
//                     <option value="all">All Chains</option>
//                     <option value="ethereum">Ethereum</option>
//                     <option value="avalanche">Avalanche</option>
//                     <option value="arbitrum">Arbitrum</option>
//                     <option value="optimism">Optimism</option>
//                     <option value="polygon">Polygon</option>
//                     <option value="bsc">BSC</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-800 bg-gray-950">
//                     <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Token</th>
//                     <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Chain</th>
//                     <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Balance</th>
//                     <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Price</th>
//                     <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Value</th>
//                     <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">24h</th>
//                     <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">7d</th>
//                     <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">P&L</th>
//                     <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
//                       Allocation
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tokens.map((token, idx) => (
//                     <tr
//                       key={idx}
//                       className="border-b border-gray-900 hover:bg-gray-950/50 transition-colors cursor-pointer"
//                     >
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900">
//                             <token.IconComponent variant="branded" size={20} />
//                           </div>
//                           <div>
//                             <div className="text-sm font-bold">{token.symbol}</div>
//                             <div className="text-xs text-gray-600">{token.name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4 text-sm text-gray-400">{token.chain}</td>
//                       <td className="p-4 text-sm text-right font-mono text-white">{token.balance.toLocaleString()}</td>
//                       <td className="p-4 text-sm text-right font-mono text-gray-400">
//                         ${token.price.toLocaleString()}
//                       </td>
//                       <td className="p-4 text-sm text-right font-mono text-white font-bold">
//                         ${token.value.toLocaleString()}
//                       </td>
//                       <td className="p-4 text-right">
//                         <span
//                           className={`text-sm font-bold ${token.change24h >= 0 ? "text-[#ccff00]" : "text-red-500"}`}
//                         >
//                           {token.change24h >= 0 ? "+" : ""}
//                           {token.change24h}%
//                         </span>
//                       </td>
//                       <td className="p-4 text-right">
//                         <span
//                           className={`text-sm font-bold ${token.change7d >= 0 ? "text-[#ccff00]" : "text-red-500"}`}
//                         >
//                           {token.change7d >= 0 ? "+" : ""}
//                           {token.change7d}%
//                         </span>
//                       </td>
//                       <td className="p-4 text-right">
//                         <div className="text-sm font-bold text-white">${token.pnl.toLocaleString()}</div>
//                         <div className={`text-xs ${token.pnlPercent >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
//                           {token.pnlPercent >= 0 ? "+" : ""}
//                           {token.pnlPercent}%
//                         </div>
//                       </td>
//                       <td className="p-4 text-right">
//                         <div className="flex items-center justify-end gap-2">
//                           <div className="w-20 h-2 bg-gray-900 rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-[#ccff00]"
//                               style={{ width: `${Math.min(token.allocation, 100)}%` }}
//                             />
//                           </div>
//                           <span className="text-xs text-gray-500 w-10">{token.allocation}%</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {activeTab === "nfts" && (
//           <div className="bg-black border border-gray-800">
//             <div className="p-6 border-b border-gray-800">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold font-['Orbitron']">NFT Collection</h2>
//                 <div className="text-sm text-gray-400">Total Value: ${performanceData.nftValue.toLocaleString()}</div>
//               </div>
//             </div>

//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {nfts.map((nft, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-900/50 border border-gray-800 hover:border-[#ccff00]/30 transition-all group cursor-pointer"
//                 >
//                   <div className="aspect-square relative overflow-hidden">
//                     <img
//                       src={nft.image || "/placeholder.svg"}
//                       alt={`${nft.collection} ${nft.tokenId}`}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                     />
//                     <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono">{nft.tokenId}</div>
//                   </div>
//                   <div className="p-4">
//                     <div className="text-sm font-bold mb-1">{nft.collection}</div>
//                     <div className="text-xs text-gray-600">{nft.chain}</div>
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-xs text-gray-500">Floor</span>
//                       <span className="text-sm font-mono text-white">{nft.floorPrice} ETH</span>
//                     </div>
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-xs text-gray-500">Value</span>
//                       <span className="text-sm font-mono text-white font-bold">${nft.value.toLocaleString()}</span>
//                     </div>
//                     <div className="pt-2 border-t border-gray-800">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs text-gray-500">P&L</span>
//                         <div className="text-right">
//                           <div className={`text-sm font-bold ${nft.pnl >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
//                             {nft.pnl >= 0 ? "+" : ""}${Math.abs(nft.pnl).toLocaleString()}
//                           </div>
//                           <div className={`text-xs ${nft.pnlPercent >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
//                             {nft.pnlPercent >= 0 ? "+" : ""}
//                             {nft.pnlPercent}%
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Protocols Tab */}
//         {activeTab === "protocols" && (
//           <div className="space-y-6">
//             {protocols.map((protocol, idx) => (
//               <div key={idx} className="bg-black border border-gray-800">
//                 <div className="p-6 border-b border-gray-800">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
//                         <protocol.IconComponent variant="branded" size={24} />
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-bold">{protocol.name}</h3>
//                         <div className="flex items-center gap-3 mt-1">
//                           <span className="text-xs text-gray-500">{protocol.chain}</span>
//                           <span className="text-xs text-gray-700">•</span>
//                           {/* Display protocol type */}
//                           <span className="text-xs text-gray-500">{protocol.type}</span>
//                           {"health" in protocol && (
//                             <>
//                               <span className="text-xs text-gray-700">•</span>
//                               <span className="text-xs text-[#ccff00]">Health: {protocol.health}</span>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       {/* Updated to show TVL */}
//                       <div className="text-2xl font-bold">
//                         $
//                         {protocol.liquidity?.toLocaleString() ??
//                           protocol.supplied?.toLocaleString() ??
//                           protocol.position?.toLocaleString() ??
//                           "0"}
//                       </div>
//                       {/* Display earned/fees */}
//                       <div className="text-sm text-[#ccff00] mt-1">
//                         +${(protocol.fees24h ?? protocol.apy ?? 0).toLocaleString()} earned
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-900 bg-gray-950">
//                         <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
//                           Asset
//                         </th>
//                         <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">Type</th>
//                         <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
//                           Amount
//                         </th>
//                         <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
//                           Value
//                         </th>
//                         <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">APY</th>
//                         <th className="text-right p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
//                           Earned
//                         </th>
//                         {/* Conditionally render Range column */}
//                         {protocol.range && (
//                           <th className="text-left p-4 text-xs text-gray-500 uppercase tracking-wider font-bold">
//                             Range
//                           </th>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {protocol.positions.map((position, posIdx) => (
//                         <tr key={posIdx} className="border-b border-gray-900 hover:bg-gray-950/50 transition-colors">
//                           <td className="p-4 text-sm font-medium">{position.asset}</td>
//                           <td className="p-4">
//                             <span className="text-xs px-2 py-1 bg-gray-900 text-gray-400 rounded">{position.type}</span>
//                           </td>
//                           <td className="p-4 text-sm text-right font-mono text-gray-400">
//                             {"supplied" in position
//                               ? position.supplied.toLocaleString()
//                               : "borrowed" in position
//                                 ? position.borrowed.toLocaleString()
//                                 : "liquidity" in position
//                                   ? `$${position.liquidity.toLocaleString()}`
//                                   : "staked" in position
//                                     ? position.staked.toLocaleString()
//                                     : "-"}
//                           </td>
//                           <td className="p-4 text-sm text-right font-mono text-white font-bold">
//                             ${Math.abs(position.value).toLocaleString()}
//                           </td>
//                           <td className="p-4 text-sm text-right font-bold text-[#ccff00]">{position.apy}%</td>
//                           <td className="p-4 text-sm text-right">
//                             {"earned" in position && (
//                               <span className="text-[#ccff00]">+${position.earned.toLocaleString()}</span>
//                             )}
//                             {"paid" in position && (
//                               <span className="text-red-400">-${position.paid.toLocaleString()}</span>
//                             )}
//                             {"fees" in position && (
//                               <span className="text-[#ccff00]">${position.fees.toLocaleString()}</span>
//                             )}
//                           </td>
//                           {"range" in position && (
//                             <td className="p-4 text-sm">
//                               <div className="flex items-center gap-2">
//                                 <span className="text-gray-400 font-mono text-xs">{position.range}</span>
//                                 {position.inRange ? (
//                                   <CheckCircle className="w-3 h-3 text-[#ccff00]" />
//                                 ) : (
//                                   <AlertCircle className="w-3 h-3 text-red-500" />
//                                 )}
//                               </div>
//                             </td>
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Transactions Tab */}
//         {activeTab === "transactions" && (
//           <div className="bg-black border border-gray-800">
//             <div className="p-6 border-b border-gray-800">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold font-['Orbitron']">Transaction History</h2>
//                 <div className="flex items-center gap-3">
//                   <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-4 py-2 text-sm transition-all border border-gray-800">
//                     <Filter className="w-4 h-4" />
//                     <span>Filter</span>
//                   </button>
//                   <div className="text-sm text-gray-500">
//                     Total: {performanceData.totalTransactions} • Gas: ${performanceData.totalGasSpent}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="divide-y divide-gray-900">
//               {transactions.map((tx) => (
//                 <div key={tx.hash} className="p-6 hover:bg-gray-950/50 transition-colors">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4 flex-1">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900">
//                           <tx.fromIcon variant="branded" size={18} />
//                         </div>
//                         <ArrowRightLeft className="w-3 h-3 text-gray-600" />
//                         <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900">
//                           <tx.toIcon variant="branded" size={18} />
//                         </div>
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-1">
//                           <span className="text-sm font-bold capitalize">{tx.type.replace("_", " ")}</span>
//                           {/* Display protocol name if available */}
//                           {tx.to !== tx.from && tx.type !== "Swap" && tx.type !== "Add Liquidity" && (
//                             <span className="text-xs text-gray-600">• {tx.to}</span>
//                           )}
//                           <span
//                             className={`text-xs px-2 py-0.5 rounded ${tx.status === "confirmed"
//                                 ? "bg-[#ccff00]/10 text-[#ccff00]"
//                                 : "bg-yellow-500/10 text-yellow-500"
//                               }`}
//                           >
//                             {tx.status}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 text-xs text-gray-500">
//                           <span>{tx.chain}</span>
//                           <span>•</span>
//                           <span className="flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {tx.time}
//                           </span>
//                           <span>•</span>
//                           <span>Gas: ${tx.gas}</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right mr-4">
//                       <div className="text-sm font-bold mb-1">
//                         {tx.type === "Swap" ? `${tx.fromAmount} ${tx.from} → ${tx.to}` : `${tx.fromAmount} ${tx.from}`}
//                       </div>
//                       <div className="text-xs text-gray-500">${tx.toAmount.toLocaleString()}</div>
//                     </div>
//                     <a
//                       // Use a placeholder if hash is not available (though it should be)
//                       href={`https://etherscan.io/tx/${tx.hash || "#"}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-gray-600 hover:text-[#ccff00] transition-colors"
//                     >
//                       <ExternalLink className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {activeTab === "analytics" && (
//           <div className="space-y-8">
//             {/* Performance Metrics */}
//             <div className="bg-black border border-gray-800 p-6">
//               <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
//                 <LineChart className="w-5 h-5 text-[#ccff00]" />
//                 Performance Analytics
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div>
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">24h Change</div>
//                   <div className="text-2xl font-bold text-[#ccff00] mb-1">
//                     +${performanceData.dayChange.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-400">+{performanceData.dayChangePercent}%</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">7d Change</div>
//                   <div className="text-2xl font-bold text-[#ccff00] mb-1">
//                     +${performanceData.weekChange.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-400">+{performanceData.weekChangePercent}%</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">30d Change</div>
//                   <div className="text-2xl font-bold text-[#ccff00] mb-1">
//                     +${performanceData.monthChange.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-400">+{performanceData.monthChangePercent}%</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">1y Change</div>
//                   <div className="text-2xl font-bold text-[#ccff00] mb-1">
//                     +${performanceData.yearChange.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-400">+{performanceData.yearChangePercent}%</div>
//                 </div>
//               </div>
//             </div>

//             {/* Activity Metrics */}
//             <div className="bg-black border border-gray-800 p-6">
//               <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
//                 <Activity className="w-5 h-5 text-[#ccff00]" />
//                 Activity Metrics
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div className="bg-gray-900/50 border border-gray-800 p-4">
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
//                     Total Transactions
//                   </div>
//                   <div className="text-3xl font-bold text-white">{performanceData.totalTransactions}</div>
//                 </div>
//                 <div className="bg-gray-900/50 border border-gray-800 p-4">
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Active Days</div>
//                   <div className="text-3xl font-bold text-white">{performanceData.activeDays}</div>
//                 </div>
//                 <div className="bg-gray-900/50 border border-gray-800 p-4">
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Active Protocols</div>
//                   <div className="text-3xl font-bold text-white">{performanceData.activeProtocols}</div>
//                 </div>
//                 <div className="bg-gray-900/50 border border-gray-800 p-4">
//                   <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Total Gas Spent</div>
//                   <div className="text-3xl font-bold text-red-400">${performanceData.totalGasSpent}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Historical Performance */}
//             <div className="bg-black border border-gray-800 p-6">
//               <h2 className="text-xl font-bold font-['Orbitron'] mb-6 flex items-center gap-2">
//                 <Award className="w-5 h-5 text-[#ccff00]" />
//                 Historical Milestones
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-900/50 border border-gray-800 p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <TrendingUp className="w-6 h-6 text-[#ccff00]" />
//                     <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">All-Time High</div>
//                   </div>
//                   <div className="text-3xl font-bold text-white mb-2">
//                     ${performanceData.allTimeHigh.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-400">
//                     Current:{" "}
//                     {(
//                       ((performanceData.totalValue + performanceData.nftValue) / performanceData.allTimeHigh) *
//                       100
//                     ).toFixed(2)}
//                     % of ATH
//                   </div>
//                 </div>
//                 <div className="bg-gray-900/50 border border-gray-800 p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <TrendingDown className="w-6 h-6 text-red-400" />
//                     <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">All-Time Low</div>
//                   </div>
//                   <div className="text-3xl font-bold text-white mb-2">
//                     ${performanceData.allTimeLow.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-gray-400">
//                     Growth:{" "}
//                     {(
//                       ((performanceData.totalValue + performanceData.nftValue - performanceData.allTimeLow) /
//                         performanceData.allTimeLow) *
//                       100
//                     ).toFixed(2)}
//                     % from ATL
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Overview Tab - Default */}
//         {activeTab === "overview" && (
//           <div className="space-y-8">
//             {/* Top Tokens */}
//             <div className="bg-black border border-gray-800">
//               <div className="p-6 border-b border-gray-800 flex items-center justify-between">
//                 <h2 className="text-xl font-bold font-['Orbitron']">Top Holdings</h2>
//                 <button
//                   onClick={() => setActiveTab("tokens")}
//                   className="text-sm text-[#ccff00] hover:text-[#b3e600] transition-colors flex items-center gap-1"
//                 >
//                   View All <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {tokens.slice(0, 5).map((token, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between p-3 hover:bg-gray-900/30 rounded-lg transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900">
//                         <token.IconComponent variant="branded" size={20} />
//                       </div>
//                       <div>
//                         <div className="text-sm font-bold">{token.symbol}</div>
//                         <div className="text-xs text-gray-600">{token.name}</div>
//                       </div>
//                     </div>
//                     <span className={`text-xs font-bold ${token.change24h >= 0 ? "text-[#ccff00]" : "text-red-500"}`}>
//                       {token.change24h >= 0 ? "+" : ""}
//                       {token.change24h}%
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Protocol Summary */}
//             <div className="bg-black border border-gray-800">
//               <div className="p-6 border-b border-gray-800 flex items-center justify-between">
//                 <h2 className="text-xl font-bold font-['Orbitron']">Protocol Positions</h2>
//                 <button
//                   onClick={() => setActiveTab("protocols")}
//                   className="text-sm text-[#ccff00] hover:text-[#b3e600] transition-colors flex items-center gap-1"
//                 >
//                   View All <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-6 space-y-4">
//                 {protocols.slice(0, 3).map((protocol, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between p-3 hover:bg-gray-900/30 rounded-lg transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-900">
//                         <protocol.IconComponent variant="branded" size={22} />
//                       </div>
//                       <div>
//                         <div className="text-sm font-bold">{protocol.name}</div>
//                         <div className="text-xs text-gray-600">{protocol.chain}</div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       {/* Updated to show TVL */}
//                       <div className="text-lg font-bold">
//                         $
//                         {protocol.liquidity?.toLocaleString() ??
//                           protocol.supplied?.toLocaleString() ??
//                           protocol.position?.toLocaleString() ??
//                           "0"}
//                       </div>
//                       {/* Display earned/fees */}
//                       <div className="text-xs text-[#ccff00]">
//                         +${(protocol.fees24h ?? protocol.apy ?? 0).toLocaleString()} earned
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* NFT Preview */}
//             <div className="bg-black border border-gray-800">
//               <div className="p-6 border-b border-gray-800 flex items-center justify-between">
//                 <h2 className="text-xl font-bold font-['Orbitron']">NFT Collection</h2>
//                 <button
//                   onClick={() => setActiveTab("nfts")}
//                   className="text-sm text-[#ccff00] hover:text-[#b3e600] transition-colors flex items-center gap-1"
//                 >
//                   View All <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {nfts.slice(0, 4).map((nft, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-gray-900/50 border border-gray-800 hover:border-[#ccff00]/30 transition-all group cursor-pointer"
//                   >
//                     <div className="aspect-square relative overflow-hidden">
//                       <img
//                         src={nft.image || "/placeholder.svg"}
//                         alt={`${nft.collection} ${nft.tokenId}`}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                     </div>
//                     <div className="p-3">
//                       <div className="text-xs font-bold mb-1 truncate">{nft.collection}</div>
//                       <div className="text-xs text-gray-600">{nft.floorPrice} ETH</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
