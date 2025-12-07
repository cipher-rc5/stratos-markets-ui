'use client';

import Navbar from '@/components/navbar';
import { BookOpen, Code, Search, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const learningPaths = [{
  title: 'Getting Started',
  description: 'Core concepts, platform navigation, and your first strategy deployment.',
  lessons: 12,
  duration: '2h 30m',
  level: 'Beginner',
  steps: [{
    icon: BookOpen,
    title: 'Platform Overview',
    description: 'Understand Stratos architecture, key components, and how institutional-grade tools democratize access.'
  }, {
    icon: Code,
    title: 'Create Your Account',
    description: 'Set up your wallet integration, configure authentication, and connect to your preferred blockchain networks.'
  }, {
    icon: Zap,
    title: 'Build First Strategy',
    description: 'Use the visual flow editor to compose a simple DCA strategy. Deploy and monitor real-time execution.'
  }, {
    icon: Shield,
    title: 'Deploy & Monitor',
    description: 'Learn deployment best practices, set up alerts, and track performance metrics in the dashboard.'
  }]
}, {
  title: 'Strategy Development',
  description: 'Build sophisticated strategies using the visual flow editor and custom logic.',
  lessons: 18,
  duration: '5h 15m',
  level: 'Intermediate',
  steps: [{
    icon: Code,
    title: 'Advanced Node Composition',
    description: 'Master complex node graphs with conditional logic, loops, and multi-chain execution paths.'
  }, {
    icon: Zap,
    title: 'Custom Indicators',
    description: 'Build proprietary technical indicators using historical data feeds and real-time market signals.'
  }, {
    icon: BookOpen,
    title: 'Backtesting Framework',
    description: 'Test strategies against historical data, optimize parameters, and validate performance assumptions.'
  }, {
    icon: Shield,
    title: 'Risk Parameters',
    description: 'Configure position sizing, stop losses, drawdown limits, and portfolio-level risk management rules.'
  }]
}, {
  title: 'Advanced Execution',
  description: 'Optimize performance, manage risk, and scale your strategy portfolio.',
  lessons: 24,
  duration: '8h 45m',
  level: 'Advanced',
  steps: [{
    icon: Zap,
    title: 'MEV Protection',
    description: 'Implement flashbots integration, private transaction routing, and sandwich attack mitigation strategies.'
  }, {
    icon: Code,
    title: 'Multi-Strategy Portfolios',
    description: 'Compose multiple strategies with dynamic capital allocation, correlation analysis, and rebalancing logic.'
  }, {
    icon: Shield,
    title: 'Enterprise Deployment',
    description: 'White-label marketplace setup, dedicated SLAs, encrypted execution environments, and institutional custody.'
  }, {
    icon: BookOpen,
    title: 'Monetization Models',
    description: 'Configure subscription tiers, performance-based fees, and creator economy revenue sharing mechanisms.'
  }]
}];

export default function LearnPage() {
  const [expandedPath, setExpandedPath] = useState<number | null>(null);

  const togglePath = (index: number) => {
    setExpandedPath(expandedPath === index ? null : index);
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />

      <section className='pt-32 pb-20 px-6 md:px-12'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='max-w-3xl'>
            <div className='inline-block border border-red-900/30 bg-red-950/20 px-4 py-1 text-[10px] font-mono text-red-400 uppercase tracking-widest mb-8'>
              ● KNOWLEDGE BASE: ACTIVE
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6">
              Master <span className='text-[#ccff00]'>DeFi</span> Strategy
            </h1>
            <p className='text-gray-400 text-lg leading-relaxed mb-8'>
              From fundamentals to advanced execution. Learn how to build, deploy, and monetize autonomous trading strategies.
            </p>
            <div className='relative max-w-xl'>
              <input
                type='text'
                placeholder='Search documentation...'
                className='w-full bg-black border border-gray-800 px-6 py-4 text-sm text-white placeholder-gray-600 focus:border-[#ccff00] focus:outline-none' />
              <Search className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600' />
            </div>
          </div>
        </div>
      </section>

      <section className='py-20 px-6 md:px-12 bg-gradient-to-b from-black to-gray-950'>
        <div className='max-w-[1400px] mx-auto'>
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Learning Paths</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {learningPaths.map((path, i) => (
              <div key={i} className='bg-black border border-gray-900 hover:border-[#ccff00]/50 transition-all'>
                <div
                  className='p-8 cursor-pointer'
                  onClick={() => togglePath(i)}>
                  <div className='text-[10px] text-[#ccff00] font-mono uppercase tracking-widest mb-4'>{path.level}</div>
                  <h3 className='text-xl font-bold mb-3 group-hover:text-[#ccff00] transition-colors'>{path.title}</h3>
                  <p className='text-gray-500 text-sm mb-6 leading-relaxed'>{path.description}</p>
                  <div className='flex items-center gap-6 text-xs text-gray-600 uppercase tracking-wider'>
                    <span>{path.lessons} Lessons</span>
                    <span>{path.duration}</span>
                  </div>
                </div>

                {expandedPath === i && (
                  <div className='border-t border-gray-900 bg-[#0a0a0a] p-6'>
                    <div className='relative'>
                      {path.steps.map((step, stepIndex) => {
                        const Icon = step.icon;
                        const isLast = stepIndex === path.steps.length - 1;
                        return (
                          <div key={stepIndex} className='relative flex gap-4 pb-8 last:pb-0'>
                            {!isLast && (
                              <div className='absolute left-5 top-10 bottom-0 w-[2px] bg-gradient-to-b from-[#ccff00] to-gray-800' />
                            )}

                            <div className='relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#ccff00] bg-black flex items-center justify-center'>
                              <Icon className='w-5 h-5 text-[#ccff00]' />
                            </div>

                            <div className='flex-1 pt-1'>
                              <h4 className='text-[#ccff00] font-bold text-sm uppercase tracking-wide mb-2'>{step.title}</h4>
                              <p className='text-gray-400 text-xs leading-relaxed'>{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 px-6 md:px-12'>
        <div className='max-w-[1400px] mx-auto'>
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Documentation</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              { title: 'API Reference', count: 142, link: '/learn/api-reference' },
              { title: 'Strategy Templates', count: 48, link: '/learn/strategy-templates' },
              { title: 'Integration Guides', count: 23, link: '/learn/integration-guides' },
              { title: 'Video Tutorials', count: 67, link: '/learn/video-tutorials' },
              { title: 'Best Practices', count: 31, link: '/learn/best-practices' },
              { title: 'Troubleshooting', count: 89, link: '/learn/troubleshooting' },
              { title: 'Security', count: 15, link: '/learn/security' },
              { title: 'Community', count: 234, link: '/learn/community' }
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.link}
                className='bg-black border border-gray-900 p-6 hover:border-[#ccff00]/50 transition-all cursor-pointer group'>
                <h4 className='text-sm font-bold mb-2 group-hover:text-[#ccff00] transition-colors'>{cat.title}</h4>
                <p className='text-xs text-gray-600 uppercase tracking-wider'>{cat.count} Articles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 px-6 md:px-12 bg-gradient-to-b from-gray-950 to-black'>
        <div className='max-w-[1400px] mx-auto'>
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Popular Articles</h2>
          <div className='space-y-4'>
            {[
              { title: 'Understanding DeFi Liquidity Pools', link: '/learn/articles/understanding-liquidity-pools' },
              { title: 'Building Your First Arbitrage Strategy', link: '/learn/articles/building-arbitrage-strategy' },
              { title: 'Risk Management Best Practices', link: '/learn/articles/risk-management' },
              { title: 'Optimizing Gas Efficiency', link: '/learn/articles/gas-optimization' },
              { title: 'MEV Protection Strategies', link: '/learn/articles/mev-protection' }
            ].map((article, i) => (
              <Link
                key={i}
                href={article.link}
                className='bg-black border border-gray-900 p-6 hover:border-[#ccff00]/50 transition-all cursor-pointer group flex items-center justify-between'>
                <h4 className='text-sm group-hover:text-[#ccff00] transition-colors'>{article.title}</h4>
                <span className='text-xs text-gray-600 group-hover:text-[#ccff00] transition-colors'>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
