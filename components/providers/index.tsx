"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/clans";
import type { Clan } from "@/lib/types";
import { use, useEffect } from "react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import Image from "next/image";
import { useCitizensOfMantleNFT } from "@/lib/nft";
import { useSwitchChain, useChainId } from "wagmi";
import { mantleMainnet, zksyncMainnet } from "@/components/providers";

interface ClanPageProps {
  params: Promise<{
    clanId: string;
  }>;
}

export default function ClanPage({ params }: ClanPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const clanId = resolvedParams.clanId.startsWith("clan")
    ? resolvedParams.clanId
    : `clan${resolvedParams.clanId}`;
  const clan = clans.find((c) => c.id === clanId);
  
  // Only check NFT ownership for Mantle clan
  const nftCheck = clan?.id === "clan4" ? useCitizensOfMantleNFT() : null;
  
  // Auto-switch to appropriate network based on clan
  useEffect(() => {
    if (!switchChain) return;

    if (clan?.id === "clan4" && chainId !== mantleMainnet.id) {
      switchChain({ chainId: mantleMainnet.id });
    } else if (clan?.id === "clan3" && chainId !== zksyncMainnet.id) {
      switchChain({ chainId: zksyncMainnet.id });
    }
  }, [clan?.id, chainId, switchChain]);
  
  // Log debug info as well
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

      {/* NFT Debug Info from main branch */}
      {clan.id === "clan4" && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
          {nftCheck?.isLoading ? (
            <div className="mt-4 text-white text-center">Checking NFT ownership...</div>
          ) : (
            <>
              <div className="mt-4 p-4 bg-gray-900/80 backdrop-blur-sm rounded-lg text-white">
                <h2 className="font-bold">Debug Info:</h2>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      hasNFT: nftCheck?.hasNFT,
                      isCheckingNFT: nftCheck?.isLoading,
                      isError: nftCheck?.isError,
                      isWrongNetwork: nftCheck?.isWrongNetwork,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              {!nftCheck?.hasNFT && (
                <div className="mt-4 p-4 bg-yellow-600/80 backdrop-blur-sm rounded-lg text-white">
                  To post in this clan, you need to own a Citizens of Mantle
                  NFT.
                  <a
                    href="https://mintle.app/explore/MANTLE:0x7cf4ac414c94e03ecb2a7d6ea8f79087453caef0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:underline ml-1"
                  >
                    Get one here
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}