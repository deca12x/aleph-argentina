"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

export enum SceneType {
  HOME = "HOME",
  DEVCONNECT = "DEVCONNECT",
}

interface Canvas3DProps {
  sceneType: SceneType;
}

export default function Canvas3D({ sceneType }: Canvas3DProps) {
  const Scene = dynamic(
    () => {
      switch (sceneType) {
        case SceneType.HOME:
          return import("./TestScene");
        case SceneType.DEVCONNECT:
          return import("./DevconnectScene");
        default:
          return import("./TestScene"); // fallback to default scene
      }
    },
    { ssr: false }
  );

  return (
    <Suspense fallback={<div className="text-white">Loading 3D scene...</div>}>
      <Scene />
    </Suspense>
  );
}
