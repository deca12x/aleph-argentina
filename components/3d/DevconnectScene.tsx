// components/3d/DevconnectScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VoxelModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number;
}

function VoxelModel({ url, position = [0, 0, 0], scale = 1 }: VoxelModelProps) {
  const gltf = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={position}
      scale={scale}
    />
  );
}

export default function DevconnectScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10] }}
      style={{
        background: "#1e293b",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <hemisphereLight intensity={0.6} />

      <VoxelModel
        url="/voxel-assets/community_unicorn.glb"
        position={[0, 0, 0]}
        scale={0.5}
      />
      <VoxelModel
        url="/voxel-assets/borderless_earth.glb"
        position={[-3, 0, 0]}
        scale={0.5}
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={20}
      />
    </Canvas>
  );
}
