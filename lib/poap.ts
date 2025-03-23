"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/clans";
import type { Clan } from "@/lib/types";
import { use, useEffect } from "react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import Image from "next/image";
import { useCitizensOfMantleNFT } from "@/lib/nft";
import { useSwitchChain, useChainId } from "wagmi";

export interface POAPEvent {
  id: number;
  name: string;
  image_url: string;
  description: string;
}

export async function getPOAPEventDetails(eventId: string): Promise<POAPEvent> {
  const response = await fetch(`https://api.poap.tech/events/${eventId}`, {
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_POAP_API_KEY || "",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch POAP event: ${response.statusText}`);
  }

  return response.json();
}
