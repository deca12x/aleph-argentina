"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

function ClickableBox({
  position,
  color,
  href,
}: {
  position: [number, number, number];
  color: string;
  href: string;
}) {
  const router = useRouter();
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={2}
      onClick={() => router.push(href)}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        setHovered(false);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? "hotpink" : color}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}

function LogoutButton({ position }: { position: [number, number, number] }) {
  const { logout } = usePrivy();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      scale={0.5}
      onClick={logout}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        setHovered(false);
      }}
    >
      {/* First line of the X */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[3, 0.4, 0.4]} />
        <meshStandardMaterial
          color={hovered ? "#ef4444" : "#dc2626"}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      {/* Second line of the X */}
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[3, 0.4, 0.4]} />
        <meshStandardMaterial
          color={hovered ? "#ef4444" : "#dc2626"}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

export default function Scene() {
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

      <ClickableBox position={[-6, 2, 0]} color="orange" href="/clans/1" />
      <ClickableBox position={[-3, -2, 0]} color="blue" href="/clans/2" />
      <ClickableBox position={[0, 2, 0]} color="green" href="/clans/3" />
      <ClickableBox position={[3, -2, 0]} color="orange" href="/clans/4" />
      <ClickableBox position={[6, 2, 0]} color="blue" href="/clans/5" />

      {/* Positioned in top-right corner */}
      <LogoutButton position={[8, 4, 0]} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}
