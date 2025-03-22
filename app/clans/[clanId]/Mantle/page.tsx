// app/clan/alpha/page.tsx
"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import UserProfileCard from "@/components/chat/UserProfileCard";

export default function ClanAlphaPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1a1a1a]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#1a1a1a]">
      {/* 3D Background */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Canvas3D sceneType={SceneType.CLAN_ALPHA} />
      </div>
      
      {/* User Interface */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-8" style={{ zIndex: 50 }}>
        <UserProfileCard />
      </div>
    </div>
  );
}