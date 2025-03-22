"use client";

import { usePrivy } from "@privy-io/react-auth";
import UserProfileCard from "@/components/chat/UserProfileCard";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <>
      {children}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9000 }}>
        {authenticated && <UserProfileCard />}
      </div>
    </>
  );
} 