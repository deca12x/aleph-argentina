"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/data";
import type { Clan } from "@/lib/types";
import { use } from "react";

interface ClanPageProps {
  params: Promise<{
    clanId: string;
  }>;
}

export default function ClanPage({ params }: ClanPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const clanId = resolvedParams.clanId.startsWith("clan")
    ? resolvedParams.clanId
    : `clan${resolvedParams.clanId}`;
  const clan = clans.find((c) => c.id === clanId);

  if (!clan) {
    return <h1>Clan not found</h1>;
  }

  return (
    <div>
      <h1>Clan: {clan.name}</h1>
      <div className="mt-4">
        <h2>Clan POAPs:</h2>
        <ul>
          {clan.poapIds.map((poapId) => (
            <li key={poapId}>POAP ID: {poapId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
