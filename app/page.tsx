"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { clans } from "@/lib/poapData";

export default function Home() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Add home-page class to body when on homepage
  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

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

      {/* Clan Navigation Buttons */}
      {clans.map((clan, index) => {
        // Calculate custom positioning for each button to avoid overlap
        const top = 12 + index * 12; // Vertical positioning
        const isRight = index % 2 === 1; // Alternate left/right

        return (
          <Link
            key={clan.id}
            href={`/clans/${clan.id}`}
            className={`fixed ${isRight ? "right-6" : "left-6"} z-[80]
              bg-black/30 backdrop-blur-md px-4 py-2 rounded-full
              border border-white/20 hover:bg-white/20 transition-all duration-300
              hover:scale-105 hover:shadow-lg hover:border-white/40 text-white text-sm`}
            style={{ top: `${top}vh` }}
          >
            Go to {clan.name} Clan
          </Link>
        );
      })}

      {/* 3D Explore Button */}
      <Link
        href="/explore"
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[80]
          bg-black/50 backdrop-blur-md px-6 py-3 rounded-full
          border border-white/30 hover:bg-white/20 transition-all duration-300
          hover:scale-105 hover:shadow-lg hover:border-white/50 text-white text-md"
      >
        Explore in 3D
      </Link>

      {/* Page Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold z-10">
        Welcome to Aleph Argentina
      </div>
    </div>
  );
}
