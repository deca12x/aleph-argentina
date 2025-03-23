"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useChat, ChatMessage } from '@/context/ChatContext'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { clans } from '@/lib/poapData'

// Define blockchain message interface
interface BlockchainMessage {
  id: string
  text: string
  sender: string
  displayName?: string
  timestamp: Date
  clan: string
  tier: 'basic' | 'standard' | 'premium'
}

// List of predefined bot messages for each clan
const botMessages: Record<string, string[]> = {
  // ZKSync messages
  mantle: [
    "ZKSync proving the future",
    "Rollups are the way forward",
    "Zero knowledge, max security",
    "Scaling without compromise",
    "ZK tech is revolutionary",
    "Layer2 ftw",
    "Validium scaling is here",
    "Fast finality on ZKSync",
    "zkEVM is the future",
    "Recursive proofs are amazing",
    "Lower fees, more txs",
    "Trustless bridges rock",
    "ZK proofs verified",
    "Account abstraction ftw",
    "The ZK revolution is now",
    "Provable computation rocks",
    "zkPorter scaling achieved",
    "Volition mode engaged",
    "Infinite scalability soon",
    "No more trusted setups"
  ],
  // Mantle messages
  clan4: [
    "Mantle network thriving",
    "Data availability solved",
    "Modular blockchains win",
    "Mantle TVL growing fast",
    "MNT to the moon!",
    "Redefining L2 scaling",
    "EigenDA integration soon",
    "Hyperscale your dApps now",
    "BFT consensus secured",
    "Mantle validators online",
    "Modular, not monolithic",
    "Mantle decentralized chain",
    "Mantle optimized rollups",
    "Bridged and ready to go",
    "We're building on Mantle",
    "Fast withdrawals active",
    "Lower gas fees on Mantle",
    "DAO governance works",
    "Fault proofs are coming",
    "Mantle ecosystem expanding"
  ],
  // Default messages for any other clan
  default: [
    "Web3 breaking barriers",
    "DeFi evolution continues",
    "NFTs are just getting started",
    "The decentralized future",
    "Blockchain not crypto",
    "Self-sovereign identity",
    "DAOs changing governance",
    "Public goods funding works",
    "On-chain verification live",
    "Cross-chain interop success",
    "Smart contracts are smart",
    "Tokenomics matter",
    "Quadratic funding for all",
    "Secure, audited contracts",
    "Social recovery enabled",
    "Trustless and permissionless",
    "Verifying without revealing",
    "Privacy tech is essential",
    "Coordination problems solved",
    "Regenerative crypto systems"
  ]
};

