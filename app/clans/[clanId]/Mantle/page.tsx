// app/clan/alpha/page.tsx
"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ChatMessages from "@/components/chat/ChatMessages";
import NavButton from "@/components/NavButton";
import Image from "next/image";
import { MantleWidget, MantleIntegration } from "@/components/imported/mantle";

export default function MantleClanPage() {
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
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/devconnect-background.webp" 
          alt="Devconnect Background" 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-[5] h-full w-full pt-20 pb-32 px-4 flex flex-col items-center overflow-y-auto">
        {/* Mantle Widget */}
        <div className="w-full max-w-4xl mb-8">
          <MantleWidget />
        </div>
        
        {/* Mantle Integration (External Project Content) */}
        <div className="w-full max-w-4xl mb-8">
          <MantleIntegration />
        </div>
      </div>
      
      {/* Chat Messages */}
      <ChatMessages />
      
      {/* Return to home navigation */}
      <NavButton href="/" label="Back to Home" position="top-left" />
      
      {/* Page Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold z-10">
        Mantle Clan
      </div>
    </div>
  );
}