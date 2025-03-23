"use client";

import { usePrivy } from "@privy-io/react-auth";
import UserProfileCard from "@/components/chat/UserProfileCard";
import LogoutButton from "@/components/LogoutButton";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated } = usePrivy();
  const pathname = usePathname();
  const [showChatCard, setShowChatCard] = useState(true);

  // Listen for a custom event that will be dispatched when entering Mantle space
  useEffect(() => {
    // Check if we're on the Mantle clan page and hide chat by default
    const isMantlePage = pathname?.includes("/clans/clan4");
    setShowChatCard(!isMantlePage);

    // Listen for the showChat event to display chat after entering Mantle space
    const handleShowChat = () => setShowChatCard(true);
    const handleHideChat = () => setShowChatCard(false);

    window.addEventListener("showChat", handleShowChat);
    window.addEventListener("hideChat", handleHideChat);

    return () => {
      window.removeEventListener("showChat", handleShowChat);
      window.removeEventListener("hideChat", handleHideChat);
    };
  }, [pathname]);

  return (
    <>
      {children}

      {authenticated && (
        <>
          <LogoutButton />
          {showChatCard && (
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 9000 }}
            >
              <UserProfileCard />
            </div>
          )}
        </>
      )}
    </>
  );
}
