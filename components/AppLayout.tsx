"use client";

import { usePrivy } from "@privy-io/react-auth";
import UserProfileCard from "@/components/chat/UserProfileCard";
import LogoutButton from "@/components/LogoutButton";
import PageTransition from "@/components/PageTransition";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <>
      <PageTransition>
        {children}
      </PageTransition>
      
      {authenticated && (
        <>
          <LogoutButton />
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9000 }}>
            <UserProfileCard />
          </div>
        </>
      )}
    </>
  );
} 