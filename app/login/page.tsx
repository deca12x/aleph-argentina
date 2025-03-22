"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ConnectButton from "../../components/ConnectButton";

export default function LoginPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-black">
      {/* Background gradient balls */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#0084ff] to-[#00ffff] blur-xl opacity-30 z-[-5]"
           style={{ transform: 'translate(200px, -50px)' }} />
      <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-to-r from-[#a200ff] to-[#000dff] blur-xl opacity-30 z-[-5]"
           style={{ transform: 'translate(-160px, 100px)' }} />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-gradient-to-r from-[#00ffd9] to-[#00ff84] blur-xl opacity-30 z-[-5]"
           style={{ transform: 'translate(-200px, -140px)' }} />
      
      <ConnectButton />
    </div>
  );
}
