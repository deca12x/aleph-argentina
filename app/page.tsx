"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import UserProfileCard from "@/components/chat/UserProfileCard";

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
      <div className="h-screen w-screen flex items-center justify-center bg-[#1a1a1a]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#1a1a1a]">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1a1a1a]" />
      
      {/* Simply display the UserProfileCard in the center of the screen */}
      <div className="z-10">
        <UserProfileCard />
      </div>
    </div>
  );
}
