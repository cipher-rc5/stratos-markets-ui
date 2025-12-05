import { defineChain } from "viem"

export const echo = defineChain({
  id: 173750,
  name: "Echo L1",
  network: "echo",
  nativeCurrency: {
    decimals: 18,
    name: "Ech",
    symbol: "ECH",
  },
  rpcUrls: {
    default: {
      http: ["https://subnets.avax.network/echo/testnet/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://subnets-test.avax.network/echo",
    },
  },
  testnet: true,
})
