"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { EphemeralMessage } from '@/components/chat/EphemeralChat'

// Define the context type
interface EphemeralChatContextType {
  messages: EphemeralMessage[]
  sendMessage: (text: string, paymentAmount: string) => Promise<boolean>
  loading: boolean
  error: string | null
  // Keep duration calculation for expiry
  messageDuration: (paymentAmount: string) => number // returns minutes
}

// Create the context with a default value
const EphemeralChatContext = createContext<EphemeralChatContextType>({
  messages: [],
  sendMessage: async () => false,
  loading: true,
  error: null,
  messageDuration: () => 30, // default 30 minutes
})

// Sample bot messages
const botMessages = [
  "¡Bienvenidos a Aleph LATAM!",
  "Buenos Aires is amazing! 🇦🇷",
  "Blockchain for everyone!",
  "ZK proofs are the future",
  "Mantle scale for everyone",
  "Want to learn about crypto? Visit the LATAM hub",
  "Web3 is for builders",
  "Join our hackathon next month!",
  "Excited about the LATAM DAO launch",
  "Thank you to all our sponsors!",
  "Next meetup: Friday 8PM at Aleph Hub",
  "Have you claimed your POAP yet?",
  "Check out the new dApps showcase",
  "NFTs are more than just art",
  "ZK scaling solutions workshop tomorrow",
  "DeFi is revolutionizing finance in LATAM",
  "Learn Solidity at our next workshop",
  "Looking for beta testers for our new dApp",
  "Follow us on Twitter @AlephLATAM",
  "¡Vamos Argentina! 🇦🇷",
];

// Sample bot addresses
const botAddresses = [
  "0x8901a4eafb8ac4c86e8a7656c9992894bce52ffb",
  "0x9a34e6ce0a31a7c8abf87312bd4845ab07950f19",
  "0x7348943c8d263ea253133699f3ea3f5567afbf76",
  "0x1d49d3fa9a32b146d8afb7ee20c970a4a8db11b0",
  "0xed5af388653567af2f388e6224dc7c4b3241c544",
];

// Custom hook to use the ephemeral chat context
export const useEphemeralChat = () => useContext(EphemeralChatContext)

