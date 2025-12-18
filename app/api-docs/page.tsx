import { ApiReferenceReact } from '@scalar/api-reference-react';
import type { AnyApiReferenceConfiguration } from '@scalar/types/api-reference';
import Image from 'next/image';
import Link from 'next/link';
import '@scalar/api-reference-react/style.css';

export default function APIPage() {
  const config: AnyApiReferenceConfiguration = { url: '/api/openapi', theme: 'deepSpace' };

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
      <section className='pt-32 pb-12 px-6 md:px-12'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='max-w-3xl'>
            <div className='inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-8'>
              ● API: v0 (live data proxied)
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-['Orbitron'] mb-6">
              API <span className='text-[#ccff00]'>Documentation</span>
            </h1>
            <p className='text-gray-400 text-lg leading-relaxed'>
              Live OpenAPI reference for portfolio, agents, strategies, and market data. Spec is served from{' '}
              <code className='text-[#ccff00]'>/api/openapi</code>.
            </p>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className='py-20 px-6 md:px-12'>
        <div className='max-w-[1400px] mx-auto'>
          <div className='bg-gray-950 border border-gray-900 rounded-lg'>
            <ApiReferenceReact configuration={config} />
          </div>
        </div>
      </section>
    </div>
  );
}
