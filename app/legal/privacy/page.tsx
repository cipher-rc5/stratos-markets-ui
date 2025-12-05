'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold font-['Orbitron'] mb-8">Privacy Policy</h1>
        <div className='text-xs text-gray-500 uppercase tracking-widest mb-12'>Last Updated: December 2025</div>

        <div className='space-y-8 text-gray-400 leading-relaxed'>
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including when you create an account, use our services, participate in
              interactive features, or communicate with us. This may include wallet addresses, transaction data, and usage information.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you
              technical notices and support messages, and to communicate with you about products, services, and events.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as described in this policy. We may share information with
              service providers who perform services on our behalf, in response to legal requests, or to protect rights and safety.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However,
              no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>5. Blockchain Transparency</h2>
            <p>
              Please note that transactions on blockchain networks are public by design. While we take measures to protect your privacy,
              blockchain transactions and wallet addresses are visible on public ledgers.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You may also have the right to object to or
              restrict certain processing of your data. Contact us to exercise these rights.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
