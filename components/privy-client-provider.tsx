"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { echo } from "@/lib/chain"

export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clz4o2b830002p1wzexqy0lkf"

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#ccff00",
          logo: "/stratos-logo.svg",
          landingHeader: "Connect to Stratos",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          noPromptOnSignature: true,
        },
        defaultChain: echo,
        supportedChains: [echo],
        loginMethods: ["email", "wallet", "google", "apple", "discord", "twitter"],
        walletConnectCloudProjectId: undefined,
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: "smartWalletOnly",
          },
        },
        mfaMethods: ["sms", "totp"],
      }}
    >
      {children}
    </PrivyProvider>
  )
}
