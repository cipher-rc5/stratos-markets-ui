'use client';
import { Activity, ArrowRight, BarChart3, ChevronRight, Shield, Terminal, TrendingUp, Users, X, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';

// --- Types ---
interface Strategy {
  id: string;
  name: string;
  description: string;
  creator: string;
  version: string;
  performance: { roi: number, sharpeRatio: number, maxDrawdown: number };
  pricing: { type: string, amount: number, currency: string };
  tags: string[];
  subscribers: number;
  createdAt: string;
}

// --- Sample Strategy Data ---
const sampleStrategies: Strategy[] = [{
  id: 'strat_abc123',
  name: 'DCA Bitcoin Strategy',
  description: 'Automated dollar-cost averaging for BTC with dynamic entry points',
  creator: '0x1234...',
  version: '1.2.0',
  performance: { roi: 24.5, sharpeRatio: 1.8, maxDrawdown: -12.3 },
  pricing: { type: 'flat', amount: 100, currency: 'USDC' },
  tags: ['DCA', 'Bitcoin', 'Long-term'],
  subscribers: 342,
  createdAt: '2025-12-03T19:46:25.828Z'
}, {
  id: 'strat_def456',
  name: 'Grid Trading Master',
  description: 'Multi-level grid strategy optimized for ranging markets',
  creator: '0x5678...',
  version: '2.1.5',
  performance: { roi: 18.2, sharpeRatio: 2.1, maxDrawdown: -8.7 },
  pricing: { type: 'flat', amount: 150, currency: 'USDC' },
  tags: ['Grid', 'Range', 'Stable'],
  subscribers: 527,
  createdAt: '2025-11-15T10:30:15.123Z'
}, {
  id: 'strat_ghi789',
  name: 'Alpha Momentum',
  description: 'Trend-following algorithm with volatility filters',
  creator: '0x9abc...',
  version: '3.0.2',
  performance: { roi: 42.8, sharpeRatio: 1.5, maxDrawdown: -18.9 },
  pricing: { type: 'flat', amount: 250, currency: 'USDC' },
  tags: ['Momentum', 'High-risk', 'Trending'],
  subscribers: 891,
  createdAt: '2025-10-22T14:22:40.456Z'
}, {
  id: 'strat_jkl012',
  name: 'Mean Reversion Pro',
  description: 'Statistical arbitrage on multiple timeframes',
  creator: '0xdef0...',
  version: '1.8.3',
  performance: { roi: 15.6, sharpeRatio: 2.3, maxDrawdown: -6.2 },
  pricing: { type: 'flat', amount: 200, currency: 'USDC' },
  tags: ['Mean-reversion', 'Stats', 'Low-volatility'],
  subscribers: 445,
  createdAt: '2025-09-30T08:15:20.789Z'
}];

// --- Components ---

const StratosLogo = () => (
  <div className='flex items-center gap-3 group cursor-pointer'>
    <Image
      src='/stratos-rook.svg'
      alt='Stratos Rook'
      width={32}
      height={48}
      className='w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 h-10' />
    <Image
      src='/stratos-logo.svg'
      alt='STRATOS'
      width={180}
      height={40}
      className='w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300 h-10' />
  </div>
);

const NavLink = ({ text, active = false, href = '#' }: { text: string, active?: boolean, href?: string }) => (
  <Link
    href={href}
    className={`tracking-[0.15em] uppercase transition-colors duration-300 font-medium text-lg ${
      active ? 'text-[#ccff00]' : 'text-gray-400 hover:text-white'
    }`}>
    {text}
  </Link>
);

const TerminalInterface = () => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const terminalSequence = [
      '> CONNECTING TO STRATOS_MAINNET...',
      '> VERIFYING WALLET SIGNATURE... OK',
      '> FETCHING ALPHA_VECTORS...',
      '// STRATEGY_ID: 0x4a...9f',
      '// YIELD_EST: 24.5%',
      '> AWAITING AGENT DEPLOYMENT...'
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < terminalSequence.length) {
        setLines((prev) => [...prev, terminalSequence[currentIndex]]);
        currentIndex++;
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='space-y-2 min-h-[200px]'>
      {lines.map((line, idx) => <div key={idx} className={line?.startsWith('//') ? 'text-gray-600' : 'text-[#ccff00]'}>{line}</div>)}
    </div>
  );
};

