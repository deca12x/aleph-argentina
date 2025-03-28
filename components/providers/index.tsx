"use client";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { http } from "wagmi";
import { defineChain } from "viem";
import { ChatProvider } from "@/context/ChatContext";
import { EphemeralChatProvider } from "@/context/EphemeralChatContext";

export const zksyncMainnet = defineChain({
  id: 324,
  name: "ZKSync Era Mainnet",
  network: "zksync-era",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.era.zksync.io"] },
  },
});

export const zksyncTestnet = defineChain({
  id: 300,
  name: "ZKSync Sepolia Testnet",
  network: "zksync-sepolia",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.era.zksync.dev"] },
  },
});

export const mantleMainnet = defineChain({
  id: 5000,
  name: "Mantle Mainnet",
  network: "mantle",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mantle.xyz"] },
  },
});

export const mantleTestnet = defineChain({
  id: 5003,
  name: "Mantle Sepolia Testnet",
  network: "mantle-sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.mantle.xyz"] },
  },
});

const wagmiConfig = createConfig({
  chains: [zksyncMainnet, mantleMainnet],
  transports: {
    [zksyncMainnet.id]: http(),
    [mantleMainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/globe.svg",
        },
        loginMethods: ["email", "wallet"],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ChatProvider>
            <EphemeralChatProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </EphemeralChatProvider>
          </ChatProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
