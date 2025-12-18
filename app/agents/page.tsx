'use client';

import Navbar from '@/components/navbar';
import { useStrategies } from '@/lib/hooks/use-strategies';
import Image from 'next/image';
import Link from 'next/link';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from 'react';

function StratosLogo() {
  return (
    <Link href='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
      <Image src='/stratos-rook.svg' alt='Stratos Rook' width={32} height={32} className='brightness-0 invert' />
      <Image src='/stratos-logo.svg' alt='Stratos' width={120} height={24} className='brightness-0 invert' />
    </Link>
  );
}

export default function AgentsPage() {
  const { strategies, loading, error } = useStrategies();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<any | null>(null);

  const categories = useMemo(() => {
    const counts = strategies.reduce<Record<string, number>>((acc, strat) => {
      const key = strat.category || 'uncategorized';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return [
      { id: 'all', name: 'All Strategies', count: strategies.length },
      ...Object.entries(counts).map(([id, count]) => ({ id, name: id.replace(/-/g, ' '), count }))
    ];
  }, [strategies]);

  const filteredStrategies = strategies.filter((strategy) => {
    const matchesCategory = selectedCategory === 'all' || strategy.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      strategy.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className='min-h-screen bg-black text-white font-rajdhani'>
      <Navbar />

      {/* Main Content */}
      <div className='max-w-[1920px] mx-auto px-6 md:px-12 py-12'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Sidebar - Categories */}
          <aside className='lg:w-64 flex-shrink-0'>
            <div className='bg-black border border-gray-900 rounded-none p-6 sticky top-28'>
              <h2 className='text-white text-sm font-bold uppercase tracking-widest mb-6'>Categories</h2>
              <ul className='space-y-3'>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-none transition-all flex items-center justify-between group ${
                        selectedCategory === category.id ?
                          'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30' :
                          'text-gray-400 hover:text-white hover:bg-gray-900/50 border border-transparent'
                      }`}>
                      <span className='text-xs uppercase tracking-wide font-medium'>{category.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-none ${
                          selectedCategory === category.id ? 'bg-[#ccff00] text-black' : 'bg-gray-900 text-gray-500 group-hover:bg-gray-800'
                        }`}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className='mt-8 pt-6 border-t border-gray-900'>
                <div className='space-y-4'>
                  <div>
                    <div className='text-[10px] text-gray-600 uppercase tracking-widest mb-1'>Total Strategies</div>
                    <div className='text-2xl font-bold text-[#ccff00]'>{strategies.length}</div>
                  </div>
                  <div>
                    <div className='text-[10px] text-gray-600 uppercase tracking-widest mb-1'>Active Users</div>
                    <div className='text-2xl font-bold text-white'>
                      {strategies.reduce((sum, s) => sum + s.subscribers, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Strategy Cards */}
          <main className='flex-1'>
            {/* Header with Search and Filters */}
            <div className='mb-8'>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-2">
                    <span className='text-white'>AGENTS</span>
                    <span className='text-[#ccff00]'>MARKETPLACE</span>
                  </h1>
                  <p className='text-gray-500 text-sm'>Discover and deploy AI-powered trading strategies verified by the community</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className='relative'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='SEARCH_DB'
                  className='w-full bg-black border border-gray-800 rounded-none px-6 py-4 text-sm text-gray-400 placeholder:text-gray-700 uppercase tracking-wider focus:outline-none focus:border-[#ccff00]/50 transition-colors font-mono' />
                <svg
                  className='absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
            </div>

            {/* Strategy Cards Grid */}
            {error && (
              <div className='text-red-400 bg-red-500/10 border border-red-500/20 rounded-none p-4 text-sm mb-4'>
                Failed to load strategies: {error}
              </div>
            )}
            {loading && !error && <div className='text-gray-500 text-sm mb-4'>Loading live strategies…</div>}
            {!loading && !error && (
              <>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {filteredStrategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      onClick={() => setSelectedStrategy(strategy)}
                      className='bg-black border border-gray-900 rounded-none p-5 hover:border-[#ccff00]/50 transition-all cursor-pointer group relative overflow-hidden'>
                      {/* Rook Icon */}
                      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none'>
                        <Image
                          src='/stratos-rook.svg'
                          alt=''
                          width={120}
                          height={120}
                          className='brightness-0 invert scale-[0.7] group-hover:scale-75 transition-transform' />
                      </div>

                      <div className='relative z-10'>
                        {/* Header */}
                        <div className='flex items-start justify-between mb-4'>
                          <div className='flex-1'>
                            <h3 className='text-white text-sm font-bold mb-1 group-hover:text-[#ccff00] transition-colors'>
                              {strategy.name}
                            </h3>
                            <p className='text-gray-600 text-xs mb-2'>{strategy.description}</p>
                          </div>
                          <div className='ml-2 px-2 py-1 bg-gray-900 rounded-none text-[10px] text-gray-500 font-mono'>v{strategy.version}</div>
                        </div>

                        {/* Performance Metrics */}
                        <div className='grid grid-cols-3 gap-3 mb-4'>
                          <div>
                            <div className='text-[9px] text-gray-600 uppercase tracking-wider mb-1'>ROI</div>
                            <div className='text-sm font-bold text-[#ccff00]'>
                              {strategy.performance?.roi ? `+${strategy.performance.roi}%` : '—'}
                            </div>
                          </div>
                          <div>
                            <div className='text-[9px] text-gray-600 uppercase tracking-wider mb-1'>Sharpe</div>
                            <div className='text-sm font-bold text-white'>{strategy.performance?.sharpeRatio ?? '—'}</div>
                          </div>
                          <div>
                            <div className='text-[9px] text-gray-600 uppercase tracking-wider mb-1'>Drawdown</div>
                            <div className='text-sm font-bold text-red-500'>{strategy.performance?.maxDrawdown ?? '—'}%</div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className='flex flex-wrap gap-2 mb-4'>
                          {(strategy.tags || []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className='px-2 py-1 bg-gray-900/50 border border-gray-800 rounded-none text-[10px] text-gray-500 uppercase tracking-wide'>
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className='flex items-center justify-between pt-4 border-t border-gray-900'>
                          <div className='text-[10px] text-gray-600'>
                            <span className='text-white font-bold'>{strategy.subscribers ?? 0}</span> subscribers
                          </div>
                          <div className='text-xs font-bold text-[#ccff00]'>
                            {strategy.pricing?.amount ?? 0} {strategy.pricing?.currency ?? ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredStrategies.length === 0 && (
                  <div className='text-center py-20'>
                    <div className='text-gray-600 text-sm uppercase tracking-wider'>No strategies found</div>
                    <p className='text-gray-700 text-xs mt-2'>Try adjusting your filters or search query</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <div
          className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6'
          onClick={() => setSelectedStrategy(null)}>
          <div
            className='bg-black border border-[#ccff00]/30 rounded-none max-w-2xl w-full max-h-[80vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}>
            <div className='p-8'>
              {/* Header */}
              <div className='flex items-start justify-between mb-6'>
                <div>
                  <h2 className='text-2xl font-bold text-[#ccff00] mb-2'>{selectedStrategy.name}</h2>
                  <p className='text-gray-400 text-sm'>{selectedStrategy.description}</p>
                </div>
                <button onClick={() => setSelectedStrategy(null)} className='text-gray-600 hover:text-white transition-colors'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              {/* Details Grid */}
              <div className='grid grid-cols-2 gap-6 mb-6'>
                <div>
                  <div className='text-[10px] text-gray-600 uppercase tracking-widest mb-2'>Creator</div>
                  <div className='text-white font-mono text-sm'>{selectedStrategy.creator || '—'}</div>
                </div>
                <div>
                  <div className='text-[10px] text-gray-600 uppercase tracking-widest mb-2'>Version</div>
                  <div className='text-white font-mono text-sm'>{selectedStrategy.version || '—'}</div>
                </div>
                <div>
                  <div className='text-[10px] text-gray-600 uppercase tracking-widest mb-2'>Subscribers</div>
                  <div className='text-white text-sm'>{selectedStrategy.subscribers ?? 0}</div>
                </div>
                <div>
                  <div className='text-[10px] text-gray-600 uppercase tracking-widest mb-2'>Created</div>
                  <div className='text-white text-sm'>
                    {selectedStrategy.createdAt ? new Date(selectedStrategy.createdAt).toLocaleDateString() : '—'}
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className='mb-6'>
                <h3 className='text-white text-xs font-bold uppercase tracking-widest mb-4'>Performance Metrics</h3>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='bg-gray-900/50 border border-gray-800 rounded-none p-4'>
                    <div className='text-[10px] text-gray-600 uppercase tracking-wider mb-2'>ROI</div>
                    <div className='text-2xl font-bold text-[#ccff00]'>
                      {selectedStrategy.performance?.roi !== undefined ? `+${selectedStrategy.performance.roi}%` : '—'}
                    </div>
                  </div>
                  <div className='bg-gray-900/50 border border-gray-800 rounded-none p-4'>
                    <div className='text-[10px] text-gray-600 uppercase tracking-wider mb-2'>Sharpe Ratio</div>
                    <div className='text-2xl font-bold text-white'>{selectedStrategy.performance?.sharpeRatio ?? '—'}</div>
                  </div>
                  <div className='bg-gray-900/50 border border-gray-800 rounded-none p-4'>
                    <div className='text-[10px] text-gray-600 uppercase tracking-wider mb-2'>Max Drawdown</div>
                    <div className='text-2xl font-bold text-red-500'>
                      {selectedStrategy.performance?.maxDrawdown !== undefined ? `${selectedStrategy.performance.maxDrawdown}%` : '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className='mb-6'>
                <h3 className='text-white text-xs font-bold uppercase tracking-widest mb-4'>Pricing</h3>
                <div className='bg-gray-900/50 border border-gray-800 rounded-none p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-[10px] text-gray-600 uppercase tracking-wider mb-1'>
                        {selectedStrategy.pricing?.type || 'pricing'}
                      </div>
                      <div className='text-2xl font-bold text-[#ccff00]'>
                        {selectedStrategy.pricing?.amount ?? 0} {selectedStrategy.pricing?.currency ?? ''}
                      </div>
                    </div>
                    <button className='bg-[#ccff00] text-black px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#b8e600] transition-colors'>
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className='text-white text-xs font-bold uppercase tracking-widest mb-4'>Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {(selectedStrategy.tags || []).map((tag: string, idx: number) => (
                    <span
                      key={tag || idx}
                      className='px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-none text-xs text-gray-400 uppercase tracking-wide'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
