"use client"

import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-900 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/stratos-rook.svg" alt="Stratos" width={32} height={32} className="invert" />
            <Image src="/stratos-logo.svg" alt="Stratos" width={120} height={32} />
          </Link>
          <Link
            href="/"
            className="bg-[#ccff00] text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#b8e600] transition-colors"
          >
            Launch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6">
              About <span className="text-[#ccff00]">Stratos</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Stratos defines the intersection of high-stakes strategy and digital ownership. We're building the future
              of autonomous trading, where institutional-grade tools meet decentralized accessibility.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Democratize Alpha",
                description:
                  "Make institutional-quality trading strategies accessible to everyone through verified, executable logic.",
              },
              {
                title: "Empower Creators",
                description:
                  "Enable strategy developers to monetize their expertise and build sustainable businesses on-chain.",
              },
              {
                title: "Secure Innovation",
                description:
                  "Provide the infrastructure for safe, audited, and transparent strategy execution at scale.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-black border border-gray-900 p-8">
                <h3 className="text-xl font-bold mb-4 text-[#ccff00]">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Core Values</h2>
          <div className="space-y-6">
            {[
              "Transparency: All strategies are verified, audited, and fully transparent.",
              "Security: Non-custodial architecture ensures you always control your assets.",
              "Community: Built by traders, for traders, with aligned incentives.",
              "Innovation: Pushing the boundaries of what's possible in DeFi automation.",
            ].map((value, i) => (
              <div key={i} className="bg-black border border-gray-900 p-6">
                <p className="text-gray-400">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
