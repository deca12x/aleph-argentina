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

      {/* Page Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold z-10">
        Welcome to Aleph Argentina
      </div>

      {/* Connect Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <ConnectButton />
      </div>
    </div>
  );
}
