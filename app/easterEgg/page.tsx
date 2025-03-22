"use client";

import Canvas3D, { SceneType } from "@/components/3d/Canvas";

export default function ThreeDTest() {
  return (
    <div className="w-full h-screen">
      <Canvas3D sceneType={SceneType.DEVCONNECT} />
    </div>
  );
}
