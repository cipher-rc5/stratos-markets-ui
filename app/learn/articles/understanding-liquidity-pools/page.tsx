import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../../components/navbar';

export default function LiquidityPoolsArticle() {
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
            Beginner Guide
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-['Orbitron'] mb-6">Understanding DeFi Liquidity Pools</h1>

          <div className='flex items-center gap-6 text-sm text-gray-500 mb-12 pb-8 border-b border-gray-900'>
            <div className='flex items-center gap-2'>
              <Clock size={16} />
              <span>8 min read</span>
            </div>
            <div className='flex items-center gap-2'>
              <BookOpen size={16} />
              <span>Updated Dec 2025</span>
            </div>
          </div>

          <div className='prose prose-invert prose-lg max-w-none'>
            <p className='text-gray-400 text-lg leading-relaxed mb-6'>
              Liquidity pools are the backbone of decentralized finance, enabling automated market making without traditional order books.
              Understanding how they work is essential for building effective DeFi strategies.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">What Are Liquidity Pools?</h2>
            <p className='text-gray-400 leading-relaxed mb-6'>
              A liquidity pool is a smart contract that holds reserves of two or more tokens. These pools facilitate decentralized trading
              by automatically determining exchange rates based on the ratio of tokens in the pool, following the constant product formula:
              x * y = k.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">How They Work</h2>
            <p className='text-gray-400 leading-relaxed mb-6'>
              When traders want to swap tokens, they interact with the liquidity pool smart contract. The contract calculates the exchange
              rate based on the current pool reserves and executes the trade, adjusting the pool balance accordingly. Liquidity providers
              earn fees from these trades proportional to their share of the pool.
            </p>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Key Concepts</h2>
            <ul className='list-disc list-inside text-gray-400 space-y-3 mb-6'>
              <li>Automated Market Makers (AMMs) use mathematical formulas to price assets</li>
              <li>Impermanent Loss occurs when token prices diverge from when you deposited</li>
              <li>LP Tokens represent your share of the liquidity pool</li>
              <li>Slippage increases with larger trades relative to pool size</li>
            </ul>

            <h2 className="text-2xl font-bold font-['Orbitron'] text-white mt-12 mb-4">Strategy Implications</h2>
            <p className='text-gray-400 leading-relaxed mb-6'>
              When building trading strategies on Stratos, consider liquidity depth, trading volume, and fee tiers. Monitor pool health
              metrics and adjust position sizes to minimize slippage while maximizing execution efficiency.
            </p>

            <div className='bg-[#ccff00]/5 border border-[#ccff00]/30 p-6 mt-12'>
              <h3 className='text-[#ccff00] font-bold mb-3 text-sm uppercase tracking-wide'>Next Steps</h3>
              <p className='text-gray-400 text-sm'>
                Ready to build your first liquidity-aware strategy? Check out our strategy templates or start composing in the visual flow
                editor.
              </p>
              <Link href='/create' className='inline-block mt-4 text-[#ccff00] hover:text-white transition-colors text-sm font-bold'>
                Open Strategy Builder →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
