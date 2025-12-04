"use client"

import { useState, useEffect } from "react"
import {
  Menu,
  X,
  TrendingUp,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Activity,
  BarChart3,
  ChevronRight,
  Terminal,
} from "lucide-react"
import Image from "next/image"

// --- Types ---
interface Strategy {
  id: string
  name: string
  description: string
  creator: string
  version: string
  performance: {
    roi: number
    sharpeRatio: number
    maxDrawdown: number
  }
  pricing: {
    type: string
    amount: number
    currency: string
  }
  tags: string[]
  subscribers: number
  createdAt: string
}

// --- Sample Strategy Data ---
const sampleStrategies: Strategy[] = [
  {
    id: "strat_abc123",
    name: "DCA Bitcoin Strategy",
    description: "Automated dollar-cost averaging for BTC with dynamic entry points",
    creator: "0x1234...",
    version: "1.2.0",
    performance: { roi: 24.5, sharpeRatio: 1.8, maxDrawdown: -12.3 },
    pricing: { type: "flat", amount: 100, currency: "USDC" },
    tags: ["DCA", "Bitcoin", "Long-term"],
    subscribers: 342,
    createdAt: "2025-12-03T19:46:25.828Z",
  },
  {
    id: "strat_def456",
    name: "Grid Trading Master",
    description: "Multi-level grid strategy optimized for ranging markets",
    creator: "0x5678...",
    version: "2.1.5",
    performance: { roi: 18.2, sharpeRatio: 2.1, maxDrawdown: -8.7 },
    pricing: { type: "flat", amount: 150, currency: "USDC" },
    tags: ["Grid", "Range", "Stable"],
    subscribers: 527,
    createdAt: "2025-11-15T10:30:15.123Z",
  },
  {
    id: "strat_ghi789",
    name: "Alpha Momentum",
    description: "Trend-following algorithm with volatility filters",
    creator: "0x9abc...",
    version: "3.0.2",
    performance: { roi: 42.8, sharpeRatio: 1.5, maxDrawdown: -18.9 },
    pricing: { type: "flat", amount: 250, currency: "USDC" },
    tags: ["Momentum", "High-risk", "Trending"],
    subscribers: 891,
    createdAt: "2025-10-22T14:22:40.456Z",
  },
  {
    id: "strat_jkl012",
    name: "Mean Reversion Pro",
    description: "Statistical arbitrage on multiple timeframes",
    creator: "0xdef0...",
    version: "1.8.3",
    performance: { roi: 15.6, sharpeRatio: 2.3, maxDrawdown: -6.2 },
    pricing: { type: "flat", amount: 200, currency: "USDC" },
    tags: ["Mean-reversion", "Stats", "Low-volatility"],
    subscribers: 445,
    createdAt: "2025-09-30T08:15:20.789Z",
  },
]

// --- Components ---

const StratosLogo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <Image
      src="/stratos-rook.svg"
      alt="Stratos Rook"
      width={32}
      height={48}
      className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300 brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
    />
    <Image
      src="/stratos-logo.svg"
      alt="STRATOS"
      width={180}
      height={40}
      className="h-6 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
    />
  </div>
)

const NavLink = ({ text, active = false }: { text: string; active?: boolean }) => (
  <a
    href="#"
    className={`text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
      active ? "text-[#ccff00]" : "text-gray-400 hover:text-white"
    }`}
  >
    {text}
  </a>
)

const TerminalInterface = () => {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    const terminalSequence = [
      "> CONNECTING TO STRATOS_MAINNET...",
      "> VERIFYING WALLET SIGNATURE... OK",
      "> FETCHING ALPHA_VECTORS...",
      "// STRATEGY_ID: 0x4a...9f",
      "// YIELD_EST: 24.5%",
      "> AWAITING AGENT DEPLOYMENT...",
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < terminalSequence.length) {
        setLines((prev) => [...prev, terminalSequence[currentIndex]])
        currentIndex++
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2 min-h-[200px]">
      {lines.map((line, idx) => (
        <div key={idx} className={line?.startsWith("//") ? "text-gray-600" : "text-[#ccff00]"}>
          {line}
        </div>
      ))}
    </div>
  )
}

