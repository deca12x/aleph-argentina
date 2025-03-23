"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import { Send, Clock, X, CheckCircle2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEphemeralChat } from '@/context/EphemeralChatContext'
import { clans } from '@/lib/poapData'

// Define message interface (exported for use in context)
export interface EphemeralMessage {
  id: string
  text: string
  sender: {
    address: string
    displayName?: string
  }
  timestamp: Date
  expiresAt: Date
  tier: 'basic' | 'standard' | 'premium'
}

// Transaction status type
type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

export default function EphemeralChat() {
  const { messages, sendMessage, tierDurations, tierPricing } = useEphemeralChat()
  const [inputMessage, setInputMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTierSelector, setShowTierSelector] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txStatus, setTxStatus] = useState<TransactionStatus>('idle')
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { user, authenticated, login } = usePrivy()
  const pathname = usePathname()
  
  // Extract clan ID from URL
  const clanIdMatch = pathname?.match(/\/clans\/([^\/]+)/)
  const clanId = clanIdMatch ? clanIdMatch[1] : 'mantle' // Default to mantle
  
  // Find the clan object for the current clan
  const currentClan = clans.find(clan => clan.id === clanId)
  
  // Get the primary and secondary colors for styling
  const primaryColor = currentClan?.visualProperties?.primaryColor || '#FF5722'
  const secondaryColor = currentClan?.visualProperties?.secondaryColor || '#FF9800'
  
  // Generate gradient styles for the clan
  const getGradientStyle = (opacity = '20') => {
    return `bg-gradient-to-r from-[${primaryColor}]/${opacity} to-[${secondaryColor}]/${opacity}`
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Format address for display
  const formatAddress = (address: string): string => {
    if (!address || address === 'unknown') return '0x...????'
    return `0x...${address.slice(-4)}`
  }

  // Calculate remaining time for a message
  const getRemainingTime = (expiresAt: Date): string => {
    const now = new Date()
    const diffMs = expiresAt.getTime() - now.getTime()
    if (diffMs <= 0) return 'Expired'
    
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`
    }
    return `${diffMins}m`
  }

  // Get style based on message tier and clan colors
  const getTierStyle = (tier: 'basic' | 'standard' | 'premium') => {
    switch (tier) {
      case 'premium':
        return `bg-gradient-to-r from-[${primaryColor}]/30 to-[${secondaryColor}]/30 border-[${primaryColor}]/40`
      case 'standard':
        return `bg-gradient-to-r from-[${primaryColor}]/20 to-[${secondaryColor}]/20 border-[${primaryColor}]/30`
      default:
        return 'bg-black/40 border-white/10'
    }
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !authenticated || isSubmitting) return

    setIsSubmitting(true)
    setTxStatus('pending')
    
    try {
      // First send to ephemeral chat
      const success = await sendMessage(inputMessage.trim(), selectedTier)
      
      if (success) {
        // Find the message we just sent
        const msgId = messages[messages.length - 1]?.id || crypto.randomUUID()
        setLastMessageId(msgId)
        
        // Simulate blockchain transaction
        setTxStatus('confirming')
        
        // Simulate blockchain confirmation (3-5 seconds)
        setTimeout(() => {
          // Dispatch event to add message to the public wall
          window.dispatchEvent(new CustomEvent('newBlockchainMessage', { 
            detail: {
              id: msgId,
              text: inputMessage.trim(),
              sender: user?.wallet?.address || 'unknown',
              displayName: user?.email?.address,
              clan: clanId,
              tier: selectedTier
            }
          }))
          
          setTxStatus('success')
          
          // Reset after 5 seconds
          setTimeout(() => {
            setTxStatus('idle')
            setLastMessageId(null)
          }, 5000)
        }, 3000 + Math.random() * 2000)
        
        setInputMessage('')
        setShowTierSelector(false)
        setSelectedTier('basic') // Reset to basic tier after sending
      } else {
        setTxStatus('error')
        setTimeout(() => setTxStatus('idle'), 4000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setTxStatus('error')
      setTimeout(() => setTxStatus('idle'), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle chat expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }

  // Handle wallet connection
  const handleConnect = async () => {
    if (!authenticated) {
      try {
        await login()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    }
  }

  // Show only the last 8 messages
  const visibleMessages = messages.slice(-8)

  return (
    <div 
      className={`fixed bottom-4 right-4 z-[1000] flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-[320px] md:w-[420px] shadow-2xl' : 'w-[280px] md:w-[320px] shadow-lg'
      }`}
    >
      {/* Transaction Status Indicator */}
      <AnimatePresence>
        {txStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-16 left-0 right-0 rounded-lg p-3 backdrop-blur-md border"
            style={{ 
              background: txStatus === 'success' 
                ? `linear-gradient(to right, ${primaryColor}40, ${secondaryColor}40)` 
                : txStatus === 'error'
                ? 'rgba(220, 38, 38, 0.2)'
                : 'rgba(0, 0, 0, 0.6)',
              borderColor: txStatus === 'success' 
                ? `${primaryColor}70` 
                : txStatus === 'error'
                ? 'rgba(220, 38, 38, 0.4)'
                : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center text-white">
              {txStatus === 'pending' && (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  <span>Preparing transaction...</span>
                </>
              )}
              {txStatus === 'confirming' && (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  <span>Writing to blockchain...</span>
                </>
              )}
              {txStatus === 'success' && (
                <>
                  <CheckCircle2 size={18} className="mr-2" />
                  <span>Message posted to wall!</span>
                </>
              )}
              {txStatus === 'error' && (
                <>
                  <X size={18} className="mr-2" />
                  <span>Transaction failed</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div 
        style={{ 
          background: `linear-gradient(to right, ${primaryColor}10, ${secondaryColor}10)`,
          borderColor: `${primaryColor}30` 
        }}
        className="backdrop-blur-xl rounded-t-xl border-t border-l border-r flex justify-between items-center px-3 py-2 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: primaryColor }}></div>
          <h3 className="text-white font-medium">
            {currentClan?.name || 'Ephemeral'} Chat
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/60">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
          <button className="text-white/70 hover:text-white">
            {isExpanded ? <X size={16} /> : <span>+</span>}
          </button>
        </div>
      </div>

      {/* Messages container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ 
              background: `linear-gradient(to right, ${primaryColor}05, ${secondaryColor}05)`,
              borderColor: `${primaryColor}20` 
            }}
            className="backdrop-blur-xl border-l border-r overflow-hidden"
          >
            <div 
              ref={chatContainerRef}
              className="max-h-[320px] overflow-y-auto py-2 px-3 flex flex-col space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              {visibleMessages.length === 0 ? (
                <div className="text-white/40 text-center py-6 text-sm">
                  No messages yet. Be the first!
                </div>
              ) : (
                visibleMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-lg p-2 border ${message.id === lastMessageId ? 'ring-2' : ''}`}
                    style={{ 
                      background: message.tier === 'premium' 
                        ? `linear-gradient(to right, ${primaryColor}25, ${secondaryColor}25)` 
                        : message.tier === 'standard'
                        ? `linear-gradient(to right, ${primaryColor}15, ${secondaryColor}15)`
                        : 'rgba(0, 0, 0, 0.4)',
                      borderColor: message.tier === 'premium' 
                        ? `${primaryColor}40` 
                        : message.tier === 'standard'
                        ? `${primaryColor}30`
                        : 'rgba(255, 255, 255, 0.1)',
                      ...(message.id === lastMessageId ? { '--ring-color': primaryColor } : {})
                    }}
                  >
                    <div className="text-sm text-white leading-tight mb-1">
                      <span className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono opacity-70">
                          {formatAddress(message.sender.address)}
                          {message.sender.displayName && (
                            <span className="ml-1 opacity-70">({message.sender.displayName})</span>
                          )}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            background: message.tier === 'premium' 
                              ? `${primaryColor}90`
                              : message.tier === 'standard'
                              ? `${primaryColor}70`
                              : `${primaryColor}50`,
                            color: 'white'
                          }}
                        >
                          {message.tier}
                        </span>
                      </span>
                      {message.text}
                      
                      {/* Transaction status indicator for actively processing messages */}
                      {message.id === lastMessageId && txStatus !== 'idle' && (
                        <div className="text-xs mt-1 flex items-center">
                          {txStatus === 'pending' && (
                            <span className="text-blue-300 flex items-center">
                              <Loader2 size={10} className="mr-1 animate-spin" />
                              Preparing...
                            </span>
                          )}
                          {txStatus === 'confirming' && (
                            <span className="text-yellow-300 flex items-center">
                              <Loader2 size={10} className="mr-1 animate-spin" />
                              Writing to chain...
                            </span>
                          )}
                          {txStatus === 'success' && (
                            <span className="text-green-300 flex items-center">
                              <CheckCircle2 size={10} className="mr-1" />
                              Posted to wall!
                            </span>
                          )}
                          {txStatus === 'error' && (
                            <span className="text-red-300 flex items-center">
                              <X size={10} className="mr-1" />
                              Failed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end items-center text-xs text-white/60">
                      <div className="flex items-center">
                        <Clock size={10} className="mr-1" />
                        <span>{getRemainingTime(message.expiresAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ 
              background: `linear-gradient(to right, ${primaryColor}05, ${secondaryColor}05)`,
              borderColor: `${primaryColor}20` 
            }}
            className="backdrop-blur-xl border-l border-r"
          >
            {authenticated ? (
              <div className="p-3">
                <div className="flex items-end">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm resize-none h-[40px] max-h-[100px] focus:outline-none focus:ring-1 focus:ring-white/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputMessage.trim()) {
                          setShowTierSelector(true);
                        }
                      }
                    }}
                    disabled={isSubmitting || txStatus === 'confirming'}
                    maxLength={140} // Limit message length
                  />
                  <button
                    className={`ml-2 bg-white/10 ${isSubmitting || txStatus === 'confirming' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'} text-white p-2 rounded-lg transition-colors`}
                    onClick={() => inputMessage.trim() && setShowTierSelector(true)}
                    disabled={isSubmitting || txStatus === 'confirming'}
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* Tier selector */}
                {showTierSelector && (
                  <div 
                    className="mt-3 p-3 rounded-lg border border-white/10"
                    style={{ 
                      background: `rgba(0, 0, 0, 0.6)`,
                      borderColor: `${primaryColor}40` 
                    }}
                  >
                    <h4 className="text-sm text-white mb-2">Select message duration:</h4>
                    <div className="flex justify-between mb-3">
                      <button
                        className={`px-3 py-1 rounded text-xs ${
                          selectedTier === 'basic' 
                            ? `text-white` 
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                        style={selectedTier === 'basic' ? { 
                          background: `linear-gradient(to right, ${primaryColor}30, ${secondaryColor}30)` 
                        } : {}}
                        onClick={() => setSelectedTier('basic')}
                        disabled={isSubmitting || txStatus === 'confirming'}
                      >
                        Basic<br/>({tierDurations.basic} min)
                      </button>
                      <button
                        className={`px-3 py-1 rounded text-xs ${
                          selectedTier === 'standard' 
                            ? 'text-white' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                        style={selectedTier === 'standard' ? { 
                          background: `linear-gradient(to right, ${primaryColor}30, ${secondaryColor}30)` 
                        } : {}}
                        onClick={() => setSelectedTier('standard')}
                        disabled={isSubmitting || txStatus === 'confirming'}
                      >
                        Standard<br/>({tierDurations.standard} min)
                      </button>
                      <button
                        className={`px-3 py-1 rounded text-xs ${
                          selectedTier === 'premium' 
                            ? 'text-white' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                        style={selectedTier === 'premium' ? { 
                          background: `linear-gradient(to right, ${primaryColor}30, ${secondaryColor}30)` 
                        } : {}}
                        onClick={() => setSelectedTier('premium')}
                        disabled={isSubmitting || txStatus === 'confirming'}
                      >
                        Premium<br/>({tierDurations.premium} min)
                      </button>
                    </div>
                    <div className="text-xs text-white/60 mb-3">
                      Cost: {tierPricing[selectedTier]}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1 rounded text-xs transition-colors"
                        onClick={() => setShowTierSelector(false)}
                        disabled={isSubmitting || txStatus === 'confirming'}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 text-white py-1 rounded text-xs transition-colors"
                        style={{ 
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          opacity: isSubmitting || txStatus === 'confirming' ? 0.7 : 1,
                          cursor: isSubmitting || txStatus === 'confirming' ? 'wait' : 'pointer'
                        }}
                        onClick={handleSendMessage}
                        disabled={isSubmitting || txStatus === 'confirming'}
                      >
                        {isSubmitting ? 'Sending...' : txStatus === 'confirming' ? 'Processing...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-white text-sm mb-2">Connect your wallet to chat</p>
                  <button 
                    className="text-white px-4 py-1.5 rounded-lg text-sm"
                    style={{ 
                      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
                    }}
                    onClick={handleConnect}
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <div 
        style={{ 
          background: `linear-gradient(to right, ${primaryColor}10, ${secondaryColor}10)`,
          borderColor: `${primaryColor}30` 
        }}
        className="backdrop-blur-xl rounded-b-xl border-b border-l border-r px-3 py-1.5 text-xs text-white/40 text-center"
      >
        Messages auto-expire based on tier
      </div>
    </div>
  )
}