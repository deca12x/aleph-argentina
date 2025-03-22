"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/data";
import type { Clan } from "@/lib/types";
import { use } from "react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import Image from "next/image";

interface ClanPageProps {
  params: Promise<{
    clanId: string;
  }>;
}

export default function ClanPage({ params }: ClanPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const clan = clans.find((c) => c.id === resolvedParams.clanId);
  
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
        Clan: {clan?.name}
      </div>
    </div>
  );
}
