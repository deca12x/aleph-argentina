"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import Link from "next/link";

export default function ExplorePage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Add explore-page class to body when on this page
  useEffect(() => {
    document.body.classList.add("explore-page");

    return () => {
      document.body.classList.remove("explore-page");
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
      {/* Back button to home */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-10 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/40 text-white text-sm"
      >
        Back to Home
      </Link>

      {/* Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold z-10">
        Explore Clans in 3D
      </div>

      {/* 3D Canvas with interactive clan buttons */}
      <Canvas3D sceneType={SceneType.HOME} />
    </div>
  );
}
