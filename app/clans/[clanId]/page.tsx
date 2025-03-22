"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/data";
import type { Clan } from "@/lib/types";
import { use } from "react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";

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
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Background gradient balls */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#0084ff] to-[#00ffff] blur-xl opacity-30 z-[-5]"
           style={{ transform: 'translate(200px, -50px)' }} />
      <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-to-r from-[#a200ff] to-[#000dff] blur-xl opacity-30 z-[-5]"
           style={{ transform: 'translate(-160px, 100px)' }} />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-gradient-to-r from-[#00ffd9] to-[#00ff84] blur-xl opacity-30 z-[-5]"
           style={{ transform: 'translate(-200px, -140px)' }} />
      
      {/* Canvas Container */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Canvas3D sceneType={SceneType.DEVCONNECT} />
      </div>
      
      {/* Clan Name Display */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold z-10">
        Clan: {clan?.name}
      </div>
    </div>
  );
}
