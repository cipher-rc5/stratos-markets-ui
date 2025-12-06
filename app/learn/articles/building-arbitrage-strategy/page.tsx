import Link from "next/link"
import Navbar from "@/components/navbar"
import { ArrowLeft, BookOpen, Clock } from "lucide-react"

export default function ArbitrageStrategyArticle() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <article className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-[#ccff00] hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Learn
          </Link>

          <div className="inline-block border border-[#ccff00]/30 bg-[#ccff00]/5 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-6">
            Intermediate Guide
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-['Orbitron'] mb-6">
            Building Your First Arbitrage Strategy
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-12 pb-8 border-b border-gray-900">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>12 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Updated Dec 2025</span>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Arbitrage opportunities exist when the same asset trades at different prices across venues. Learn how to
              identify and execute profitable arbitrage strategies using Stratos's multi-venue execution engine.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Types of Arbitrage</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Cross-exchange arbitrage exploits price differences between centralized and decentralized exchanges.
              Triangular arbitrage identifies pricing inefficiencies across three or more trading pairs. Flash loan
              arbitrage uses borrowed capital to capture opportunities without upfront investment.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Building the Strategy</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Start by monitoring price feeds from multiple sources. Implement logic to calculate profitability after
              accounting for gas costs, slippage, and exchange fees. Use Stratos's flow editor to compose conditional
              execution paths that trigger only when thresholds are met.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Risk Considerations</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-3 mb-6">
              <li>Transaction timing and mempool monitoring are critical for execution</li>
              <li>Gas price volatility can eliminate thin margins instantly</li>
              <li>Front-running and MEV bots compete for the same opportunities</li>
              <li>Smart contract risk increases with flash loan complexity</li>
            </ul>

            <div className="bg-[#ccff00]/5 border border-[#ccff00]/30 p-6 mt-12">
              <h3 className="text-[#ccff00] font-bold mb-3 text-sm uppercase tracking-wide">Pro Tip</h3>
              <p className="text-gray-400 text-sm">
                Combine arbitrage logic with MEV protection using Flashbots integration. This ensures your transactions
                execute privately without exposing strategy details to competitors.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