// Provider component
export function EphemeralChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<EphemeralMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = usePrivy()

  // Calculate message duration based on payment amount
  // Higher payments = longer duration
  const messageDuration = (paymentAmount: string): number => {
    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      return 30; // Default 30 minutes for free messages
    } else if (amount < 1) {
      return 60; // 1 hour for small payments
    } else if (amount < 5) {
      return 120; // 2 hours for medium payments
    } else if (amount < 10) {
      return 240; // 4 hours for large payments
    } else {
      return 1440; // 24 hours for premium payments
    }
  };

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/ephemeral-chat')
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.messages) {
        // Convert string dates to Date objects
        const formattedMessages: EphemeralMessage[] = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          expiresAt: new Date(msg.expiresAt)
        }))
        
        setMessages(formattedMessages)
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load messages')
      
      // Fall back to local storage if API fails
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Load messages from localStorage
  const loadFromLocalStorage = () => {
    const storedMessages = localStorage.getItem('ephemeralMessages')
    
    if (storedMessages) {
      try {
        // Parse stored messages and convert string dates back to Date objects
        const parsedMessages: EphemeralMessage[] = JSON.parse(storedMessages, (key, value) => {
          if (key === 'timestamp' || key === 'expiresAt') {
            return new Date(value)
          }
          return value
        })
        
        // Filter out expired messages
        const now = new Date()
        const validMessages = parsedMessages.filter(msg => msg.expiresAt > now)
        
        setMessages(validMessages)
      } catch (error) {
        console.error('Error parsing stored messages:', error)
        // If there's an error, clear stored messages
        localStorage.removeItem('ephemeralMessages')
      }
    }
    
    // If in development and no stored messages, add some sample data
    if (process.env.NODE_ENV === 'development' && (!storedMessages || JSON.parse(storedMessages).length === 0)) {
      addSampleMessages()
    }
  }

  // Add sample messages for development
  const addSampleMessages = () => {
    const mockMessages: EphemeralMessage[] = [
      {
        id: '1',
        text: 'Welcome to the on-chain wall!',
        sender: { address: '0x1234567890abcdef1234567890abcdef12345678', displayName: 'Admin' },
        timestamp: new Date(Date.now() - 60000 * 2),
        expiresAt: new Date(Date.now() + 60000 * 28),
        paymentAmount: '5.0'
      },
      {
        id: '2',
        text: 'You can pay to keep msgs longer',
        sender: { address: '0x2345678901abcdef2345678901abcdef23456789' },
        timestamp: new Date(Date.now() - 60000),
        expiresAt: new Date(Date.now() + 60000 * 4),
        paymentAmount: '0'
      },
      {
        id: '3',
        text: 'Premium placement for high bids!',
        sender: { address: '0x3456789012abcdef3456789012abcdef34567890' },
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 60000 * 29),
        paymentAmount: '2.5'
      }
    ]

    setMessages(mockMessages)
  }

  // Initialize: Load from API or localStorage
  useEffect(() => {
    fetchMessages()
    
    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 15000) // Every 15 seconds
    
    return () => clearInterval(intervalId)
  }, [])

  // Bot message generator
  useEffect(() => {
    // Function to create a random bot message
    const createBotMessage = () => {
      const randomMessageIndex = Math.floor(Math.random() * botMessages.length);
      const randomAddressIndex = Math.floor(Math.random() * botAddresses.length);
      
      const text = botMessages[randomMessageIndex];
      const address = botAddresses[randomAddressIndex];
      
      // Randomly decide if this is a premium message (1 in 4 chance)
      const isPremium = Math.random() < 0.25;
      const paymentAmount = isPremium ? 
        (Math.random() * 5 + 5).toFixed(2) : // 5-10 for premium 
        (Math.random() * 0.2).toFixed(2);    // 0-0.2 for standard

      // Calculate expiry time
      const expiryMinutes = messageDuration(paymentAmount);
      
      // Create the bot message
      const botMessage: EphemeralMessage = {
        id: crypto.randomUUID(),
        text,
        sender: {
          address,
          displayName: isPremium ? "AlephBot Premium" : "AlephBot"
        },
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + expiryMinutes * 60000),
        paymentAmount
      };
      
      // Add to messages array
      setMessages(prev => {
        // If wall is getting full, remove older bot messages
        let updatedMessages = [...prev];
        const botCount = updatedMessages.filter(msg => 
          msg.sender.displayName === "AlephBot" || msg.sender.displayName === "AlephBot Premium"
        ).length;
        
        // If we have a lot of bot messages, start removing the oldest ones
        if (botCount > 10) {
          // Find the oldest bot message
          const oldestBotIndex = updatedMessages.findIndex(msg => 
            msg.sender.displayName === "AlephBot" || msg.sender.displayName === "AlephBot Premium"
          );
          
          if (oldestBotIndex !== -1) {
            updatedMessages.splice(oldestBotIndex, 1);
          }
        }
        
        return [...updatedMessages, botMessage];
      });
    };
    
    // Create a bot message every 2-5 seconds
    const botInterval = setInterval(() => {
      createBotMessage();
    }, Math.random() * 3000 + 2000); // 2-5 seconds
    
    return () => clearInterval(botInterval);
  }, []);

  // Effect to remove expired messages
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setMessages(prevMessages => prevMessages.filter(msg => msg.expiresAt > now))
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Save messages to localStorage on changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ephemeralMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Function to send a message
  const sendMessage = async (text: string, paymentAmount: string): Promise<boolean> => {
    if (!text.trim()) return false;

    // Ensure we have a default sender even if user is not logged in
    const sender = {
      address: user?.wallet?.address || crypto.randomUUID(),
      displayName: user?.email?.address || undefined
    };

    // Calculate expiration time based on payment amount
    const expiryMinutes = messageDuration(paymentAmount);

    try {
      // Create the message locally
      const newMessage: EphemeralMessage = {
        id: crypto.randomUUID(),
        text: text.trim(),
        sender,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + expiryMinutes * 60000),
        paymentAmount
      };
      
      // Add to local state
      setMessages(prev => [...prev, newMessage]);
      
      // Return true since we added the message successfully
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create a fallback message
      const newMessage: EphemeralMessage = {
        id: crypto.randomUUID(),
        text: text.trim(),
        sender,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + expiryMinutes * 60000),
        paymentAmount
      };
      
      // Add to local state
      setMessages(prev => [...prev, newMessage]);
      
      // Return true since we still showed the message to the user
      return true;
    }
  }

  return (
    <EphemeralChatContext.Provider value={{ 
      messages, 
      sendMessage,
      loading,
      error,
      messageDuration
    }}>
      {children}
    </EphemeralChatContext.Provider>
  )
} 