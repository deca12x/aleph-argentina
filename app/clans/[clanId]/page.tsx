"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/data";
import type { Clan } from "@/lib/types";
import { use, useEffect } from "react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import Image from "next/image";
import { useCitizensOfMantleNFT } from "@/lib/nft";

interface ClanPageProps {
  params: Promise<{
    clanId: string;
  }>;
}

export default function ClanPage({ params }: ClanPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  // Process clan ID as in main branch
  const clanId = resolvedParams.clanId.startsWith("clan")
    ? resolvedParams.clanId
    : `clan${resolvedParams.clanId}`;
  const clan = clans.find((c) => c.id === clanId);
  
  // Only check NFT ownership for Mantle clan
  const nftCheck = clan?.id === "clan4" ? useCitizensOfMantleNFT() : null;
  
  // Log debug info instead of displaying it
  useEffect(() => {
    if (clan?.id === "clan4") {
      console.log("NFT Debug Info:", {
        hasNFT: nftCheck?.hasNFT,
        isCheckingNFT: nftCheck?.isLoading,
        isError: nftCheck?.isError,
        isWrongNetwork: nftCheck?.isWrongNetwork,
      });
    }
  }, [clan?.id, nftCheck?.hasNFT, nftCheck?.isLoading, nftCheck?.isError, nftCheck?.isWrongNetwork]);
  
  if (!clan) {
    return (
      <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
        <h1 className="text-white text-3xl z-10">Clan not found</h1>
        <div className="absolute inset-0 bg-black/60 z-0"></div>
      </div>
    );
  }
  
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/devconnect-background.webp" 
          alt="Devconnect Background" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Canvas Container - Temporarily commented out */}
      {/* <div className="absolute inset-0 z-[2]">
        <Canvas3D sceneType={SceneType.DEVCONNECT} />
      </div> */}
      
      {/* Clan Name Display */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold z-10">
        Clan: {clan.name}
      </div>
    </div>
  );
}
