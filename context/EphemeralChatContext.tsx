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
    if (!text.trim() || !user?.wallet?.address) return false

    // Sender information
    const sender = {
      address: user.wallet.address,
      displayName: user.email?.address || undefined
    }

    // Calculate expiration time based on payment amount
    const expiryMinutes = messageDuration(paymentAmount);

    try {
      // Send message to API
      const response = await fetch('/api/ephemeral-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          sender, 
          paymentAmount,
          expiryMinutes 
        })
      })

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.message) {
        // Convert string dates to Date objects
        const newMessage: EphemeralMessage = {
          ...result.message,
          timestamp: new Date(result.message.timestamp),
          expiresAt: new Date(result.message.expiresAt)
        }

        // Add to local state
        setMessages(prev => [...prev, newMessage])
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Fallback to local-only if API fails
      const newMessage: EphemeralMessage = {
        id: crypto.randomUUID(),
        text: text.trim(),
        sender,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + expiryMinutes * 60000),
        paymentAmount
      }
      
      // Add to local state
      setMessages(prev => [...prev, newMessage])
      
      // Return true since we still showed the message to the user
      return true
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