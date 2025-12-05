import { Analytics } from '@vercel/analytics/next';
import { type Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import type React from 'react';
import { PageTransition } from '../components/page-transition';
import { PrivyClientProvider } from '../components/privy-client-provider';
import './globals.css';

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' });

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Stratos Markets',
  description: 'Strategic assets. Secured on chain. Built for the future.',
  generator: 'cipher',
  icons: {
    icon: [{ url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' }, {
      url: '/icon-dark-32x32.png',
      media: '(prefers-color-scheme: dark)'
    }, { url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={`${orbitron.variable} ${rajdhani.variable} font-rajdhani antialiased`}>
        <PrivyClientProvider>
          <PageTransition>{children}</PageTransition>
        </PrivyClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
