'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import type React from 'react';
import { echo } from '../lib/chain';

export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

  if (!appId) {
    console.warn('[v0] NEXT_PUBLIC_PRIVY_APP_ID not configured');
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#ccff00',
          logo: '/stratos-logo.svg',
          landingHeader: 'Connect to Stratos',
          showWalletLoginFirst: false
        },
        embeddedWallets: { ethereum: { createOnLogin: 'users-without-wallets' } },
        defaultChain: echo,
        supportedChains: [echo],
        loginMethods: ['email', 'wallet', 'google'],
        legal: { termsAndConditionsUrl: '/legal/terms', privacyPolicyUrl: '/legal/privacy' }
      }}>
      {children}
    </PrivyProvider>
  );
}
