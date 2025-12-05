'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function CookiesPage() {
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
        <h1 className="text-4xl font-bold font-['Orbitron'] mb-8">Cookie Policy</h1>
        <div className='text-xs text-gray-500 uppercase tracking-widest mb-12'>Last Updated: December 2025</div>

        <div className='space-y-8 text-gray-400 leading-relaxed'>
          <section>
            <h2 className='text-xl font-bold text-white mb-4'>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our platform. They help us provide you with a
              better experience by remembering your preferences and understanding how you use our services.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>2. How We Use Cookies</h2>
            <p>We use cookies for various purposes, including:</p>
            <ul className='list-disc list-inside mt-4 space-y-2 ml-4'>
              <li>Essential cookies for platform functionality</li>
              <li>Performance cookies to analyze platform usage</li>
              <li>Functional cookies to remember your preferences</li>
              <li>Analytics cookies to improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>3. Types of Cookies We Use</h2>
            <p>
              <strong className='text-white'>Essential Cookies:</strong>{' '}
              These cookies are necessary for the platform to function and cannot be disabled. They include session management and security
              features.
            </p>
            <p className='mt-4'>
              <strong className='text-white'>Analytics Cookies:</strong>{' '}
              These cookies help us understand how users interact with the platform, allowing us to improve functionality and user
              experience.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>4. Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the
              functionality of the platform and your ability to use certain features.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>5. Third-Party Cookies</h2>
            <p>
              We may use third-party service providers who also set cookies on your device to provide their services. These providers have
              their own privacy policies governing the use of cookies.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4'>6. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page
              and updating the "Last Updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
