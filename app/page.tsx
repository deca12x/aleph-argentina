"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";

export default function Home() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

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
        <Canvas3D sceneType={SceneType.HOME} />
      </div>
      
      {/* UserProfileCard is now included in AppLayout */}
    </div>
  );
}
