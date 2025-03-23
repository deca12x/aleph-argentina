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

  // Add debug log to verify clans data
  useEffect(() => {
    console.log("Clans data:", clans.map(clan => `${clan.id} (${clan.name})`));
  }, []);

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
        // Log each clan as it's being rendered for debugging
        console.log(`Rendering clan button: ${clan.id} (${clan.name}), index: ${index}`);
        
        // Create more diverse positioning around the screen
        let positionStyle = {};
        
        // Position dots in different areas of the screen with fixed positions
        // instead of using right property which can cause issues
        switch(index) {
          case 0: // First clan (Crecimiento)
            positionStyle = { top: '25vh', left: '20vw' };
            break;
          case 1: // Second clan (Urbe) - Changed to use left instead of right
            positionStyle = { top: '30vh', left: '75vw' };
            break;
          case 2: // Third clan (zkSync)
            positionStyle = { top: '60vh', left: '25vw' };
            break;
          case 3: // Fourth clan (Mantle) - Changed to use left instead of right
            positionStyle = { top: '65vh', left: '70vw' };
            break;
          case 4: // Fifth clan (Aleph)
            positionStyle = { top: '40vh', left: '50vw', transform: 'translateX(-50%)' };
            break;
          default:
            positionStyle = { top: `${20 + (index * 10)}vh`, left: `${20 + (index * 10)}vw` };
        }

        // Right side tooltips for Urbe and Mantle (based on position not index)
        const isRight = clan.id === 'urbe' || clan.id === 'mantle';

        return (
          <Link
            key={clan.id}
            href={`/clans/${clan.id}`}
            data-clan-id={clan.id}
            className={`fixed z-[80]
              group relative h-12 w-12 flex items-center justify-center
              transition-all duration-300 radar-dot`}
            style={positionStyle}
          >
            <span className={`${clan.id === 'mantle' || clan.id === 'urbe' ? 'h-4 w-4' : 'h-3 w-3'} bg-white rounded-full relative z-10 
              group-hover:scale-125 transition-transform duration-300`}></span>
            <span className={`absolute whitespace-nowrap
              bg-black/70 backdrop-blur-md px-4 py-2 rounded-full opacity-0
              border border-white/20 text-white text-sm
              group-hover:opacity-100 transition-opacity duration-300
              pointer-events-none ${isRight ? "right-full mr-3" : "left-full ml-3"}`}
            >
              {clan.name} Space
            </span>
          </Link>
        );
      })}

      {/* Page Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold z-10">
        Welcome to Aleph Argentina
      </div>
    </div>
  );
}
