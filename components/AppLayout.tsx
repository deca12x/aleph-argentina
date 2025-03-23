"use client";

import { usePrivy } from "@privy-io/react-auth";
import UserProfileCard from "@/components/chat/UserProfileCard";
import EphemeralChat from "@/components/chat/EphemeralChat";
import ChatMessages from "@/components/chat/ChatMessages";
import LogoutButton from "@/components/LogoutButton";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clans } from "@/lib/poapData";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated } = usePrivy();
  const pathname = usePathname();
  const [showChatCard, setShowChatCard] = useState(true);
  const [showEphemeralChat, setShowEphemeralChat] = useState(false);

  // Extract clan ID from the pathname if in a clan space
  const isClanPage = pathname?.includes("/clans/");
  const clanId = isClanPage ? pathname?.split("/").pop() : undefined;
  const currentClan = clanId ? clans.find((c) => c.id === clanId) : null;

  // Listen for custom events that will be dispatched when entering spaces
  useEffect(() => {
    // Check if we're on the a clan page and hide chat by default
    const isMantlePage = pathname?.includes("/clans/clan4");
    setShowChatCard(!isMantlePage);

    // For certain clans, show the ephemeral chat instead of regular chat
    if (currentClan?.visualProperties?.hasEphemeralChat) {
      setShowEphemeralChat(true);
    } else {
      setShowEphemeralChat(false);
    }

    // Listen for the showChat event to display chat after entering space
    const handleShowChat = () => setShowChatCard(true);
    const handleHideChat = () => setShowChatCard(false);

    // Listen for specific ephemeral chat toggle events
    const handleShowEphemeral = () => setShowEphemeralChat(true);
    const handleHideEphemeral = () => setShowEphemeralChat(false);

    window.addEventListener("showChat", handleShowChat);
    window.addEventListener("hideChat", handleHideChat);
    window.addEventListener("showEphemeralChat", handleShowEphemeral);
    window.addEventListener("hideEphemeralChat", handleHideEphemeral);

    return () => {
      window.removeEventListener("showChat", handleShowChat);
      window.removeEventListener("hideChat", handleHideChat);
      window.removeEventListener("showEphemeralChat", handleShowEphemeral);
      window.removeEventListener("hideEphemeralChat", handleHideEphemeral);
    };
  }, [pathname, currentClan]);

  return (
    <>
      {children}

      {authenticated && (
        <>
          <LogoutButton />

          {/* Show appropriate chat interface */}
          {isClanPage && <ChatMessages />}

          {showChatCard && !showEphemeralChat && (
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 9000 }}
            >
              <UserProfileCard />
            </div>
          )}

          {showEphemeralChat && (
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 9000 }}
            >
              <EphemeralChat />
            </div>
          )}
        </>
      )}
    </>
  );
}
