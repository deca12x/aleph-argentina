"use client";

import { useRouter } from "next/navigation";

interface NavButtonProps {
  href: string;
  label: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export default function NavButton({ href, label, position = "top-left" }: NavButtonProps) {
  const router = useRouter();
  
  // Position classes
  const positionClasses = {
    "top-left": "top-6 left-6",
    "top-right": "top-6 right-6",
    "bottom-left": "bottom-6 left-6", 
    "bottom-right": "bottom-6 right-6"
  };

  return (
    <button 
      onClick={() => router.push(href)}
      className={`fixed ${positionClasses[position]} z-[8000] bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-white/40 text-white text-sm`}
    >
      {label}
    </button>
  );
} 