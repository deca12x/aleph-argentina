"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ConnectButton from "../../components/ConnectButton";
import Image from "next/image";

export default function LoginPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/devconnect-background.webp" 
          alt="Devconnect Background" 
          fill 
          className="object-cover blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      {/* Connect button container */}
      <div className="relative z-10">
        <ConnectButton />
      </div>
    </div>
  );
}
