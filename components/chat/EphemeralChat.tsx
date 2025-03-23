"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import { Send, Clock, X, CheckCircle2, Loader2, Info, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEphemeralChat } from '@/context/EphemeralChatContext'
import { clans } from '@/lib/poapData'
import { useSwitchChain, useChainId } from 'wagmi'
import { mantleMainnet, zksyncMainnet } from '@/components/providers'
import { cn } from '@/lib/utils'

// Message sender type
export interface MessageSender {
  address: string
  displayName?: string
}

// Message type
export interface EphemeralMessage {
  id: string
  text: string
  sender: MessageSender
  timestamp: Date
  expiresAt: Date
  paymentAmount: string
}

// Transaction status type
type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

// Max wall messages
const MAX_WALL_MESSAGES = 16;

// Format address helper function
const formatAddress = (address: string): string => {
  if (!address || address === 'unknown') return '0x...????'
  return `0x...${address.slice(-4)}`
}

export default function EphemeralChat() {
  const { messages, sendMessage, messageDuration } = useEphemeralChat()
  const [inputMessage, setInputMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPaymentInput, setShowPaymentInput] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('0')
  const [minimumPayment, setMinimumPayment] = useState('0')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txStatus, setTxStatus] = useState<TransactionStatus>('idle')
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const [wallMessages, setWallMessages] = useState<EphemeralMessage[]>([])
  const [minPaymentToReplace, setMinPaymentToReplace] = useState<string>('0')
  const [isWallFull, setIsWallFull] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { user, authenticated, login } = usePrivy()
  const pathname = usePathname()
  const router = useRouter()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // Extract clan ID from URL
  const clanId = pathname.split('/').filter(Boolean)[1] || '1'
  
  // Find the clan with the matching ID
  const currentClan = clans.find(c => c.id.toString() === clanId) || clans[0]
  
  // Get network token symbol based on chainId
  const tokenSymbol = chainId === 5000 || chainId === 5003 ? 'MNT' : 'ETH'
  
  // Get the primary and secondary colors for styling
  const primaryColor = currentClan?.visualProperties?.primaryColor || '#FF5722'
  const secondaryColor = currentClan?.visualProperties?.secondaryColor || '#FF9800'
  
  // Load and organize wall messages
  useEffect(() => {
    // Sort messages by payment amount (highest first)
    const sortedMessages = [...messages].sort((a, b) => {
      const amountA = parseFloat(a.paymentAmount) || 0
      const amountB = parseFloat(b.paymentAmount) || 0
      return amountB - amountA
    })

    // Take the top messages up to MAX_WALL_MESSAGES
    const topMessages = sortedMessages.slice(0, MAX_WALL_MESSAGES)
    
    // Fill remaining slots with empty placeholders
    const emptySlots = MAX_WALL_MESSAGES - topMessages.length
    const placeholders = Array(emptySlots > 0 ? emptySlots : 0).fill(null).map((_, i) => ({
      id: `empty-${i}`,
      text: '',
      sender: { address: '' },
      timestamp: new Date(),
      expiresAt: new Date(),
      paymentAmount: '0'
    }))
    
    const wallMessagesList = [...topMessages, ...placeholders]
    setWallMessages(wallMessagesList)
    
    // Update minimum payment required (lowest amount on wall + 0.000001)
    if (topMessages.length >= MAX_WALL_MESSAGES) {
      const lowestPayment = parseFloat(topMessages[topMessages.length - 1].paymentAmount) || 0
      setMinPaymentToReplace((lowestPayment + 0.000001).toFixed(6))
    } else {
      setMinPaymentToReplace('0')
    }
  }, [messages])

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Ensure correct network is selected
  useEffect(() => {
    if (!switchChain || !authenticated) return
    
    const ensureCorrectNetwork = async () => {
      if (currentClan.id === 'mantle' && chainId !== mantleMainnet.id) {
        try {
          await switchChain({ chainId: mantleMainnet.id })
        } catch (error) {
          console.error('Error switching to Mantle network:', error)
        }
      } else if (currentClan.id === 'zksync' && chainId !== zksyncMainnet.id) {
        try {
          await switchChain({ chainId: zksyncMainnet.id })
        } catch (error) {
          console.error('Error switching to zkSync network:', error)
        }
      }
    }
    
    ensureCorrectNetwork()
  }, [currentClan.id, chainId, switchChain, authenticated])

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

  // Handle sending a message to the blockchain
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !authenticated || isSubmitting) return
    
    // Validate payment amount
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount)) {
      alert(`Please enter a valid ${tokenSymbol} amount`)
      return
    }
    
    // Check if the wall is full and the payment is less than the minimum required
    if (isWallFull && amount < parseFloat(minPaymentToReplace)) {
      alert(`The wall is full. To replace a message, you need to pay more than ${minPaymentToReplace} ${tokenSymbol}`)
      return
    }

    setIsSubmitting(true)
    setTxStatus('pending')
    
    try {
      // First send to ephemeral chat (local chat)
      const success = await sendMessage(inputMessage.trim(), paymentAmount)
      
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
              clan: currentClan.id,
              paymentAmount: paymentAmount
            }
          }))
          
          // Update local wall messages state optimistically
          if (wallMessages.length < MAX_WALL_MESSAGES) {
            // Add new message if wall isn't full
            setWallMessages(prev => [...prev, {
              id: msgId,
              text: inputMessage.trim(),
              sender: { 
                address: user?.wallet?.address || 'unknown',
                displayName: user?.email?.address 
              },
              timestamp: new Date(),
              expiresAt: new Date(Date.now() + messageDuration(paymentAmount) * 60000),
              paymentAmount: paymentAmount
            }].sort((a, b) => parseFloat(b.paymentAmount) - parseFloat(a.paymentAmount)))
          } else {
            // Replace cheapest message if wall is full and new message pays more
            if (parseFloat(paymentAmount) > parseFloat(minPaymentToReplace)) {
              setWallMessages(prev => {
                const newMessages = [...prev]
                // Remove cheapest message
                newMessages.shift()
                // Add new message
                newMessages.push({
                  id: msgId,
                  text: inputMessage.trim(),
                  sender: { 
                    address: user?.wallet?.address || 'unknown',
                    displayName: user?.email?.address 
                  },
                  timestamp: new Date(),
                  expiresAt: new Date(Date.now() + messageDuration(paymentAmount) * 60000),
                  paymentAmount: paymentAmount
                })
                // Sort by payment amount (highest first)
                return newMessages.sort((a, b) => parseFloat(b.paymentAmount) - parseFloat(a.paymentAmount))
              })
            }
          }
          
          setTxStatus('success')
          
          // Reset after 5 seconds
          setTimeout(() => {
            setTxStatus('idle')
            setLastMessageId(null)
          }, 5000)
        }, 3000 + Math.random() * 2000)
        
        setInputMessage('')
        setShowPaymentInput(false)
        setPaymentAmount('0')
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

      {/* On-chain Wall Status */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-16 left-0 right-0 rounded-lg p-3 backdrop-blur-md border"
            style={{ 
              background: 'rgba(0, 0, 0, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center text-white">
              <Info size={16} className="mr-2 flex-shrink-0" />
              <div className="text-xs">
                {wallMessages.length < MAX_WALL_MESSAGES ? (
                  <span>Wall has {wallMessages.length}/{MAX_WALL_MESSAGES} messages. You can post for free!</span>
                ) : (
                  <span>Wall is full! Min payment to replace: {minPaymentToReplace} {tokenSymbol}</span>
                )}
              </div>
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
            {currentClan?.name || 'On-chain'} Wall
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
                      background: parseFloat(message.paymentAmount) > 10 
                        ? `linear-gradient(to right, ${primaryColor}25, ${secondaryColor}25)` 
                        : parseFloat(message.paymentAmount) > 0
                        ? `linear-gradient(to right, ${primaryColor}15, ${secondaryColor}15)`
                        : 'rgba(0, 0, 0, 0.4)',
                      borderColor: parseFloat(message.paymentAmount) > 10
                        ? `${primaryColor}40` 
                        : parseFloat(message.paymentAmount) > 0
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
                            background: parseFloat(message.paymentAmount) > 10 
                              ? `${primaryColor}90`
                              : parseFloat(message.paymentAmount) > 0
                              ? `${primaryColor}70`
                              : `${primaryColor}50`,
                            color: 'white'
                          }}
                        >
                          {message.paymentAmount} {tokenSymbol}
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
                          setShowPaymentInput(true);
                        }
                      }
                    }}
                    disabled={isSubmitting || txStatus === 'confirming'}
                    maxLength={60} // Limit message length to 60 characters as per contract spec
                  />
                  <button
                    className={`ml-2 bg-white/10 ${isSubmitting || txStatus === 'confirming' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'} text-white p-2 rounded-lg transition-colors`}
                    onClick={() => inputMessage.trim() && setShowPaymentInput(true)}
                    disabled={isSubmitting || txStatus === 'confirming'}
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* Character count indicator */}
                <div className="text-xs text-right mt-1 text-white/50">
                  {inputMessage.length}/60 characters
                </div>

                {/* Warning about NFT/POAP requirement when not in the space */}
                {!pathname.includes('/clans/') && inputMessage.trim() && (
                  <div 
                    className="mt-3 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-lg"
                  >
                    <div className="flex items-start mb-2">
                      <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mr-2 mt-0.5" />
                      <h4 className="text-sm font-medium text-yellow-400">Access Required</h4>
                    </div>
                    <p className="text-xs text-white/90 mb-2">
                      You must be a verified NFT/POAP holder to write messages on this public wall. Enter the clan space to participate.
                    </p>
                    <ul className="text-xs text-white/80 list-disc pl-4 mb-2 space-y-1">
                      <li>Only 16 messages can appear on the wall at once</li>
                      <li>Higher bids will remain longer on the wall</li>
                      <li>When wall is full, new bids will replace the lowest paid messages</li>
                      <li>Set a higher price to ensure your message stays visible</li>
                    </ul>
                    <button
                      className="w-full text-white/90 py-1.5 mt-1 rounded text-xs transition-colors bg-yellow-500/30 hover:bg-yellow-500/40"
                      onClick={() => {
                        // Find a default clan to navigate to
                        const defaultClan = clans[0]?.id || 'mantle';
                        router.push(`/clans/${defaultClan}`);
                      }}
                    >
                      Enter Clan Space to Post
                    </button>
                  </div>
                )}

                {/* Payment input */}
                {showPaymentInput && pathname.includes('/clans/') && (
                  <div 
                    className="mt-3 p-3 rounded-lg border border-white/10"
                    style={{ 
                      background: `rgba(0, 0, 0, 0.6)`,
                      borderColor: `${primaryColor}40` 
                    }}
                  >
                    <h4 className="text-sm text-white mb-2">Set payment amount:</h4>
                    
                    {/* Payment info */}
                    <div className="mb-3 text-xs text-white/80 flex items-start">
                      <AlertCircle size={14} className="mr-1.5 mt-0.5 flex-shrink-0" />
                      <span>
                        {wallMessages.length < MAX_WALL_MESSAGES 
                          ? `The wall has ${wallMessages.length}/${MAX_WALL_MESSAGES} slots available. You can post for free or pay to improve placement.` 
                          : `The wall is full. To replace a message, you must pay more than ${minPaymentToReplace} ${tokenSymbol}.`}
                      </span>
                    </div>
                    
                    {/* Payment input field */}
                    <div className="flex items-center mb-3">
                      <input 
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min="0"
                        step="0.000001"
                        className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
                        placeholder={`Enter amount (${tokenSymbol})`}
                      />
                      <span className="ml-2 text-white/80 text-sm">{tokenSymbol}</span>
                    </div>
                    
                    {/* Message placement info */}
                    {parseFloat(paymentAmount) > 0 && (
                      <div className="mb-3 text-xs text-white/70">
                        {wallMessages.length > 0 ? (
                          wallMessages.length >= MAX_WALL_MESSAGES ? (
                            parseFloat(paymentAmount) > parseFloat(minPaymentToReplace) ? (
                              <span className="text-green-300">Your message will replace the cheapest message in the wall.</span>
                            ) : (
                              <span className="text-yellow-300">Not enough to replace any messages. Increase your payment.</span>
                            )
                          ) : (
                            <span>Your message will be added to the wall.</span>
                          )
                        ) : (
                          <span>You'll be the first message on the wall!</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-1 rounded text-xs transition-colors"
                        onClick={() => setShowPaymentInput(false)}
                        disabled={isSubmitting || txStatus === 'confirming'}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 text-white py-1 rounded text-xs transition-colors"
                        style={{ 
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                          opacity: isSubmitting || txStatus === 'confirming' || (wallMessages.length >= MAX_WALL_MESSAGES && parseFloat(paymentAmount) <= parseFloat(minPaymentToReplace)) ? 0.7 : 1,
                          cursor: isSubmitting || txStatus === 'confirming' || (wallMessages.length >= MAX_WALL_MESSAGES && parseFloat(paymentAmount) <= parseFloat(minPaymentToReplace)) ? 'not-allowed' : 'pointer'
                        }}
                        onClick={handleSendMessage}
                        disabled={isSubmitting || txStatus === 'confirming' || (wallMessages.length >= MAX_WALL_MESSAGES && parseFloat(paymentAmount) <= parseFloat(minPaymentToReplace))}
                      >
                        {isSubmitting 
                          ? 'Sending...' 
                          : txStatus === 'confirming' 
                          ? 'Processing...' 
                          : `Post for ${paymentAmount} ${tokenSymbol}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-white text-sm mb-2">Connect your wallet to post messages</p>
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
        {wallMessages.length >= MAX_WALL_MESSAGES 
          ? `Pay >${minPaymentToReplace} ${tokenSymbol} to replace messages` 
          : `${MAX_WALL_MESSAGES - wallMessages.length} free slots available`}
      </div>
    </div>
  )
}