export default function ChatMessages() {
  const { messages, loading } = useChat()
  const [blockchainMessages, setBlockchainMessages] = useState<BlockchainMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
  // Extract clan ID from URL
  const clanIdMatch = pathname?.match(/\/clans\/([^\/]+)/)
  const clanId = clanIdMatch ? clanIdMatch[1] : 'mantle' // Default to mantle
  
  // Find the clan object for the current clan
  const currentClan = clans.find(clan => clan.id === clanId)
  
  // Get the primary and secondary colors for styling
  const primaryColor = currentClan?.visualProperties?.primaryColor || '#FF5722'
  const secondaryColor = currentClan?.visualProperties?.secondaryColor || '#FF9800'
  
  // Add bot messages on component mount and periodically
  useEffect(() => {
    // Get messages for current clan or use default
    const clanBotMessages = botMessages[clanId] || botMessages.default;
    
    // Initial bot messages (2-3)
    const addInitialBotMessages = () => {
      const initialCount = 2 + Math.floor(Math.random() * 2); // 2-3 messages
      const initialMessages: BlockchainMessage[] = [];
      
      for (let i = 0; i < initialCount; i++) {
        const randomIndex = Math.floor(Math.random() * clanBotMessages.length);
        initialMessages.push({
          id: `bot-${Date.now()}-${i}`,
          text: clanBotMessages[randomIndex],
          sender: `0x${Math.random().toString(16).substring(2, 10)}`,
          timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 10), // Random time in last 10 minutes
          clan: clanId,
          tier: Math.random() > 0.7 ? 'premium' : Math.random() > 0.5 ? 'standard' : 'basic'
        });
      }
      
      setBlockchainMessages(initialMessages);
    };
    
    // Periodically add new bot messages (every 15-45 seconds)
    const addRandomBotMessage = () => {
      // Skip sometimes to make it feel more natural
      if (Math.random() > 0.7) return;
      
      const randomIndex = Math.floor(Math.random() * clanBotMessages.length);
      const newMessage: BlockchainMessage = {
        id: `bot-${Date.now()}`,
        text: clanBotMessages[randomIndex],
        sender: `0x${Math.random().toString(16).substring(2, 10)}`,
        timestamp: new Date(),
        clan: clanId,
        tier: Math.random() > 0.7 ? 'premium' : Math.random() > 0.5 ? 'standard' : 'basic'
      };
      
      setBlockchainMessages(prev => [newMessage, ...prev.slice(0, 19)]); // Keep max 20 messages
    };
    
    // Add initial messages
    addInitialBotMessages();
    
    // Setup periodic addition of bot messages
    const intervalId = setInterval(() => {
      addRandomBotMessage();
    }, 15000 + Math.random() * 30000); // Random interval between 15-45 seconds
    
    return () => clearInterval(intervalId);
  }, [clanId]);
  
  // Listen for new user messages from the ephemeral chat
  useEffect(() => {
    const handleNewBlockchainMessage = (event: CustomEvent) => {
      const newMessage: BlockchainMessage = {
        id: event.detail.id,
        text: event.detail.text,
        sender: event.detail.sender,
        displayName: event.detail.displayName,
        timestamp: new Date(),
        clan: event.detail.clan,
        tier: event.detail.tier
      };
      
      setBlockchainMessages(prev => [newMessage, ...prev.slice(0, 19)]); // Keep max 20 messages
    };
    
    window.addEventListener('newBlockchainMessage', handleNewBlockchainMessage as EventListener);
    return () => {
      window.removeEventListener('newBlockchainMessage', handleNewBlockchainMessage as EventListener);
    };
  }, []);

  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Format sender address for display
  const formatAddress = (address: string) => {
    if (!address || address === 'unknown') return '0x...????'
    return `0x...${address.slice(-4)}`
  }
  
  // Get style based on message tier and clan colors
  const getTierGradient = (tier: 'basic' | 'standard' | 'premium') => {
    switch (tier) {
      case 'premium':
        return `linear-gradient(135deg, ${primaryColor}80, ${secondaryColor}80)`;
      case 'standard':
        return `linear-gradient(135deg, ${primaryColor}50, ${secondaryColor}50)`;
      default:
        return `linear-gradient(135deg, ${primaryColor}30, ${secondaryColor}30)`;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto overflow-y-auto z-[5000] px-4 py-2 pointer-events-none h-[60vh] md:h-[50vh]">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {blockchainMessages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -30, y: -5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ 
                duration: 0.4,
                type: 'spring',
                damping: 15
              }}
              className="mb-3 pointer-events-none"
              style={{
                transformOrigin: 'top left'
              }}
            >
              <div 
                className="inline-block min-w-[250px] max-w-[95%] rounded-[15px] px-4 py-3 text-white shadow-lg border border-white/15"
                style={{ 
                  backdropFilter: 'blur(12px)',
                  background: getTierGradient(message.tier),
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 break-words">
                    <p className="text-sm md:text-base font-greed">{message.text}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-white/80">
                      <span className="font-mono">{formatAddress(message.sender)}</span>
                      <div className="flex items-center gap-2">
                        {message.tier !== 'basic' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
                            {message.tier}
                          </span>
                        )}
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
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