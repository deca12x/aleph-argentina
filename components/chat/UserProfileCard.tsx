"use client";

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function UserProfileCard() {
  const { user, authenticated } = usePrivy();
  const shortAddress = user?.wallet?.address 
    ? `${user.wallet.address.slice(-4)}`
    : '';

  if (!authenticated) return null;

  return (
    <div className="w-[500px]">
      {/* Glass card */}
      <div className="rounded-[30px] overflow-hidden backdrop-blur-xl border border-white/20 bg-white/10 shadow-lg">        
        {/* Content */}
        <div className="p-8">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-500/20 rounded-full p-3">
              <span className="text-2xl">🦊</span>
            </div>
            <div>
              <h3 className="text-white text-xl font-medium">Wallet: ...{shortAddress}</h3>
              <p className="text-white/60">POAPs: Coming soon</p>
            </div>
          </div>

          {/* Message Input */}
          <form className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/10"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-purple-900/20"
              >
                Send
              </button>
            </div>
          </form>

          {/* Messages Display */}
          <div className="mt-6 space-y-3 max-h-48 overflow-y-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex justify-between text-sm text-white/40">
                <span>...1234</span>
                <span>12:00 PM</span>
              </div>
              <p className="text-white/80 mt-2">Example message</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 