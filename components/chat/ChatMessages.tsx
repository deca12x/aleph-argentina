"use client"

import React, { useEffect, useRef } from 'react'
import { useChat, ChatMessage } from '@/context/ChatContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatMessages() {
  const { messages, loading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Format sender address for display
  const formatAddress = (address: string) => {
    if (!address || address === 'unknown') return '0x...????'
    return `0x...${address.slice(-4)}`
  }

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto overflow-y-auto z-[5000] px-4 py-2 pointer-events-none h-[60vh] md:h-[50vh]">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-3 pointer-events-none"
            >
              <div className="inline-block min-w-[250px] max-w-[95%] rounded-[12px] px-5 py-3 text-white backdrop-blur-md bg-black/40 border border-white/10 shadow-lg">
                <div className="flex items-start gap-2">
                  <div className="flex-1 break-words">
                    <p className="text-sm md:text-base font-greed">{message.text}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span className="font-mono">{formatAddress(message.sender.address)}</span>
                      <span>{formatTime(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 