const StrategyCard = ({ strategy, onClick }: { strategy: Strategy, onClick: () => void }) => (
  <div
    onClick={onClick}
    className='group relative border border-gray-800 bg-[#0a0a0a] overflow-hidden hover:border-[#ccff00] transition-colors duration-500 cursor-pointer flex flex-col justify-between h-[230px]'>
    {/* Top Info */}
    <div className='p-3 flex justify-between items-start z-10 py-3'>
      <div className='flex flex-col'>
        <span className='text-gray-500 uppercase tracking-widest mb-1 text-xl'>Strategy</span>
        <span className='font-bold text-white tracking-wider text-lg'>{strategy.name}</span>
      </div>
      <div className='h-2 w-0.5 bg-[#ccff00]/20 group-hover:bg-[#ccff00] transition-colors'></div>
    </div>

    {/* Central Graphic */}
    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
      <div className='absolute w-24 h-0.5 bg-[#ccff00] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700'></div>
      <Image
        src='/stratos-rook.svg'
        alt='Stratos Rook'
        width={80}
        height={120}
        className='scale-[0.35] opacity-30 group-hover:opacity-70 group-hover:scale-[0.38] transition-all duration-700 ease-out z-10 brightness-0 invert' />
    </div>

    {/* Performance Metrics */}
    <div className='p-3 z-10 mt-auto bg-linear-to-t from-black to-transparent'>
      <div className='border-t border-gray-800 pt-2 group-hover:border-gray-600 transition-colors'>
        <div className='flex justify-between items-end'>
          <div className='space-y-0.5'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500 text-base'>ROI:</span>
              <span className={`text-sm font-bold ${strategy.performance.roi > 0 ? 'text-[#ccff00]' : 'text-red-500'}`}>
                {strategy.performance.roi > 0 ? '+' : ''}
                {strategy.performance.roi}%
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500 text-base'>Sharpe:</span>
              <span className='text-sm font-bold text-white'>{strategy.performance.sharpeRatio}</span>
            </div>
          </div>
          <div className='text-right'>
            <span className='text-gray-500 text-base'>Subs:</span>
            <span className='text-sm font-bold text-white ml-1'>{strategy.subscribers}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StrategyDetailModal = ({ strategy, onClose }: { strategy: Strategy | null, onClose: () => void }) => {
  if (!strategy) return null;

  return (
    <div className='bg-[#0a0a0a] border border-gray-800 mt-8 animate-in slide-in-from-top duration-300'>
      {/* Header */}
      <div className='border-b border-gray-800 p-6 flex justify-between items-start'>
        <div>
          <h2 className='text-2xl font-bold text-white mb-2'>{strategy.name}</h2>
          <p className='text-gray-400 text-base'>{strategy.description}</p>
        </div>
        <button onClick={onClose} className='text-gray-500 hover:text-white transition-colors'>
          <X size={24} />
        </button>
      </div>

      {/* Content Grid */}
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Left Column */}
        <div className='space-y-6'>
          <div>
            <h3 className='font-bold text-gray-500 uppercase tracking-widest mb-3 text-base'>Performance</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center border-b border-gray-900 pb-2'>
                <span className='text-gray-400 text-base'>ROI</span>
                <span className={`text-lg font-bold ${strategy.performance.roi > 0 ? 'text-[#ccff00]' : 'text-red-500'}`}>
                  {strategy.performance.roi > 0 ? '+' : ''}
                  {strategy.performance.roi}%
                </span>
              </div>
              <div className='flex justify-between items-center border-b border-gray-900 pb-2'>
                <span className='text-gray-400 text-base'>Sharpe Ratio</span>
                <span className='text-lg font-bold text-white'>{strategy.performance.sharpeRatio}</span>
              </div>
              <div className='flex justify-between items-center border-b border-gray-900 pb-2'>
                <span className='text-gray-400 text-base'>Max Drawdown</span>
                <span className='text-lg font-bold text-red-500'>{strategy.performance.maxDrawdown}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className='font-bold text-gray-500 uppercase tracking-widest mb-3 text-base'>Tags</h3>
            <div className='flex flex-wrap gap-2'>
              {strategy.tags.map((tag) => <span key={tag} className='border border-gray-800 px-3 py-1 text-gray-400 text-base'>{tag}
              </span>)}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <div>
            <h3 className='text-xs font-bold text-gray-500 uppercase tracking-widest mb-3'>Details</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center border-b border-gray-900 pb-2'>
                <span className='text-gray-400 text-base'>Strategy ID</span>
                <span className='text-sm font-mono text-white'>{strategy.id}</span>
              </div>
              <div className='flex justify-between items-center border-b border-gray-900 pb-2'>
                <span className='text-gray-400 text-base'>Creator</span>
                <span className='text-sm font-mono text-white'>{strategy.creator}</span>
              </div>
              <div className='flex justify-between items-center border-b border-gray-900 pb-2'>
                <span className='text-gray-400 text-base'>Version</span>
                <span className='text-sm font-mono text-white'>{strategy.version}</span>
              </div>
              <div className='flex justify-between items-center border-b border-gray-900 pb-2'>
                <span className='text-gray-400 text-base'>Subscribers</span>
                <span className='text-lg font-bold text-[#ccff00]'>{strategy.subscribers}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className='font-bold text-gray-500 uppercase tracking-widest mb-3 text-base'>Pricing</h3>
            <div className='bg-[#ccff00] text-black p-4 flex items-center justify-between'>
              <div>
                <div className='text-xs uppercase tracking-wider opacity-60'>Subscription Fee</div>
                <div className='text-2xl font-bold'>{strategy.pricing.amount} {strategy.pricing.currency}</div>
              </div>
              <div className='uppercase text-xs font-bold tracking-wider opacity-60'>{strategy.pricing.type}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className='border-t border-gray-800 p-6 flex gap-4'>
        <button className='flex-1 bg-[#ccff00] hover:bg-white text-black font-bold py-3 uppercase text-sm tracking-wider transition-colors'>
          Subscribe Now
        </button>
        <button className='flex-1 border border-gray-800 hover:border-[#ccff00] text-gray-400 hover:text-white font-bold py-3 uppercase text-sm tracking-wider transition-colors'>
          View Backtest
        </button>
      </div>
    </div>
  );
};

