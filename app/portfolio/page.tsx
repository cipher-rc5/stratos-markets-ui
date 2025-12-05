'use client';
import Navbar from '@/components/navbar';
import { Activity, BarChart3, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const positions = [{
  id: 1,
  strategy: 'DCA Bitcoin Strategy',
  asset: 'BTC',
  entryPrice: 42500,
  currentPrice: 43200,
  quantity: 0.5,
  value: 21600,
  pnl: 350,
  pnlPercent: 1.65,
  status: 'active'
}, {
  id: 2,
  strategy: 'Yield Farm Optimizer',
  asset: 'ETH-USDC LP',
  entryPrice: 2.45,
  currentPrice: 2.67,
  quantity: 5000,
  value: 13350,
  pnl: 1100,
  pnlPercent: 8.98,
  status: 'active'
}, {
  id: 3,
  strategy: 'Arbitrage Scanner Pro',
  asset: 'Multi-Asset',
  entryPrice: 0,
  currentPrice: 0,
  quantity: 1,
  value: 8420,
  pnl: 420,
  pnlPercent: 5.25,
  status: 'active'
}, {
  id: 4,
  strategy: 'MEV Protection Suite',
  asset: 'USDC',
  entryPrice: 1.0,
  currentPrice: 1.0,
  quantity: 10000,
  value: 10000,
  pnl: 0,
  pnlPercent: 0,
  status: 'paused'
}];

const performanceData = {
  totalValue: 53370,
  totalPnL: 1870,
  totalPnLPercent: 3.63,
  dayChange: 542,
  dayChangePercent: 1.02,
  weekChange: 1240,
  weekChangePercent: 2.38
};

export default function PortfolioPage() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />

      <div className='max-w-[1920px] mx-auto px-6 md:px-12 py-12'>
        {/* Header */}
        <div className='mb-12'>
          <div className='inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-6'>
            ● PORTFOLIO STATUS: LIVE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-4">
            DeFi <span className='text-[#ccff00]'>Portfolio</span>
          </h1>
          <p className='text-gray-400 text-lg'>Real-time performance tracking and position management</p>
        </div>

        {/* Performance Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          <div className='bg-black border border-gray-900 p-6 hover:border-[#ccff00]/30 transition-all'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-600 uppercase tracking-wider'>Total Value</div>
              <DollarSign className='w-5 h-5 text-gray-700' />
            </div>
            <div className='text-3xl font-bold text-white mb-2'>${performanceData.totalValue.toLocaleString()}</div>
            <div className='flex items-center gap-2 text-sm'>
              <TrendingUp className='w-4 h-4 text-[#ccff00]' />
              <span className='text-[#ccff00]'>+${performanceData.dayChange}</span>
              <span className='text-gray-600'>({performanceData.dayChangePercent}%)</span>
            </div>
          </div>

          <div className='bg-black border border-gray-900 p-6 hover:border-[#ccff00]/30 transition-all'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-600 uppercase tracking-wider'>Total P&L</div>
              <Activity className='w-5 h-5 text-gray-700' />
            </div>
            <div className='text-3xl font-bold text-[#ccff00] mb-2'>+${performanceData.totalPnL.toLocaleString()}</div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-[#ccff00]'>+{performanceData.totalPnLPercent}%</span>
              <span className='text-gray-600'>All-time</span>
            </div>
          </div>

          <div className='bg-black border border-gray-900 p-6 hover:border-[#ccff00]/30 transition-all'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-600 uppercase tracking-wider'>Active Positions</div>
              <BarChart3 className='w-5 h-5 text-gray-700' />
            </div>
            <div className='text-3xl font-bold text-white mb-2'>{positions.filter((p) => p.status === 'active').length}</div>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-gray-400'>{positions.length} total</span>
            </div>
          </div>

          <div className='bg-black border border-gray-900 p-6 hover:border-[#ccff00]/30 transition-all'>
            <div className='flex items-start justify-between mb-4'>
              <div className='text-xs text-gray-600 uppercase tracking-wider'>7D Performance</div>
              <PieChart className='w-5 h-5 text-gray-700' />
            </div>
            <div className='text-3xl font-bold text-[#ccff00] mb-2'>+${performanceData.weekChange.toLocaleString()}</div>
            <div className='flex items-center gap-2 text-sm'>
              <TrendingUp className='w-4 h-4 text-[#ccff00]' />
              <span className='text-[#ccff00]'>+{performanceData.weekChangePercent}%</span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className='flex items-center gap-4 mb-8'>
          {(['24h', '7d', '30d', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all ${
                timeframe === tf ? 'bg-[#ccff00] text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
              {tf}
            </button>
          ))}
        </div>

        {/* Positions Table */}
        <div className='bg-black border border-gray-900'>
          <div className='p-6 border-b border-gray-900'>
            <h2 className="text-xl font-bold font-['Orbitron']">Active Positions</h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-900 bg-gray-950'>
                  <th className='text-left p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>Strategy</th>
                  <th className='text-left p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>Asset</th>
                  <th className='text-right p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>Entry Price</th>
                  <th className='text-right p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>Current Price</th>
                  <th className='text-right p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>Quantity</th>
                  <th className='text-right p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>Value</th>
                  <th className='text-right p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>P&L</th>
                  <th className='text-center p-4 text-xs text-gray-600 uppercase tracking-wider font-bold'>Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className='border-b border-gray-900 hover:bg-gray-950/50 transition-colors cursor-pointer'>
                    <td className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 relative opacity-20'>
                          <Image src='/stratos-rook.svg' alt='' fill className='object-contain brightness-0 invert' />
                        </div>
                        <span className='text-sm font-medium'>{position.strategy}</span>
                      </div>
                    </td>
                    <td className='p-4 text-sm text-gray-400 font-mono'>{position.asset}</td>
                    <td className='p-4 text-sm text-right font-mono text-gray-400'>
                      {position.entryPrice > 0 ? `$${position.entryPrice.toLocaleString()}` : '-'}
                    </td>
                    <td className='p-4 text-sm text-right font-mono text-white'>
                      {position.currentPrice > 0 ? `$${position.currentPrice.toLocaleString()}` : '-'}
                    </td>
                    <td className='p-4 text-sm text-right font-mono text-gray-400'>{position.quantity}</td>
                    <td className='p-4 text-sm text-right font-mono text-white font-bold'>${position.value.toLocaleString()}</td>
                    <td className='p-4 text-right'>
                      <div className='flex flex-col items-end'>
                        <span className={`text-sm font-bold ${position.pnl >= 0 ? 'text-[#ccff00]' : 'text-red-500'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl}
                        </span>
                        <span className={`text-xs ${position.pnl >= 0 ? 'text-[#ccff00]/70' : 'text-red-500/70'}`}>
                          {position.pnl >= 0 ? '+' : ''}
                          {position.pnlPercent}%
                        </span>
                      </div>
                    </td>
                    <td className='p-4 text-center'>
                      <span
                        className={`inline-block px-3 py-1 text-xs uppercase tracking-wider font-bold ${
                          position.status === 'active' ?
                            'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30' :
                            'bg-gray-900 text-gray-500 border border-gray-800'
                        }`}>
                        {position.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
          <button className='bg-[#ccff00] text-black p-6 text-center hover:bg-[#b3e600] transition-all group'>
            <div className='text-lg font-bold uppercase tracking-wider mb-2'>Deploy New Strategy</div>
            <div className='text-xs opacity-70'>Browse marketplace</div>
          </button>
          <button className='bg-black border border-gray-900 text-white p-6 text-center hover:border-[#ccff00]/50 transition-all group'>
            <div className='text-lg font-bold uppercase tracking-wider mb-2'>Rebalance Portfolio</div>
            <div className='text-xs text-gray-600'>Optimize allocation</div>
          </button>
          <button className='bg-black border border-gray-900 text-white p-6 text-center hover:border-[#ccff00]/50 transition-all group'>
            <div className='text-lg font-bold uppercase tracking-wider mb-2'>Export Report</div>
            <div className='text-xs text-gray-600'>Download CSV/PDF</div>
          </button>
        </div>
      </div>
    </div>
  );
}
