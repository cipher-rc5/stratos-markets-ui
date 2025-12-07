import Navbar from '@/components/navbar';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RiskManagementArticle() {
  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />

      <article className='pt-32 pb-20 px-6 md:px-12'>
        <div className='max-w-4xl mx-auto'>
          <Link href='/learn' className='inline-flex items-center gap-2 text-[#ccff00] hover:text-white transition-colors mb-8 text-sm'>
            <ArrowLeft size={16} />
            Back to Learn
          </Link>

          <div className='inline-block border border-[#ccff00]/30 bg-[#ccff00]/5 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-6'>
            Essential Knowledge
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-['Orbitron'] mb-6">Risk Management Best Practices</h1>

          <div className='flex items-center gap-6 text-sm text-gray-500 mb-12 pb-8 border-b border-gray-900'>
            <div className='flex items-center gap-2'>
              <Clock size={16} />
              <span>10 min read</span>
            </div>
            <div className='flex items-center gap-2'>
              <BookOpen size={16} />
              <span>Updated Dec 2025</span>
            </div>
          </div>

          <div className='prose prose-invert prose-lg max-w-none'>
            <p className='text-gray-400 text-lg leading-relaxed mb-6'>
              Effective risk management separates successful traders from those who blow up their portfolios. Learn how to implement robust
              risk controls in your Stratos strategies.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Position Sizing</h2>
            <p className='text-gray-400 leading-relaxed mb-6'>
              Never risk more than 1-2% of your portfolio on a single trade. Use Stratos's dynamic position sizing nodes to automatically
              calculate appropriate trade sizes based on your risk tolerance and current portfolio value.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Stop Losses and Take Profits</h2>
            <p className='text-gray-400 leading-relaxed mb-6'>
              Implement automated stop losses to limit downside exposure. Set take profit targets to lock in gains and remove emotional
              decision-making from the equation. Use trailing stops for trending markets.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Portfolio Diversification</h2>
            <ul className='list-disc list-inside text-gray-400 space-y-3 mb-6'>
              <li>Spread capital across multiple uncorrelated strategies</li>
              <li>Limit exposure to any single asset or protocol</li>
              <li>Balance high-risk/high-reward with stable yield strategies</li>
              <li>Monitor correlation metrics between strategy components</li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
