"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/clans";
import type { Clan } from "@/lib/types";
import { use, useEffect } from "react";
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

  if (!clan) {
    return <h1>Clan not found</h1>;
  }

  return (
    <div>
      <h1>Clan: {clan.name}</h1>

      {clan.id === "clan4" && (
        <>
          {nftCheck?.isLoading ? (
            <div className="mt-4">Checking NFT ownership...</div>
          ) : (
            <>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h2 className="font-bold">Debug Info:</h2>
                <pre className="mt-2">
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
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                  To post in this clan, you need to own a Citizens of Mantle
                  NFT.
                  <a
                    href="https://mintle.app/explore/MANTLE:0x7cf4ac414c94e03ecb2a7d6ea8f79087453caef0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Get one here
                  </a>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
