import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../../components/navbar';

export default function GasOptimizationArticle() {
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
            Advanced Technique
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-['Orbitron'] mb-6">Optimizing Gas Efficiency</h1>

          <div className='flex items-center gap-6 text-sm text-gray-500 mb-12 pb-8 border-b border-gray-900'>
            <div className='flex items-center gap-2'>
              <Clock size={16} />
              <span>15 min read</span>
            </div>
            <div className='flex items-center gap-2'>
              <BookOpen size={16} />
              <span>Updated Dec 2025</span>
            </div>
          </div>

          <div className='prose prose-invert prose-lg max-w-none'>
            <p className='text-gray-400 text-lg leading-relaxed mb-6'>
              Gas costs can make or break strategy profitability in DeFi. Master gas optimization techniques to maximize net returns and
              execute more efficiently.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Batch Transactions</h2>
            <p className='text-gray-400 leading-relaxed mb-6'>
              Combine multiple operations into single transactions using multicall patterns. Stratos automatically optimizes transaction
              batching for compatible operations, reducing total gas costs by up to 40%.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Gas Price Strategies</h2>
            <p className='text-gray-400 leading-relaxed mb-6'>
              Monitor network congestion and adjust gas prices dynamically. Use EIP-1559 effectively by setting appropriate base fees and
              priority tips. Implement time-based execution to avoid peak congestion periods.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
