"use client";

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export default function UserProfileCard() {
  const { user, authenticated } = usePrivy();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Get last 4 characters of wallet address
  const shortAddress = user?.wallet?.address 
    ? `${user.wallet.address.slice(-4)}`
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: shortAddress,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    // Here we'll later add the actual message sending logic
  };

  if (!authenticated) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4" style={{ zIndex: 1000 }}>
      <div className="backdrop-blur-xl bg-black/30 rounded-2xl p-6 shadow-xl border border-white/20 hover:border-purple-500/50 transition-colors">
        {/* User Info Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-500/20 rounded-full p-2">
            <span className="text-white">🦊</span>
          </div>
          <div>
            <h3 className="text-white font-medium">Wallet: ...{shortAddress}</h3>
            <p className="text-white/60 text-sm">POAPs: Coming soon</p>
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </form>

        {/* Messages Display */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between text-sm text-white/60">
                <span>...{msg.sender}</span>
                <span>{msg.timestamp.toLocaleTimeString()}</span>
              </div>
              <p className="text-white mt-1">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 