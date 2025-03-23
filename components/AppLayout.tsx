"use client";

import { usePrivy } from "@privy-io/react-auth";
import UserProfileCard from "@/components/chat/UserProfileCard";
import LogoutButton from "@/components/LogoutButton";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import EphemeralChat from "@/components/chat/EphemeralChat";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated } = usePrivy();
  const pathname = usePathname();
  const [showEphemeralChat, setShowEphemeralChat] = useState(true);

  // Check if we're in a clan space
  const isInClanSpace = pathname?.includes("/clans/");

  return (
    <>
      {children}

      {authenticated && (
        <>
          <LogoutButton />
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9000 }}
          >
            <UserProfileCard />
          </div>
          {isInClanSpace && <EphemeralChat />}
        </>
      )}
    </>
  );
}
