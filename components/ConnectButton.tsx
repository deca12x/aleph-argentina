"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";

const ConnectButton: React.FC = () => {
  const { login, logout, ready, user } = usePrivy();

  if (!ready) {
    return (
      <div className="flex justify-center items-center h-max">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* White backdrop glow effect on hover */}
      <div className="absolute -inset-1 bg-white/0 rounded-lg blur-md transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110"></div>
      
      <button
        className="relative flex items-center justify-center bg-primary py-3 px-10 text-white rounded-lg text-lg font-semibold shadow-md transition-all duration-300 group-hover:translate-y-[-5px]"
        onClick={!user ? login : logout}
      >
        {!user ? "Log in" : "Log out"}
      </button>
    </div>
  );
};

export default ConnectButton;
