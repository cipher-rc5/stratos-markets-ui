"use client"

import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-900 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/stratos-rook.svg" alt="Stratos" width={32} height={32} className="invert" />
            <Image src="/stratos-logo.svg" alt="Stratos" width={120} height={32} />
          </Link>

          <div className="hidden md:flex items-center gap-12 text-xs font-medium uppercase tracking-widest">
            <Link href="/agents" className="hover:text-[#ccff00] transition-colors">
              Agents
            </Link>
            <Link href="/create" className="hover:text-[#ccff00] transition-colors">
              Create
            </Link>
            <Link href="/learn" className="text-[#ccff00]">
              Learn
            </Link>
          </div>

          <Link
            href="/"
            className="bg-[#ccff00] text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#b8e600] transition-colors"
          >
            Launch
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <div className="inline-block border border-red-900/30 bg-red-950/20 px-4 py-1 text-[10px] font-mono text-red-400 uppercase tracking-widest mb-8">
              ● KNOWLEDGE BASE: ACTIVE
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6">
              Master <span className="text-[#ccff00]">DeFi</span> Strategy
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              From fundamentals to advanced execution. Learn how to build, deploy, and monetize autonomous trading
              strategies.
            </p>
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full bg-black border border-gray-800 px-6 py-4 text-sm text-white placeholder-gray-600 focus:border-[#ccff00] focus:outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Getting Started",
                description: "Core concepts, platform navigation, and your first strategy deployment.",
                lessons: 12,
                duration: "2h 30m",
                level: "Beginner",
              },
              {
                title: "Strategy Development",
                description: "Build sophisticated strategies using the visual flow editor and custom logic.",
                lessons: 18,
                duration: "5h 15m",
                level: "Intermediate",
              },
              {
                title: "Advanced Execution",
                description: "Optimize performance, manage risk, and scale your strategy portfolio.",
                lessons: 24,
                duration: "8h 45m",
                level: "Advanced",
              },
            ].map((path, i) => (
              <div
                key={i}
                className="bg-black border border-gray-900 p-8 hover:border-[#ccff00]/50 transition-all group cursor-pointer"
              >
                <div className="text-[10px] text-[#ccff00] font-mono uppercase tracking-widest mb-4">{path.level}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#ccff00] transition-colors">{path.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{path.description}</p>
                <div className="flex items-center gap-6 text-xs text-gray-600 uppercase tracking-wider">
                  <span>{path.lessons} Lessons</span>
                  <span>{path.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "API Reference", count: 142 },
              { title: "Strategy Templates", count: 48 },
              { title: "Integration Guides", count: 23 },
              { title: "Video Tutorials", count: 67 },
              { title: "Best Practices", count: 31 },
              { title: "Troubleshooting", count: 89 },
              { title: "Security", count: 15 },
              { title: "Community", count: 234 },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-black border border-gray-900 p-6 hover:border-[#ccff00]/50 transition-all cursor-pointer group"
              >
                <h4 className="text-sm font-bold mb-2 group-hover:text-[#ccff00] transition-colors">{cat.title}</h4>
                <p className="text-xs text-gray-600 uppercase tracking-wider">{cat.count} Articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Popular Articles</h2>
          <div className="space-y-4">
            {[
              "Understanding DeFi Liquidity Pools",
              "Building Your First Arbitrage Strategy",
              "Risk Management Best Practices",
              "Optimizing Gas Efficiency",
              "MEV Protection Strategies",
            ].map((article, i) => (
              <div
                key={i}
                className="bg-black border border-gray-900 p-6 hover:border-[#ccff00]/50 transition-all cursor-pointer group flex items-center justify-between"
              >
                <h4 className="text-sm group-hover:text-[#ccff00] transition-colors">{article}</h4>
                <span className="text-xs text-gray-600">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
