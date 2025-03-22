"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/clans";
import type { Clan } from "@/lib/types";
import { use, useEffect, useState } from "react";
import { getPOAPEventDetails, type POAPEvent } from "@/lib/poap";
import Image from "next/image";
import { useCitizensOfMantleNFT } from "@/lib/nft";

interface ClanPageProps {
  params: Promise<{
    clanId: string;
  }>;
}

export default function ClanPage({ params }: ClanPageProps) {
  const [poapEvents, setPoapEvents] = useState<POAPEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasNFT, isLoading: isCheckingNFT } = useCitizensOfMantleNFT();

  const router = useRouter();
  const resolvedParams = use(params);
  const clanId = resolvedParams.clanId.startsWith("clan")
    ? resolvedParams.clanId
    : `clan${resolvedParams.clanId}`;
  const clan = clans.find((c) => c.id === clanId);

  useEffect(() => {
    async function fetchPOAPDetails() {
      try {
        const events = await Promise.all(
          clan!.poapIds.map((id) => getPOAPEventDetails(id))
        );
        setPoapEvents(events);
      } catch (error) {
        console.error("Failed to fetch POAP details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (clan) {
      fetchPOAPDetails();
    }
  }, [clan]);

  if (!clan) {
    return <h1>Clan not found</h1>;
  }

  if (loading) {
    return <div>Loading POAP details...</div>;
  }

  if (isCheckingNFT) {
    return <div>Checking NFT ownership...</div>;
  }

  return (
    <div>
      <h1>Clan: {clan.name}</h1>

      {!hasNFT && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
          To post in this clan, you need to own a Citizens of Mantle NFT.
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

      <div className="mt-4">
        <h2>Clan POAPs:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {poapEvents.map((poap) => (
            <div key={poap.id} className="border rounded-lg p-4">
              <Image
                src={poap.image_url}
                alt={poap.name}
                width={200}
                height={200}
                className="rounded-lg"
              />
              <h3 className="font-bold mt-2">{poap.name}</h3>
              <p className="text-sm text-gray-600">{poap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
