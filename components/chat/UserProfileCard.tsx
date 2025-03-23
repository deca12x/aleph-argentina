"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Send, X, AlertCircle } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useChat } from "@/context/ChatContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useClanAccess } from "@/lib/clanAccess";

export default function UserProfileCard() {
  const [message, setMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPoapMessage, setShowPoapMessage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = usePrivy();
  const { sendMessage } = useChat();
  const pathname = usePathname();

  // Check if we're in a clan space (to show chat input)
  const isInClanSpace = pathname?.includes("/clans/");

  // Extract the clan ID from the pathname if in a clan space
  const clanId = isInClanSpace ? pathname?.split("/").pop() : undefined;
  const clanIdWithPrefix = clanId?.startsWith("clan")
    ? clanId
    : clanId
    ? `clan${clanId}`
    : undefined;

  // Use our new clan access hook to check if user can write in this clan
  const clanAccess = useClanAccess(clanIdWithPrefix);

  // Get wallet address from Privy
  const walletAddress = user?.wallet?.address;
  const shortAddress = walletAddress
    ? `0x...${walletAddress.slice(-4)}`
    : "0x...????";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Log clan access information for debugging
  useEffect(() => {
    if (isInClanSpace) {
      console.log(`Clan Access for ${clanIdWithPrefix}:`, {
        canWrite: clanAccess.canWrite,
        isLoading: clanAccess.isLoading,
        reason: clanAccess.reason,
        walletAddress,
      });
    }
  }, [clanAccess, clanIdWithPrefix, isInClanSpace, walletAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only send message if user can write in this clan
    if (message.trim() && clanAccess.canWrite) {
      sendMessage(message.trim());
      setMessage("");
    } else if (!clanAccess.canWrite) {
      // Show message about writing restrictions
      setShowPoapMessage(true);
    }
  };

  const handleProfileClick = () => {
    if (isInClanSpace && !clanAccess.canWrite) {
      setShowPoapMessage(true);
    }
  };

  return (
    <div
      id="chatWindow"
      ref={cardRef}
      className="fixed bottom-8 left-0 right-0 mx-auto w-[95%] md:w-[500px] transition-transform duration-300 ease-in-out pointer-events-auto"
      style={{
        transform: `translateY(${mousePosition.y / 80}px)`,
        zIndex: 9999,
      }}
    >
      {/* Access Restriction Message Modal */}
      {showPoapMessage && (
        <div className="absolute left-0 -top-[140px] w-full p-4 rounded-[15px] backdrop-blur-[12px] border border-white/20 shadow-lg bg-black/60 z-50 text-white">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold mb-2">Access Restricted</h3>
            <button
              onClick={() => setShowPoapMessage(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-white/80 mb-2">
            {clanAccess.reason ||
              "You don't have permission to post messages in this clan."}
          </p>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 h-1 bg-purple-500/30 rounded-full"></div>
            <div className="flex-1 h-1 bg-blue-500/30 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Profile picture floating to the left */}
      <div
        className="absolute -left-16 md:-left-20 bottom-2 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/30 overflow-hidden shadow-lg cursor-pointer hover:border-white/50 transition-all duration-300"
        style={{
          transform: `translateY(${mousePosition.y / 80}px)`,
          boxShadow:
            "0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 8px rgba(255, 255, 255, 0.1)",
        }}
        onClick={handleProfileClick}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 mix-blend-overlay"></div>
        <Image
          src="/boys-nft-collection/image.webp"
          alt="Profile"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 48px, 64px"
        />
      </div>

      {/* Glass card - modern clean glassmorphism */}
      <div className="relative h-auto w-full rounded-[20px] overflow-hidden backdrop-blur-[12px] border border-white/20 shadow-lg bg-black/20">
        {/* Input area - only show in clan spaces */}
        {isInClanSpace && (
          <form onSubmit={handleSubmit} className="p-3 md:p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  clanAccess.canWrite
                    ? "Type your message..."
                    : "You can't post in this clan..."
                }
                disabled={!clanAccess.canWrite || clanAccess.isLoading}
                className={`flex-1 ${
                  !clanAccess.canWrite
                    ? "bg-white/5 text-white/40"
                    : "bg-white/10 text-white"
                } rounded-[10px] px-3 py-2 placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white/30 border-none text-sm md:text-base font-greed`}
              />
              <button
                type="submit"
                disabled={!clanAccess.canWrite || clanAccess.isLoading}
                className={`${
                  !clanAccess.canWrite
                    ? "bg-white/5 text-white/40"
                    : "bg-white/10 hover:bg-white/20 text-white"
                } transition-colors rounded-[10px] w-[40px] md:w-[50px] flex items-center justify-center`}
              >
                {clanAccess.isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : !clanAccess.canWrite ? (
                  <AlertCircle size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            {/* Access restriction indicator */}
            {!clanAccess.canWrite && !clanAccess.isLoading && (
              <div className="mt-2 text-xs text-amber-400 flex items-center gap-1.5">
                <AlertCircle size={12} />
                <span>{clanAccess.reason || "Access restricted"}</span>
              </div>
            )}
          </form>
        )}

        {/* Info area */}
        <div
          className={`flex justify-between items-center px-3 ${
            isInClanSpace ? "pb-3" : "py-3"
          } md:px-4 ${
            isInClanSpace ? "md:pb-4" : "md:py-4"
          } text-white/70 text-xs md:text-sm`}
        >
          <div className="font-mono">{shortAddress}</div>
          <div className="flex gap-[5px]">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}