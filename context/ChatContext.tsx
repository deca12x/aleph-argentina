"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { usePrivy } from '@privy-io/react-auth'

// Define the message type
export interface ChatMessage {
  id: string
  text: string
  sender: {
    address: string
    displayName?: string
  }
  timestamp: Date
}

// Define the context type
interface ChatContextType {
  messages: ChatMessage[]
  sendMessage: (text: string) => void
  loading: boolean
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => {},
  loading: true
})

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext)

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = usePrivy()

  // Load initial messages and set up polling
  useEffect(() => {
    // First, load any stored messages from localStorage for immediate display
    const localMessages: ChatMessage[] = JSON.parse(
      localStorage.getItem('ephemeralChat') || '[]'
    )
    setMessages(localMessages)
    
    // Then fetch from API if available
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat')
        if (response.ok) {
          const data = await response.json()
          if (data.messages && data.messages.length) {
            setMessages(data.messages)
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Set up polling for new messages every 3 seconds
    const intervalId = setInterval(fetchMessages, 3000)
    
    return () => clearInterval(intervalId)
  }, [])

  // Save messages to localStorage on changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ephemeralChat', JSON.stringify(messages.slice(-50))) // Keep only last 50 messages
    }
  }, [messages])

  // Function to send a message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      sender: {
        address: user?.wallet?.address || 'unknown',
        displayName: user?.email?.address || undefined
      },
      timestamp: new Date()
    }

    // Add to local state immediately for responsiveness
    setMessages(prev => [...prev, newMessage])

    // Send to API
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: newMessage.text,
          sender: newMessage.sender
        })
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <ChatContext.Provider value={{ messages, sendMessage, loading }}>
      {children}
    </ChatContext.Provider>
  )
} 