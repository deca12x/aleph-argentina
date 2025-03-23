"use client";

import { useEffect, useState } from "react";

// Define the message type
export interface ContractMessage {
  id: string;
  text: string;
  sender: {
    address: string;
    displayName?: string;
  };
  timestamp: Date;
}

/**
 * Hook to fetch messages from the smart contract for a specific clan
 */
export function useContractMessages(clanId: string) {
  const [messages, setMessages] = useState<ContractMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine which network to use based on clan
  const getNetwork = (): "mantle" | "zksync" => {
    if (clanId === "mantle" || clanId === "urbe") {
      return "mantle";
    }
    return "zksync";
  };

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const network = getNetwork();
        const response = await fetch(`/api/chat?network=${network}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status}`);
        }

        const data = await response.json();

        // Format timestamps as Date objects
        const formattedMessages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));

        setMessages(formattedMessages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch messages"
        );
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling
    const intervalId = setInterval(fetchMessages, 10000); // Every 10 seconds

    return () => clearInterval(intervalId);
  }, [clanId]);

  return {
    messages,
    loading,
    error,
  };
}
