"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import Image from "next/image";
import NavButton from "@/components/NavButton";

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
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image with slight overlay */}
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
        <Canvas3D sceneType={SceneType.HOME} />
      </div> */}
      
      {/* Navigation to Mantle Clan (Live Chat) */}
      <NavButton href="/clans/mantle/Mantle" label="Go to Mantle Clan Chat" position="top-left" />
      
      {/* Page Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold z-10">
        Welcome to Aleph Argentina
      </div>
      
      {/* UserProfileCard is now included in AppLayout */}
    </div>
  );
}