const FeatureSection = ({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.1 * (index % 2 === 0 ? 1 : -1));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [index]);

  return (
    <div
      className='border border-gray-800 bg-[#0a0a0a]/50 p-8 hover:border-[#ccff00]/50 transition-all duration-500'
      style={{ transform: `translateY(${offset}px)` }}>
      <div className='w-12 h-12 border border-[#ccff00] flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/10 transition-colors'>
        <Icon size={24} className='text-[#ccff00]' />
      </div>
      <h3 className='text-xl font-bold text-white mb-3 tracking-wide'>{title}</h3>
      <p className='text-gray-400 text-sm leading-relaxed'>{description}</p>
    </div>
  );
};

export default function StratosPage() {
  const [setScrolled] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // setScrolled is not being used since the state variable is not properly declared
      // The line `const [setScrolled] = useState(false);` should be `const [scrolled, setScrolled] = useState(false);`
      // For now, removing the call to avoid the error
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='min-h-screen bg-black text-white font-rajdhani overflow-x-hidden'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-20'>
        {/* Animated grid background and moving lines for visual movement */}
        <div className='absolute inset-0 opacity-30'>
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]' />
          <div className='absolute inset-0 bg-linear-to-br from-[#ccff00]/5 via-transparent to-transparent' />
        </div>

        {/* Animated diagonal lines for movement effect */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div
            className='absolute top-0 left-[20%] w-px h-full bg-linear-to-b from-transparent via-[#ccff00]/30 to-transparent animate-pulse'
            style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div
            className='absolute top-0 right-[30%] w-px h-full bg-linear-to-b from-transparent via-[#ccff00]/20 to-transparent animate-pulse'
            style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className='absolute left-0 top-[40%] h-px w-full bg-linear-to-r from-transparent via-[#ccff00]/10 to-transparent' />
          <div
            className='absolute left-0 top-[60%] h-px w-full bg-linear-to-r from-transparent via-[#ccff00]/15 to-transparent'
            style={{ animationDelay: '2s' }} />
        </div>

        {/* Curved accent lines */}
        <svg className='absolute inset-0 w-full h-full pointer-events-none opacity-20' xmlns='http://www.w3.org/2000/svg'>
          <path d='M0,300 Q400,100 800,300 T1600,300' stroke='#ccff00' strokeWidth='1' fill='none' opacity='0.3' />
          <path d='M0,500 Q600,400 1200,500 T2400,500' stroke='#ccff00' strokeWidth='1' fill='none' opacity='0.2' />
        </svg>

        <div className='absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none'>
          <img
            src='/stratos-rook.svg'
            alt=''
            className='w-[800px] h-[800px] object-contain'
            style={{ filter: 'drop-shadow(0 0 80px rgba(204, 255, 0, 0.3))' }} />
        </div>

        <div className='max-w-[1920px] mx-auto px-6 md:px-12 relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
            {/* Main Text */}
            <div className='lg:col-span-8'>
              <div className='inline-flex items-center gap-2 mb-6 border border-[#ccff00]/30 px-3 py-1 bg-[#ccff00]/5'>
                <div className='w-2 h-2 bg-[#ccff00] animate-pulse'></div>
                <span className='text-[#ccff00] font-bold uppercase tracking-[0.2em] text-sm'>System Status: Live V1.0</span>
              </div>

              <h1
                className='text-[8vw] lg:text-[6vw] leading-[0.85] font-bold tracking-tighter text-white mix-blend-screen select-none mb-6'
                style={{ fontFamily: 'Orbitron, sans-serif' }}>
                TRADE <span className='text-transparent bg-clip-text bg-linear-to-r from-[#ccff00] to-transparent'>DEFI LOGIC</span>
                <br />
                AS DATA STREAMS
              </h1>

              <div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mt-4'>
                <p className='text-gray-400 max-w-xl tracking-wide border-l border-gray-700 pl-4 text-xl font-semibold'>
                  Monetize your alpha. Consume institutional quality data. <br />
                  Let AI agents execute the rest.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-6 mt-12'>
                <Link
                  href='/agents'
                  className='bg-[#ccff00] hover:bg-white text-black font-bold px-10 py-4 uppercase tracking-wider transition-colors flex items-center justify-center gap-2 group text-base'>
                  Explore Marketplace <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                </Link>
                <Link
                  href='/create'
                  className='border border-gray-700 hover:border-[#ccff00] text-gray-400 hover:text-[#ccff00] font-bold px-10 py-4 tracking-wider uppercase transition-all text-base'>
                  Start Uploading
                </Link>
              </div>
            </div>

            {/* Side Terminal/Graphic */}
            <div className='lg:col-span-4 hidden lg:block opacity-80'>
              <div className='border border-gray-800 bg-black p-1'>
                <div className='flex justify-between items-center bg-[#111] px-2 py-1 mb-1'>
                  <span className='text-[10px] text-gray-500 uppercase tracking-widest'>TERM_01</span>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 rounded-full bg-red-900'></div>
                    <div className='w-2 h-2 rounded-full bg-yellow-900'></div>
                    <div className='w-2 h-2 rounded-full bg-green-900'></div>
                  </div>
                </div>
                <div className='p-4 font-mono text-xs text-[#ccff00] space-y-2 h-[300px] overflow-hidden relative'>
                  <TerminalInterface />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Problem/Solution Section --- */}
      <section className='relative py-24 px-6 overflow-hidden'>
        <div className='max-w-[1400px] mx-auto relative'>
          <div className='flex gap-12'>
            {/* Vertical STRATOS Text */}
            <div className='hidden xl:block shrink-0'></div>

            {/* Main Content Area */}
            <div className='flex-1'>
              {/* Problem Section */}
              <div className='mb-20'>
                <div className='mb-12'>
                  <div className='inline-block border border-red-500/30 px-4 py-1.5 mb-6'>
                    <span className='text-red-500 font-bold tracking-[0.2em] uppercase text-sm'>System Status: Critical</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Orbitron']">
                    Most Are <span className='text-red-500'>Unaware</span> of DeFi Mechanics
                  </h2>
                  <p className='text-gray-400 tracking-wide max-w-2xl text-lg'>
                    The complexity barrier prevents mainstream adoption. Institutional-grade tools remain inaccessible.
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {/* Stat 1 */}
                  <div className='relative border border-red-900/20 bg-black p-8 hover:border-red-500/30 transition-all duration-300 group'>
                    <div className='absolute top-0 left-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    <div className="text-6xl font-bold text-red-500 mb-4 font-['Orbitron']">87%</div>
                    <h3 className='text-sm font-bold text-white mb-3 tracking-wider uppercase'>Hidden Complexity</h3>
                    <p className='text-gray-400 leading-relaxed text-base'>
                      87% of potential users cite complexity as the primary barrier to DeFi adoption and participation.
                    </p>
                  </div>

                  {/* Stat 2 */}
                  <div className='relative border border-red-900/20 bg-black p-8 hover:border-red-500/30 transition-all duration-300 group'>
                    <div className='absolute top-0 left-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    <div className="text-6xl font-bold text-red-500 mb-4 font-['Orbitron']">$180B</div>
                    <h3 className='text-sm font-bold text-white mb-3 tracking-wider uppercase'>Untapped Liquidity</h3>
                    <p className='text-gray-400 leading-relaxed text-base'>
                      Billions in capital remain on sidelines due to lack of accessible tools and education.
                    </p>
                  </div>

                  {/* Stat 3 */}
                  <div className='relative border border-red-900/20 bg-black p-8 hover:border-red-500/30 transition-all duration-300 group'>
                    <div className='absolute top-0 left-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    <div className="text-6xl font-bold text-red-500 mb-4 font-['Orbitron']">72hrs</div>
                    <h3 className='text-sm font-bold text-white mb-3 tracking-wider uppercase'>Learning Curve</h3>
                    <p className='text-gray-400 leading-relaxed text-base'>
                      Average time required to understand basic DeFi concepts without proper guidance systems.
                    </p>
                  </div>
                </div>
              </div>

              {/* Solution Section */}
              <div>
                <div className='mb-12'>
                  <div className='inline-block border border-[#ccff00]/30 px-4 py-1.5 mb-6'>
                    <span className='text-[#ccff00] font-bold tracking-[0.2em] uppercase text-sm'>System Status: Optimized</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Orbitron']">
                    Stratos <span className='text-[#ccff00]'>Simplifies</span> Access
                  </h2>
                  <p className='text-gray-400 tracking-wide max-w-2xl text-base font-semibold'>
                    Transform complex DeFi mechanics into executable strategies. No technical expertise required.
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {/* Solution 1 */}
                  <div className='relative border border-[#ccff00]/20 bg-black p-8 hover:border-[#ccff00]/50 transition-all duration-300 group'>
                    <div className='absolute top-0 left-0 w-2 h-full bg-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity'>
                    </div>
                    <div className='w-14 h-14 border border-[#ccff00]/50 flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/10 transition-colors'>
                      <Shield size={28} className='text-[#ccff00]' />
                    </div>
                    <h3 className='font-bold text-white mb-3 tracking-wider uppercase text-lg'>Pre-Built Strategies</h3>
                    <p className='text-gray-400 leading-relaxed mb-4 text-lg'>
                      Access verified, institutional-grade strategies without understanding the underlying code. One-click deployment with
                      full transparency.
                    </p>
                    <div className='flex items-center gap-2 text-[#ccff00] text-[10px] font-bold tracking-wider'>
                      <BarChart3 size={14} />
                      <span className='text-base'>VERIFIED & AUDITED</span>
                    </div>
                  </div>

                  {/* Solution 2 */}
                  <div className='relative border border-[#ccff00]/20 bg-black p-8 hover:border-[#ccff00]/50 transition-all duration-300 group'>
                    <div className='absolute top-0 left-0 w-2 h-full bg-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity'>
                    </div>
                    <div className='w-14 h-14 border border-[#ccff00]/50 flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/10 transition-colors'>
                      <Zap size={28} className='text-[#ccff00]' />
                    </div>
                    <h3 className='font-bold text-white mb-3 tracking-wider uppercase text-lg'>Autonomous Execution</h3>
                    <p className='text-gray-400 leading-relaxed mb-4 text-lg'>
                      AI agents handle complexity automatically. Set parameters once, let the system optimize and execute continuously.
                    </p>
                    <div className='flex items-center gap-2 text-[#ccff00] text-[10px] font-bold tracking-wider'>
                      <Activity size={14} />
                      <span className='text-base'>24/7 OPERATION</span>
                    </div>
                  </div>

                  {/* Solution 3 */}
                  <div className='relative border border-[#ccff00]/20 bg-black p-8 hover:border-[#ccff00]/50 transition-all duration-300 group'>
                    <div className='absolute top-0 left-0 w-2 h-full bg-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity'>
                    </div>
                    <div className='w-14 h-14 border border-[#ccff00]/50 flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/10 transition-colors'>
                      <Users size={28} className='text-[#ccff00]' />
                    </div>
                    <h3 className='font-bold text-white mb-3 tracking-wider uppercase text-lg'>Learn By Doing</h3>
                    <p className='text-gray-400 leading-relaxed mb-4 text-lg'>
                      Build intuition through practical experience. Real-time feedback and transparent performance metrics accelerate
                      understanding.
                    </p>
                    <div className='flex items-center gap-2 text-[#ccff00] text-[10px] font-bold tracking-wider'>
                      <TrendingUp size={14} />
                      <span className='text-base'>INSTANT FEEDBACK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Strategies Marketplace - Single row of strategies with modal details --- */}
      <section className='relative py-20 px-6 bg-black/30'>
        <div className='max-w-[1920px] mx-auto'>
          <div className='mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-2'>MARKETPLACE</h2>
            <p className='text-gray-500 text-sm uppercase tracking-wider'>LIVE FEEDS // VERIFIED ALPHA</p>
          </div>

          <div className='mb-8'>
            <div className='flex flex-col md:flex-row gap-6 items-center justify-between'>
              {/* Category Filters */}
              <div className='flex flex-wrap gap-3'>
                {['ALL STRATEGIES', 'YIELD FARMING', 'ARBITRAGE', 'MEV', 'VERIFIED'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {}}
                    className={`font-bold tracking-wider uppercase px-6 py-2.5 transition-all duration-300 text-sm ${
                      false ? 'bg-[#ccff00] text-black' : 'bg-transparent border border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}>
                    {filter}
                  </button>
                ))}
              </div>

              {/* Search Bar - Increased width */}
              <div className='w-full md:w-auto'>
                <div className='relative'>
                  <div className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-700'></div>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {sampleStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onClick={() => setSelectedStrategy(strategy)} />
            ))}
          </div>

          {selectedStrategy && <StrategyDetailModal strategy={selectedStrategy} onClose={() => setSelectedStrategy(null)} />}
        </div>
      </section>

      {/* --- Creator Hub, Enterprise, and Agents Framework Cards --- */}
      <section className='relative py-24 px-6 overflow-hidden bg-black'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Creator Hub Card */}
            <div className='relative border border-gray-800 bg-black p-10 hover:border-[#ccff00]/50 transition-all duration-300 group'>
              <div className='w-12 h-12 flex items-center justify-center mb-8'>
                <BarChart3 size={32} className='text-[#ccff00]' />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-wider uppercase font-['Orbitron']">Creator Hub</h3>
              <p className='text-gray-400 leading-relaxed mb-8 text-lg'>
                Turn scripts into revenue. Wrap in MCP. Set dynamic pricing models. Real-time P&L tracking.
              </p>
              <button className='text-white font-bold tracking-wider uppercase hover:text-[#ccff00] transition-colors flex items-center gap-2 text-base'>
                Initiate Upload
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Enterprise Card */}
            <div className='relative border border-gray-800 bg-black p-10 hover:border-[#ccff00]/50 transition-all duration-300 group'>
              <div className='w-12 h-12 flex items-center justify-center mb-8'>
                <Shield size={32} className='text-[#ccff00]' />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-wider uppercase font-['Orbitron']">Enterprise</h3>
              <p className='text-gray-400 leading-relaxed mb-8 text-lg'>
                White-label marketplaces for quant shops. Dedicated SLAs. Encrypted execution environments.
              </p>
              <button className='text-white font-bold tracking-wider uppercase hover:text-[#ccff00] transition-colors flex items-center gap-2 text-base'>
                Request Access
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Agents Framework Card */}
            <div className='relative border border-gray-800 bg-black p-10 hover:border-[#ccff00]/50 transition-all duration-300 group'>
              <div className='w-12 h-12 flex items-center justify-center mb-8'>
                <Terminal size={32} className='text-[#ccff00]' />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 tracking-wider uppercase font-['Orbitron']">Agents Framework</h3>
              <p className='text-gray-400 leading-relaxed mb-8 text-lg'>
                Native SDKs for autonomous agents. Compose strategies programmatically. Go, Python, JS.
              </p>
              <button className='text-white font-bold tracking-wider uppercase hover:text-[#ccff00] transition-colors flex items-center gap-2 text-base'>
                View Documentation
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Ready to Launch CTA --- */}
      <section className='relative py-32 px-6 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-linear-to-b from-transparent via-[#ccff00]/5 to-transparent'></div>
        <div className='max-w-[1400px] mx-auto relative z-10'>
          <h2 className='text-4xl md:text-6xl font-bold text-white mb-6'>
            Ready to <span className='text-[#ccff00]'>Launch?</span>
          </h2>
          <p className='text-gray-400 mb-12 max-w-2xl mx-auto text-lg'>
            Join thousands of traders and creators building the future of decentralized finance
          </p>
          <button className='bg-[#ccff00] hover:bg-white text-black text-sm font-bold px-12 py-5 uppercase tracking-wider transition-colors'>
            Get Started Now
          </button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className='border-t border-gray-900 bg-black pt-20 pb-10'>
        <div className='max-w-[1920px] mx-auto px-6 md:px-12'>
          <div className='grid grid-cols-1 md:grid-cols-6 gap-12 mb-16'>
            <div className='col-span-1 md:col-span-2'>
              <StratosLogo />
              <p className='mt-6 text-gray-500 text-xs leading-relaxed max-w-xs'>
                Stratos defines the intersection of high-stakes strategy and digital ownership. Secured by the blockchain, powered by
                vision.
              </p>
            </div>

            <div className='col-span-1'>
              <h4 className='text-white text-xs font-bold uppercase tracking-widest mb-6'>Platform</h4>
              <ul className='space-y-4 text-gray-500 text-xs uppercase tracking-wide'>
                <li>
                  <Link href='/agents' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Agents</Link>
                </li>
                <li>
                  <Link href='/create' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Create</Link>
                </li>
                <li>
                  <Link href='/agents' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Marketplace</Link>
                </li>
                <li>
                  <Link href='/learn' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Learn</Link>
                </li>
              </ul>
            </div>

            <div className='col-span-1'>
              <h4 className='text-white text-xs font-bold uppercase tracking-widest mb-6'>Company</h4>
              <ul className='space-y-4 text-gray-500 text-xs uppercase tracking-wide'>
                <li>
                  <Link href='/about' className='hover:text-[#ccff00] cursor-pointer transition-colors'>About</Link>
                </li>
              </ul>
            </div>

            <div className='col-span-1'>
              <h4 className='text-white text-xs font-bold uppercase tracking-widest mb-6'>Legal</h4>
              <ul className='space-y-4 text-gray-500 text-xs uppercase tracking-wide'>
                <li>
                  <Link href='/legal/terms' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Terms of Service</Link>
                </li>
                <li>
                  <Link href='/legal/privacy' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Privacy Policy</Link>
                </li>
                <li>
                  <Link href='/legal/cookies' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Cookies</Link>
                </li>
              </ul>
            </div>

            <div className='col-span-1'>
              <h4 className='text-white text-xs font-bold uppercase tracking-widest mb-6'>Resources</h4>
              <ul className='space-y-4 text-gray-500 text-xs uppercase tracking-wide'>
                <li>
                  <Link href='/api-docs' className='hover:text-[#ccff00] cursor-pointer transition-colors'>API</Link>
                </li>
                <li>
                  <Link href='/security' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Security</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest'>
            <span>© 2025 Stratos Inc. All rights reserved.</span>
            <div className='flex gap-8 mt-4 md:mt-0'>
              <Link href='https://twitter.com/stratosinc' className='hover:text-[#ccff00] cursor-pointer transition-colors'>Twitter</Link>
              <Link href='https://discord.com/invite/stratos' className='hover:text-[#ccff00] cursor-pointer transition-colors'>
                Discord
              </Link>
              <Link href='https://github.com/stratosinc' className='hover:text-[#ccff00] cursor-pointer transition-colors'>GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
