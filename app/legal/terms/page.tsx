'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function TermsPage() {
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

      <div className='max-w-4xl mx-auto px-6 md:px-12 py-20'>
        <h1 className="text-4xl font-bold font-['Orbitron'] mb-8">Terms of Service</h1>
        <div className='text-xs text-gray-500 uppercase tracking-widest mb-12'>Last Updated: December 2025</div>

        <div className='space-y-8 text-gray-400 leading-relaxed'>
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Stratos platform, you agree to be bound by these Terms of Service and all applicable laws and
              regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Stratos for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use
              the materials for any commercial purpose, or attempt to decompile or reverse engineer any software contained on the platform.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>3. Trading Risks</h2>
            <p>
              Trading cryptocurrencies and DeFi strategies carries substantial risk of loss. Past performance does not guarantee future
              results. You acknowledge that you are solely responsible for all trading decisions and that Stratos is not liable for any
              losses incurred through the use of strategies deployed on the platform.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>4. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials, for all activities that occur under your
              account, and for ensuring that all uses of your account comply fully with the provisions of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>5. Intellectual Property</h2>
            <p>
              The platform and its original content, features, and functionality are owned by Stratos and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>6. Limitation of Liability</h2>
            <p>
              In no event shall Stratos or its suppliers be liable for any damages arising out of the use or inability to use the materials
              on the platform, even if Stratos or an authorized representative has been notified of the possibility of such damage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
