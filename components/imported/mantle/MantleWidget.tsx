"use client";

import { useEffect, useState } from "react";

export default function MantleWidget() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating loading of external data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="w-full h-[300px] bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-4 flex items-center justify-center">
        <div className="animate-pulse text-white text-opacity-70">Loading Mantle data...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-4 text-white">
      <h3 className="text-xl font-semibold mb-4">Mantle Network</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded p-3">
          <p className="text-sm font-medium text-white/70">Network Status</p>
          <p className="text-lg font-bold text-green-400">Active</p>
        </div>
        
        <div className="bg-white/5 rounded p-3">
          <p className="text-sm font-medium text-white/70">Current Block</p>
          <p className="text-lg font-bold">12,345,678</p>
        </div>
        
        <div className="bg-white/5 rounded p-3">
          <p className="text-sm font-medium text-white/70">Gas Price</p>
          <p className="text-lg font-bold">0.001 MNT</p>
        </div>
        
        <div className="bg-white/5 rounded p-3">
          <p className="text-sm font-medium text-white/70">Transactions</p>
          <p className="text-lg font-bold">2.5M+</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm text-white/70">
          This is a placeholder component. You can replace this with actual code imported from another project.
        </p>
      </div>
    </div>
  );
} 