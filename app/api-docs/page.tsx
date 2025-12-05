'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function APIPage() {
  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Navigation */}
      <nav className='border-b border-gray-900 bg-black/50 backdrop-blur-sm sticky top-0 z-50'>
        <div className='max-w-[1920px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-3'>
            <Image src='/stratos-rook.svg' alt='Stratos' width={32} height={32} className='invert' />
            <Image src='/stratos-logo.svg' alt='Stratos' width={120} height={32} />
          </Link>
          <Link
            href='/'
            className='bg-[#ccff00] text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#b8e600] transition-colors'>
            Launch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className='pt-32 pb-20 px-6 md:px-12'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='max-w-3xl'>
            <div className='inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-8'>
              ● API: v2.0 ACTIVE
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6">
              API <span className='text-[#ccff00]'>Documentation</span>
            </h1>
            <p className='text-gray-400 text-lg leading-relaxed'>
              Build on Stratos with our comprehensive REST and WebSocket APIs. Deploy strategies, monitor performance, and integrate with
              your existing systems.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className='py-20 px-6 md:px-12 bg-linear-to-b from-black to-gray-950'>
        <div className='max-w-[1400px] mx-auto'>
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Quick Start</h2>
          <div className='bg-gray-950 border border-gray-900 p-8 font-mono text-sm'>
            <div className='text-gray-500 mb-2'>// Initialize the Stratos SDK</div>
            <div className='text-[#ccff00]'>import</div> {'{'} StratosClient {'}'} <div className='text-[#ccff00] inline'>from</div>{' '}
            <div className='text-green-400 inline'>'@stratos/sdk'</div>
            <br />
            <br />
            <div className='text-[#ccff00]'>const</div> client = <div className='text-[#ccff00] inline'>new</div> StratosClient({'{'}
            <br />{'  '}apiKey: process.env.STRATOS_API_KEY
            <br />
            {'}'})
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className='py-20 px-6 md:px-12'>
        <div className='max-w-[1400px] mx-auto'>
          <h2 className="text-3xl font-bold font-['Orbitron'] mb-12">Core Endpoints</h2>
          <div className='space-y-4'>
            {[
              { method: 'GET', endpoint: '/api/v2/strategies', description: 'List all available strategies' },
              { method: 'POST', endpoint: '/api/v2/strategies/deploy', description: 'Deploy a new strategy instance' },
              { method: 'GET', endpoint: '/api/v2/performance/:id', description: 'Get strategy performance metrics' },
              { method: 'POST', endpoint: '/api/v2/execute', description: 'Execute a strategy action' },
              { method: 'WS', endpoint: 'wss://api.stratos.io/stream', description: 'Real-time data stream' }
            ].map((endpoint, i) => (
              <div key={i} className='bg-black border border-gray-900 p-6 flex items-start gap-6'>
                <span
                  className={`text-xs font-mono px-3 py-1 ${
                    endpoint.method === 'GET' ?
                      'bg-blue-950 text-blue-400' :
                      endpoint.method === 'POST' ?
                      'bg-green-950 text-green-400' :
                      'bg-purple-950 text-purple-400'
                  }`}>
                  {endpoint.method}
                </span>
                <div className='flex-1'>
                  <div className='font-mono text-sm mb-2'>{endpoint.endpoint}</div>
                  <div className='text-gray-500 text-xs'>{endpoint.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
