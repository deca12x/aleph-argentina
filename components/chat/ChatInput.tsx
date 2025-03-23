"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useClanAccess } from "@/lib/clanAccess";
import { usePrivy } from "@privy-io/react-auth";

interface ChatInputProps {
  clanId: string;
}

export default function ChatInput({ clanId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChat();
  const { canWrite, isLoading, reason } = useClanAccess(clanId);
  const { authenticated, ready, login, user } = usePrivy();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Send the message
    sendMessage(message.trim());

    // Clear the input
    setMessage("");
  };

  // Show login button if not authenticated
  if (!authenticated && ready) {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-[5000] px-4 mx-auto max-w-md">
        <button
          onClick={() => login()}
          className="w-full p-3 bg-black/80 hover:bg-black text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-md transition"
        >
          Connect Wallet to Chat
        </button>
      </div>
    );
  }

  // Show disabled input with reason if user can't write
  if (!canWrite && !isLoading) {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-[5000] px-4 mx-auto max-w-md">
        <div className="w-full p-3 bg-black/60 text-white/60 rounded-lg shadow-lg border border-white/10 backdrop-blur-md flex items-center justify-center">
          <span className="text-sm">
            {reason || "You cannot write messages in this clan"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[5000] px-4 mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={60}
          className="w-full p-3 pr-12 bg-black/80 text-white rounded-lg shadow-lg border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white disabled:text-white/50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
      <div className="mt-1 text-xs text-white/60 text-center">
        {message.length}/60 characters
      </div>
    </div>
  );
}
