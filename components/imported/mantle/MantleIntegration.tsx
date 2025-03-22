"use client";

import { useState, useEffect } from "react";

// Mock data for Mantle transactions
const mockTransactions = [
  { id: "0x1a2b...3c4d", type: "Transfer", amount: "120 MNT", time: "2 mins ago", status: "Confirmed" },
  { id: "0x5e6f...7g8h", type: "Swap", amount: "45.5 MNT", time: "5 mins ago", status: "Confirmed" },
  { id: "0x9i10...11j12", type: "Stake", amount: "230 MNT", time: "12 mins ago", status: "Confirmed" },
  { id: "0x13k14...15l16", type: "Bridge", amount: "500 MNT", time: "28 mins ago", status: "Confirmed" },
];

// Mock data for Mantle tokens
const mockTokens = [
  { symbol: "MNT", name: "Mantle", price: "$0.75", change: "+2.5%" },
  { symbol: "ETH", name: "Ethereum", price: "$3,245.18", change: "+0.8%" },
  { symbol: "USDC", name: "USD Coin", price: "$1.00", change: "0.0%" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", price: "$68,245.32", change: "-1.2%" },
];

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function Tab({ label, active, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        active 
          ? "bg-white/10 text-white border-b-2 border-blue-500" 
          : "text-white/60 hover:bg-white/5 hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

export default function MantleIntegration() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="w-full h-[400px] bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-t-2 border-l-2 border-blue-500 rounded-full animate-spin mb-3"></div>
          <div className="text-white text-opacity-70">Loading Mantle data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-black/30 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-3"></div>
          <h3 className="text-xl font-semibold text-white">Mantle Network Explorer</h3>
        </div>
        <div className="text-white/60 text-sm">Live Data</div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-white/10 flex px-2">
        <Tab
          label="Transactions"
          active={activeTab === "transactions"}
          onClick={() => setActiveTab("transactions")}
        />
        <Tab
          label="Tokens"
          active={activeTab === "tokens"}
          onClick={() => setActiveTab("tokens")}
        />
        <Tab
          label="Network"
          active={activeTab === "network"}
          onClick={() => setActiveTab("network")}
        />
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "transactions" && (
          <div>
            <div className="grid grid-cols-5 text-white/60 text-xs font-medium mb-2 px-2">
              <div>Transaction</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Time</div>
              <div>Status</div>
            </div>
            <div className="space-y-2">
              {mockTransactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="grid grid-cols-5 bg-white/5 rounded p-3 text-sm text-white items-center"
                >
                  <div className="font-mono">{tx.id}</div>
                  <div>{tx.type}</div>
                  <div>{tx.amount}</div>
                  <div>{tx.time}</div>
                  <div>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "tokens" && (
          <div>
            <div className="grid grid-cols-4 text-white/60 text-xs font-medium mb-2 px-2">
              <div>Token</div>
              <div>Name</div>
              <div>Price</div>
              <div>24h Change</div>
            </div>
            <div className="space-y-2">
              {mockTokens.map((token) => (
                <div 
                  key={token.symbol} 
                  className="grid grid-cols-4 bg-white/5 rounded p-3 text-sm text-white items-center"
                >
                  <div className="font-bold">{token.symbol}</div>
                  <div>{token.name}</div>
                  <div>{token.price}</div>
                  <div className={token.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}>
                    {token.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "network" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-xs mb-1">Network Status</div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div className="text-lg font-semibold text-white">Active</div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-xs mb-1">Current TPS</div>
              <div className="text-lg font-semibold text-white">284.5</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-xs mb-1">Latest Block</div>
              <div className="text-lg font-semibold text-white">12,345,678</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-xs mb-1">Gas Price (Gwei)</div>
              <div className="text-lg font-semibold text-white">0.001</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 md:col-span-2">
              <div className="text-white/60 text-xs mb-1">Total Value Locked</div>
              <div className="text-2xl font-bold text-white">$1,245,678,901</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-white/10 text-xs text-white/40 flex justify-between">
        <div>Data refreshes automatically every 30 seconds</div>
        <div>Placeholder data - will be replaced with live data from external sources</div>
      </div>
    </div>
  );
} 