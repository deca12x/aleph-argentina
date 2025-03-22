"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Canvas3D from "@/components/3d/Canvas";

export default function Home() {
  const { ready, authenticated, logout } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas as main content */}
      <div className="absolute inset-0">
        <Canvas3D />
      </div>

      {/* Minimal UI overlay */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            Welcome to Buenos Aires
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
