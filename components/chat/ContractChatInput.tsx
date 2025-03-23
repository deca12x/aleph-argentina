"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useClanAccess } from "@/lib/clanAccess";
import { useContractMessage } from "@/lib/contracts";

interface ContractChatInputProps {
  clanId: string;
}

export default function ContractChatInput({ clanId }: ContractChatInputProps) {
  const [input, setInput] = useState("");
  const { user, authenticated, login } = usePrivy();
  const { canWrite, isLoading: accessLoading, reason } = useClanAccess(clanId);
  const { sendMessage, status, isConfirming } = useContractMessage(clanId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Send the message to the contract
    await sendMessage(input);

    // Clear input regardless of success/failure for better UX
    setInput("");
  };

  // If user isn't authenticated, show login button
  if (!authenticated) {
    return (
      <div className="fixed bottom-0 inset-x-0 mb-8 z-[1000]">
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={login}
            className="w-full py-3 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 text-white font-medium hover:bg-black/60 transition"
          >
            Connect wallet to send messages
          </button>
        </div>
      </div>
    );
  }

  // If user can't write in this clan, show reason
  if (!canWrite && !accessLoading) {
    return (
      <div className="fixed bottom-0 inset-x-0 mb-8 z-[1000]">
        <div className="max-w-md mx-auto px-4">
          <div className="w-full py-3 px-4 bg-black/60 text-white/60 rounded-lg border border-white/10 text-center">
            {reason || "You can't write messages in this clan"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 mb-8 z-[1000]">
      <div className="max-w-md mx-auto px-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message (max 60 chars)..."
            maxLength={60}
            disabled={status === "sending" || isConfirming}
            className="w-full py-3 px-4 pr-12 bg-black/70 backdrop-blur-md rounded-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || status === "sending" || isConfirming}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {status === "sending" || isConfirming ? (
              <LoadingSpinner />
            ) : (
              <SendIcon />
            )}
          </button>
        </form>

        <div className="mt-1 text-right text-xs text-white/50">
          {input.length}/60 characters
        </div>
      </div>
    </div>
  );
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin w-5 h-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

// Send icon component
function SendIcon() {
  return (
    <svg
      className="w-5 h-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}
