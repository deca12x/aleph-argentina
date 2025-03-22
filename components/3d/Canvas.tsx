"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Canvas3D() {
  return (
    <div className="h-[100vh] w-full bg-slate-800">
      <Suspense
        fallback={<div className="text-white">Loading 3D scene...</div>}
      >
        <Scene />
      </Suspense>
    </div>
  );
}
