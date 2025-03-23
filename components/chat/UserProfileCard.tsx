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
      {/* Profile picture floating to the left */}
      <div
        className="absolute -left-16 md:-left-20 bottom-2 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/30 overflow-hidden shadow-lg cursor-pointer hover:border-white/50 transition-all duration-300"
        style={{
          transform: `translateY(${mousePosition.y / 80}px)`,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        }}
        onClick={handleProfileClick}
      >
        <Image
          src="/profile-pic.jpg"
          alt="Profile picture"
          fill
          sizes="64px"
          className="object-cover"
        />

        {/* Display POAP badges */}
        <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
          3
        </div>
      </div>

      {/* Access Warning Message */}
      {showPoapMessage && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(100%+16px)] bg-black/90 backdrop-blur-md text-white p-4 rounded-lg shadow-xl border border-white/10 max-w-xs w-full animate-fadeIn">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/90 rotate-45 border-b border-r border-white/10"></div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-400 mb-1">
                Access Required
              </h4>
              <p className="text-sm text-white/90 mb-2">
                You need to hold a POAP or collection item from this clan to
                send messages.
              </p>
              <button
                onClick={() => setShowPoapMessage(false)}
                className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1 mt-1"
              >
                <X className="w-3 h-3" /> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card background with glass effect */}
      <div
        className="rounded-xl p-4 backdrop-blur-md border border-white/20 shadow-2xl"
        style={{
          background:
            "linear-gradient(to bottom, rgba(100, 100, 255, 0.05), rgba(100, 100, 255, 0.15))",
        }}
      >
        {/* Chat header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-white font-mono text-xs">
              {shortAddress} {isInClanSpace ? `· ${clanId}` : ""}
            </h3>
          </div>

          {isInClanSpace && !clanAccess.canWrite && (
            <span className="px-2 py-0.5 bg-amber-500/80 text-white text-xs rounded-full flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              POAP Required
            </span>
          )}
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              clanAccess.canWrite || !isInClanSpace
                ? "Send a message..."
                : "POAP required to chat"
            }
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            disabled={isInClanSpace && !clanAccess.canWrite}
          />
          <button
            type="submit"
            disabled={
              !message.trim() || (isInClanSpace && !clanAccess.canWrite)
            }
            className={`rounded-lg p-2 transition-colors ${
              message.trim() && (!isInClanSpace || clanAccess.canWrite)
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* POAP badges */}
        <div className="flex gap-1 mt-2 justify-end">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
            <Image
              src="/poaps/mantle.jpg"
              alt="Mantle POAP"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
            <Image
              src="/poaps/ba.jpg"
              alt="BA POAP"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
            <Image
              src="/poaps/zksync.jpg"
              alt="zkSync POAP"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
