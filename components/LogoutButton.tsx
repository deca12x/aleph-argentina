"use client";

import { usePrivy } from "@privy-io/react-auth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = usePrivy();

  return (
    <button 
      onClick={logout}
      className="fixed top-6 right-6 z-[9000] bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-white/40"
      aria-label="Logout"
    >
      <LogOut className="w-5 h-5 text-white" />
    </button>
  );
} 