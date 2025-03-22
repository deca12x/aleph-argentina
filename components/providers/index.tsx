"use client";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { celo, mantle, sepolia } from "wagmi/chains";
import { createConfig, WagmiProvider } from "wagmi";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { http } from "wagmi";

const wagmiConfig = createConfig({
  chains: [celo, mantle, sepolia],
  transports: {
    [sepolia.id]: http(),
    [mantle.id]: http(),
    [celo.id]: http(),
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
          <NuqsAdapter>{children}</NuqsAdapter>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
