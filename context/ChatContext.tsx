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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();

  // Load initial messages and set up polling
  useEffect(() => {
    // First, load any stored messages from localStorage for immediate display
    try {
      const localMessages: ChatMessage[] = JSON.parse(
        localStorage.getItem("ephemeralChat") || "[]"
      );
      setMessages(localMessages);
    } catch (err) {
      console.error("Error parsing stored chat messages:", err);
    }

    // Then fetch from API if available
    const fetchMessages = async () => {
      try {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 5000);

        const response = await fetch("/api/chat", {
          signal: abortController.signal,
        }).catch((error) => {
          // Handle fetch errors (e.g., network issues)
          console.warn("Chat fetch failed, using local data instead:", error);
          return null;
        });

        clearTimeout(timeoutId);

        if (response && response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.warn("Error in chat message processing:", error);
        // Using cached data from localStorage as a fallback
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up polling for new messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Save messages to localStorage on changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "ephemeralChat",
        JSON.stringify(messages.slice(-50))
      ); // Keep only last 50 messages
    }
  }, [messages]);

  // Function to send a message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      sender: {
        address: user?.wallet?.address || "unknown",
        displayName: user?.email?.address || undefined,
      },
      timestamp: new Date(),
    };

    // Add to local state immediately for responsiveness
    setMessages((prev) => [...prev, newMessage]);

    // Send to API
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMessage.text,
          sender: newMessage.sender,
        }),
      }).catch((error) => {
        console.warn("Failed to send message to server:", error);
        // Message is already in local state so user experience is preserved
      });
    } catch (error) {
      console.warn("Error sending message:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, loading }}>
      {children}
    </ChatContext.Provider>
  );
}
