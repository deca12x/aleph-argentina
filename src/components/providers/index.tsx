"use client";
import * as React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/images/logo.svg",
        },
        loginMethods: ["email", "wallet"], // Add this line
      }}
    >
      {children}
    </PrivyProvider>
  );
}
