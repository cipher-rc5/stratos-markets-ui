"use client"

import Link from "next/link"
import Image from "next/image"
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react"

export default function SecurityPage() {
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
            <div className="inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-8">
              ● SECURITY: VERIFIED
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6">
              Security <span className="text-[#ccff00]">First</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Your assets and data are protected by institutional-grade security measures. Learn about our approach to
              keeping your strategies and funds safe.
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: "Smart Contract Audits",
                description:
                  "All strategy contracts undergo rigorous third-party security audits before deployment to the marketplace.",
              },
              {
                icon: Lock,
                title: "Non-Custodial Architecture",
                description:
                  "You maintain complete control of your assets. Stratos never has access to your private keys or funds.",
              },
              {
                icon: Eye,
                title: "Real-Time Monitoring",
                description:
                  "Continuous monitoring of all deployed strategies with automatic circuit breakers for anomalous behavior.",
              },
              {
                icon: AlertTriangle,
                title: "Bug Bounty Program",
                description:
                  "We reward security researchers who responsibly disclose vulnerabilities through our bug bounty program.",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-black border border-gray-900 p-8 hover:border-[#ccff00]/50 transition-all">
                <feature.icon className="w-8 h-8 text-[#ccff00] mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Security Best Practices</h2>
          <div className="space-y-6">
            {[
              {
                title: "Strategy Verification",
                description: "All strategies are verified and audited before appearing in the marketplace.",
              },
              {
                title: "Encrypted Communications",
                description: "All data transmission is encrypted using industry-standard TLS protocols.",
              },
              {
                title: "Access Controls",
                description: "Multi-signature requirements for critical platform operations and upgrades.",
              },
              {
                title: "Incident Response",
                description: "24/7 security operations center with automated incident detection and response.",
              },
            ].map((practice, i) => (
              <div key={i} className="bg-black border border-gray-900 p-6">
                <h4 className="text-sm font-bold mb-2">{practice.title}</h4>
                <p className="text-gray-500 text-sm">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-6">Report a Security Issue</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            If you discover a security vulnerability, please report it to security@stratos.io. We appreciate responsible
            disclosure and will respond promptly to all reports.
          </p>
          <a
            href="mailto:security@stratos.io"
            className="inline-block bg-[#ccff00] text-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#b8e600] transition-colors"
          >
            Contact Security Team
          </a>
        </div>
      </section>
    </div>
  )
}