const StrategyCard = ({
  strategy,
  onClick,
}: {
  strategy: Strategy
  onClick: () => void
}) => (
  <div
    onClick={onClick}
    className="group relative border border-gray-800 bg-[#0a0a0a] overflow-hidden hover:border-[#ccff00] transition-colors duration-500 cursor-pointer h-[200px] flex flex-col justify-between"
  >
    {/* Top Info */}
    <div className="p-3 flex justify-between items-start z-10">
      <div className="flex flex-col">
        <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Strategy</span>
        <span className="text-[11px] font-bold text-white tracking-wider">{strategy.name}</span>
      </div>
      <div className="h-2 w-0.5 bg-[#ccff00]/20 group-hover:bg-[#ccff00] transition-colors"></div>
    </div>

    {/* Central Graphic */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="absolute w-24 h-0.5 bg-[#ccff00] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
      <Image
        src="/stratos-rook.svg"
        alt="Stratos Rook"
        width={80}
        height={120}
        className="scale-[0.35] opacity-30 group-hover:opacity-70 group-hover:scale-[0.38] transition-all duration-700 ease-out z-10 brightness-0 invert"
      />
    </div>

    {/* Performance Metrics */}
    <div className="p-3 z-10 mt-auto bg-gradient-to-t from-black to-transparent">
      <div className="border-t border-gray-800 pt-2 group-hover:border-gray-600 transition-colors">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gray-500">ROI:</span>
              <span className={`text-xs font-bold ${strategy.performance.roi > 0 ? "text-[#ccff00]" : "text-red-500"}`}>
                {strategy.performance.roi > 0 ? "+" : ""}
                {strategy.performance.roi}%
              </span>
            </div>
            <div className="text-[9px] text-gray-600">{strategy.subscribers} subscribers</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold text-white">
              {strategy.pricing.amount} {strategy.pricing.currency}
            </div>
            <div className="text-[9px] text-gray-500 mt-0.5">v{strategy.version}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const StrategyDetailModal = ({
  strategy,
  onClose,
}: {
  strategy: Strategy | null
  onClose: () => void
}) => {
  if (!strategy) return null

  return (
    <div className="bg-[#0a0a0a] border border-gray-800 mt-8 animate-in slide-in-from-top duration-300">
      {/* Header */}
      <div className="border-b border-gray-800 p-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{strategy.name}</h2>
          <p className="text-gray-400 text-sm">{strategy.description}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Content Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <span className="text-sm text-gray-400">ROI</span>
                <span
                  className={`text-lg font-bold ${strategy.performance.roi > 0 ? "text-[#ccff00]" : "text-red-500"}`}
                >
                  {strategy.performance.roi > 0 ? "+" : ""}
                  {strategy.performance.roi}%
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <span className="text-sm text-gray-400">Sharpe Ratio</span>
                <span className="text-lg font-bold text-white">{strategy.performance.sharpeRatio}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <span className="text-sm text-gray-400">Max Drawdown</span>
                <span className="text-lg font-bold text-red-500">{strategy.performance.maxDrawdown}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {strategy.tags.map((tag) => (
                <span key={tag} className="text-xs border border-gray-800 px-3 py-1 text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <span className="text-sm text-gray-400">Strategy ID</span>
                <span className="text-sm font-mono text-white">{strategy.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <span className="text-sm text-gray-400">Creator</span>
                <span className="text-sm font-mono text-white">{strategy.creator}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <span className="text-sm text-gray-400">Version</span>
                <span className="text-sm font-mono text-white">{strategy.version}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-2">
                <span className="text-sm text-gray-400">Subscribers</span>
                <span className="text-lg font-bold text-[#ccff00]">{strategy.subscribers}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pricing</h3>
            <div className="bg-[#ccff00] text-black p-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-60">Subscription Fee</div>
                <div className="text-2xl font-bold">
                  {strategy.pricing.amount} {strategy.pricing.currency}
                </div>
              </div>
              <div className="uppercase text-xs font-bold tracking-wider opacity-60">{strategy.pricing.type}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-800 p-6 flex gap-4">
        <button className="flex-1 bg-[#ccff00] hover:bg-white text-black font-bold py-3 uppercase text-sm tracking-wider transition-colors">
          Subscribe Now
        </button>
        <button className="flex-1 border border-gray-800 hover:border-[#ccff00] text-gray-400 hover:text-white font-bold py-3 uppercase text-sm tracking-wider transition-colors">
          View Backtest
        </button>
      </div>
    </div>
  )
}

const FeatureSection = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: any
  title: string
  description: string
  index: number
}) => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.1 * (index % 2 === 0 ? 1 : -1))
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [index])

  return (
    <div
      className="border border-gray-800 bg-[#0a0a0a]/50 p-8 hover:border-[#ccff00]/50 transition-all duration-500"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="w-12 h-12 border border-[#ccff00] flex items-center justify-center mb-6">
        <Icon size={24} className="text-[#ccff00]" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default function StratosPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null)
  const [activeFilter, setActiveFilter] = useState("ALL STRATEGIES")

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white font-rajdhani selection:bg-[#ccff00] selection:text-black">
      {/* --- Navbar --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-md border-gray-800 py-3" : "bg-transparent border-transparent py-4"}`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <StratosLogo />
            <NavLink text="MARKETPLACE" active={true} />
          </div>

          <div className="hidden md:flex items-center gap-12">
            <NavLink text="Agents" />
            <NavLink text="Create" />
            <NavLink text="Learn" />
            <button className="bg-[#ccff00] hover:bg-[#b3e600] text-black text-xs font-bold px-6 py-2.5 tracking-widest uppercase transition-colors">
              Launch
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          <NavLink text="MARKETPLACE" active={true} />
          <NavLink text="Agents" />
          <NavLink text="Create" />
          <NavLink text="Learn" />
          <button className="bg-[#ccff00] text-black text-xs font-bold px-8 py-3 tracking-widest uppercase">
            Launch
          </button>
        </div>
      )}

      {/* --- Hero Section - New hero matching reference image --- */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Neon Lines */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[800px] opacity-20">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <path d="M-100,0 Q500,400 1000,0" fill="none" stroke="#ccff00" strokeWidth="1" className="blur-sm" />
              <path d="M-100,50 Q500,450 1100,0" fill="none" stroke="#ccff00" strokeWidth="2" className="opacity-50" />
              <path d="M0,600 Q800,400 2000,100" fill="none" stroke="white" strokeWidth="0.5" className="opacity-10" />
            </svg>
          </div>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
        </div>

        <div className="max-w-[1920px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Main Text */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 mb-6 border border-[#ccff00]/30 px-3 py-1 bg-[#ccff00]/5">
                <div className="w-2 h-2 bg-[#ccff00] animate-pulse"></div>
                <span className="text-[#ccff00] text-[10px] font-bold uppercase tracking-[0.2em]">
                  System Status: Live V1.0
                </span>
              </div>

              <h1
                className="text-[8vw] lg:text-[6vw] leading-[0.85] font-bold tracking-tighter text-white mix-blend-screen select-none mb-6"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                TRADE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-transparent">
                  DEFI LOGIC
                </span>
                <br />
                AS DATA STREAMS
              </h1>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mt-4">
                <p className="text-gray-400 text-sm md:text-lg max-w-xl tracking-wide border-l border-gray-700 pl-4">
                  Monetize your alpha. Consume institutional quality data. <br />
                  Let AI agents execute the rest.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-12">
                <button className="bg-[#ccff00] hover:bg-white text-black text-sm font-bold px-10 py-4 uppercase tracking-wider transition-colors flex items-center justify-center gap-2 group">
                  Explore Marketplace{" "}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border border-gray-700 hover:border-[#ccff00] text-gray-400 hover:text-[#ccff00] text-sm font-bold px-10 py-4 tracking-wider uppercase transition-all">
                  Start Uploading
                </button>
              </div>
            </div>

            {/* Side Terminal/Graphic */}
            <div className="lg:col-span-4 hidden lg:block opacity-80">
              <div className="border border-gray-800 bg-black p-1">
                <div className="flex justify-between items-center bg-[#111] px-2 py-1 mb-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">TERM_01</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-900"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-900"></div>
                    <div className="w-2 h-2 rounded-full bg-green-900"></div>
                  </div>
                </div>
                <div className="p-4 font-mono text-xs text-[#ccff00] space-y-2 h-[300px] overflow-hidden relative">
                  <TerminalInterface />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Problem/Solution Section --- */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Diagonal lines background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ccff00] to-transparent transform rotate-12"></div>
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ccff00] to-transparent transform -rotate-12"></div>
        </div>

        <div className="max-w-[1400px] mx-auto relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 hidden xl:block">
            <div
              className="text-[80px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-500/20 via-[#ccff00]/30 to-[#ccff00]/20 font-['Orbitron'] leading-none tracking-tighter"
              style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
            >
              STRATOS
            </div>
          </div>

          {/* Problem Section */}
          <div className="mb-20">
            <div className="mb-12">
              <div className="inline-block border border-red-500/30 px-4 py-1.5 mb-6">
                <span className="text-red-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                  System Status: Critical
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Orbitron']">
                Most Are <span className="text-red-500">Unaware</span> of DeFi Mechanics
              </h2>
              <p className="text-gray-400 text-sm tracking-wide max-w-2xl">
                The complexity barrier prevents mainstream adoption. Institutional-grade tools remain inaccessible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat 1 */}
              <div className="relative border border-red-900/20 bg-black p-8 hover:border-red-500/30 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl font-bold text-red-500 mb-4 font-['Orbitron']">87%</div>
                <h3 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Hidden Complexity</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  87% of potential users cite complexity as the primary barrier to DeFi adoption and participation.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="relative border border-red-900/20 bg-black p-8 hover:border-red-500/30 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl font-bold text-red-500 mb-4 font-['Orbitron']">$180B</div>
                <h3 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Untapped Liquidity</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Billions in capital remain on sidelines due to lack of accessible tools and education.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="relative border border-red-900/20 bg-black p-8 hover:border-red-500/30 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-6xl font-bold text-red-500 mb-4 font-['Orbitron']">72hrs</div>
                <h3 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Learning Curve</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Average time required to understand basic DeFi concepts without proper guidance systems.
                </p>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div>
            <div className="mb-12">
              <div className="inline-block border border-[#ccff00]/30 px-4 py-1.5 mb-6">
                <span className="text-[#ccff00] text-[10px] font-bold tracking-[0.2em] uppercase">
                  System Status: Optimized
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Orbitron']">
                Stratos <span className="text-[#ccff00]">Simplifies</span> Access
              </h2>
              <p className="text-gray-400 text-sm tracking-wide max-w-2xl">
                Transform complex DeFi mechanics into executable strategies. No technical expertise required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Solution 1 */}
              <div className="relative border border-[#ccff00]/20 bg-black p-8 hover:border-[#ccff00]/50 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 border border-[#ccff00]/50 flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/10 transition-colors">
                  <Shield size={28} className="text-[#ccff00]" />
                </div>
                <h3 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Pre-Built Strategies</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Access verified, institutional-grade strategies without understanding the underlying code. One-click
                  deployment with full transparency.
                </p>
                <div className="flex items-center gap-2 text-[#ccff00] text-[10px] font-bold tracking-wider">
                  <BarChart3 size={14} />
                  <span>VERIFIED & AUDITED</span>
                </div>
              </div>

              {/* Solution 2 */}
              <div className="relative border border-[#ccff00]/20 bg-black p-8 hover:border-[#ccff00]/50 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 border border-[#ccff00]/50 flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/10 transition-colors">
                  <Zap size={28} className="text-[#ccff00]" />
                </div>
                <h3 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Autonomous Execution</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  AI agents handle complexity automatically. Set parameters once, let the system optimize and execute
                  continuously.
                </p>
                <div className="flex items-center gap-2 text-[#ccff00] text-[10px] font-bold tracking-wider">
                  <Activity size={14} />
                  <span>24/7 OPERATION</span>
                </div>
              </div>

              {/* Solution 3 */}
              <div className="relative border border-[#ccff00]/20 bg-black p-8 hover:border-[#ccff00]/50 transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 border border-[#ccff00]/50 flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/10 transition-colors">
                  <Users size={28} className="text-[#ccff00]" />
                </div>
                <h3 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Learn By Doing</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Build intuition through practical experience. Real-time feedback and transparent performance metrics
                  accelerate understanding.
                </p>
                <div className="flex items-center gap-2 text-[#ccff00] text-[10px] font-bold tracking-wider">
                  <TrendingUp size={14} />
                  <span>INSTANT FEEDBACK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Filter Bar --- */}
      <section className="relative py-8 px-6 border-b border-gray-800">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {["ALL STRATEGIES", "YIELD FARMING", "ARBITRAGE", "MEV", "VERIFIED"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs font-bold tracking-wider uppercase px-6 py-2.5 transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-[#ccff00] text-black"
                      : "bg-transparent border border-gray-800 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="SEARCH_DB"
                  className="bg-transparent border border-gray-800 text-white text-xs font-mono tracking-wider uppercase px-6 py-3 w-full md:w-[300px] focus:border-[#ccff00] focus:outline-none transition-colors placeholder:text-gray-700"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Strategies Marketplace - Single row of strategies with modal details --- */}
      <section className="relative py-20 px-6 bg-black/30">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">MARKETPLACE</h2>
            <p className="text-gray-500 text-sm uppercase tracking-wider">LIVE FEEDS // VERIFIED ALPHA</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleStrategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} onClick={() => setSelectedStrategy(strategy)} />
            ))}
          </div>

          {selectedStrategy && (
            <StrategyDetailModal strategy={selectedStrategy} onClose={() => setSelectedStrategy(null)} />
          )}
        </div>
      </section>

      {/* --- Creator Hub, Enterprise, and Agents Framework Cards --- */}
      <section className="relative py-24 px-6 overflow-hidden bg-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Creator Hub Card */}
            <div className="relative border border-gray-800 bg-black p-10 hover:border-[#ccff00]/50 transition-all duration-300 group">
              <div className="w-12 h-12 flex items-center justify-center mb-8">
                <BarChart3 size={32} className="text-[#ccff00]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-wider uppercase font-['Orbitron']">
                Creator Hub
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Turn scripts into revenue. Wrap in MCP. Set dynamic pricing models. Real-time P&L tracking.
              </p>
              <button className="text-white text-xs font-bold tracking-wider uppercase hover:text-[#ccff00] transition-colors flex items-center gap-2">
                Initiate Upload
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Enterprise Card */}
            <div className="relative border border-gray-800 bg-black p-10 hover:border-[#ccff00]/50 transition-all duration-300 group">
              <div className="w-12 h-12 flex items-center justify-center mb-8">
                <Shield size={32} className="text-[#ccff00]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-wider uppercase font-['Orbitron']">
                Enterprise
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                White-label marketplaces for quant shops. Dedicated SLAs. Encrypted execution environments.
              </p>
              <button className="text-white text-xs font-bold tracking-wider uppercase hover:text-[#ccff00] transition-colors flex items-center gap-2">
                Request Access
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Agents Framework Card */}
            <div className="relative border border-gray-800 bg-black p-10 hover:border-[#ccff00]/50 transition-all duration-300 group">
              <div className="w-12 h-12 flex items-center justify-center mb-8">
                <Terminal size={32} className="text-[#ccff00]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-wider uppercase font-['Orbitron']">
                Agents Framework
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Native SDKs for autonomous agents. Compose strategies programmatically. Go, Python, JS.
              </p>
              <button className="text-white text-xs font-bold tracking-wider uppercase hover:text-[#ccff00] transition-colors flex items-center gap-2">
                View Documentation
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Large Vertical STRATOS Divider --- */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          
        </div>
      </section>

      {/* --- Ready to Launch CTA --- */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ccff00]/5 to-transparent"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <span className="text-[#ccff00]">Launch?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Join thousands of traders and creators building the future of decentralized finance
          </p>
          <button className="bg-[#ccff00] hover:bg-white text-black text-sm font-bold px-12 py-5 uppercase tracking-wider transition-colors">
            Get Started Now
          </button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-gray-900 bg-black pt-20 pb-10">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <StratosLogo />
              <p className="mt-6 text-gray-500 text-xs leading-relaxed max-w-xs">
                Stratos defines the intersection of high-stakes strategy and digital ownership. Secured by the
                blockchain, powered by vision.
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-500 text-xs uppercase tracking-wide">
                <li className="hover:text-[#ccff00] cursor-pointer transition-colors">Agents</li>
                <li className="hover:text-[#ccff00] cursor-pointer transition-colors">Create</li>
                <li className="hover:text-[#ccff00] cursor-pointer transition-colors">Marketplace</li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500 text-xs uppercase tracking-wide">
                <li className="hover:text-[#ccff00] cursor-pointer transition-colors">About Stratos</li>
                <li className="hover:text-[#ccff00] cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-[#ccff00] cursor-pointer transition-colors">Legal</li>
              </ul>
            </div>

            <div className="col-span-1 flex flex-col gap-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Join the Network</h4>
              <div className="flex gap-4">
                <div className="h-10 w-10 border border-gray-800 flex items-center justify-center hover:border-[#ccff00] hover:text-[#ccff00] cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </div>
                <div className="h-10 w-10 border border-gray-800 flex items-center justify-center hover:border-[#ccff00] hover:text-[#ccff00] cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.077.077 0 00.041.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
            <span>© 2025 Stratos Inc. All rights reserved.</span>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
