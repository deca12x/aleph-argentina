"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { usePrivy } from "@privy-io/react-auth";
import {
  useMessageStorage,
  ContractMessage,
} from "@/lib/contracts/useMessageStorage";
import { useParams } from "next/navigation";

// Define the message type
export interface ChatMessage {
  id: string;
  text: string;
  sender: {
    address: string;
    displayName?: string;
  };
  timestamp: Date;
}

// Define the context type
interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  loading: boolean;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => {},
  loading: true,
});

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();
  const params = useParams();

  // Get the clanId from the route parameters
  const clanId = (params?.clanId as string) || "default";

  // Use our contract integration hook
  const {
    messages: contractMessages,
    sendMessage: sendContractMessage,
    isLoading: contractLoading,
    error: contractError,
  } = useMessageStorage(clanId);

  // Combine local and contract messages
  useEffect(() => {
    if (contractMessages && !contractLoading) {
      // Convert contract messages to ChatMessage format
      const formattedContractMessages: ChatMessage[] = contractMessages.map(
        (msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
        })
      );

      setLocalMessages(formattedContractMessages);
      setLoading(false);
    }
  }, [contractMessages, contractLoading]);

  // Load any local messages from localStorage on initial load
  useEffect(() => {
    // Load any stored messages from localStorage for immediate display
    const storedMessages: ChatMessage[] = JSON.parse(
      localStorage.getItem("ephemeralChat") || "[]"
    );

    if (storedMessages.length > 0) {
      setLocalMessages(storedMessages);
      setLoading(false);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (localMessages.length > 0) {
      localStorage.setItem(
        "ephemeralChat",
        JSON.stringify(localMessages.slice(-50))
      ); // Keep only last 50 messages
    }
  }, [localMessages]);

  // Function to send a message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Get wallet address and display name
    const walletAddress = user?.wallet?.address || "unknown";
    const displayName = user?.email?.address || undefined;

    // Call the contract send message function
    await sendContractMessage(text, walletAddress, displayName);

    // Note: The optimistic update is already handled in the useMessageStorage hook
  };

  return (
    <ChatContext.Provider
      value={{ messages: localMessages, sendMessage, loading }}
    >
      {children}
    </ChatContext.Provider>
  );
}
