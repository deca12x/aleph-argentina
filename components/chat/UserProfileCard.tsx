"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function UserProfileCard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = usePrivy();
  const pathname = usePathname();

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
          boxShadow:
            "0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 8px rgba(255, 255, 255, 0.1)",
        }}
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
        {/* Info area */}
        <div className="flex justify-between items-center px-3 py-3 md:px-4 md:py-4 text-white/70 text-xs md:text-sm">
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
