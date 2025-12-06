import Link from "next/link"
import Navbar from "@/components/navbar"
import { ArrowLeft, BookOpen, Clock } from "lucide-react"

export default function MEVProtectionArticle() {
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
            Advanced Security
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-['Orbitron'] mb-6">MEV Protection Strategies</h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-12 pb-8 border-b border-gray-900">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>18 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Updated Dec 2025</span>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Maximal Extractable Value (MEV) can significantly impact strategy performance. Learn how to protect your
              transactions from front-running, sandwich attacks, and other MEV exploits.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Understanding MEV</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              MEV refers to profit extracted by reordering, inserting, or censoring transactions within blocks.
              Sophisticated bots monitor the mempool for profitable opportunities, often at the expense of regular
              users.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Protection Mechanisms</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Stratos integrates Flashbots Protect for private transaction submission. Your transactions bypass the
              public mempool entirely, preventing front-running and sandwich attacks while maintaining execution
              guarantees.
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-3 mb-6">
              <li>Private transaction routing through trusted relayers</li>
              <li>MEV-aware slippage protection with dynamic thresholds</li>
              <li>Transaction simulation before submission</li>
              <li>Revert protection to avoid failed transaction costs</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  )
}
