"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"
import { useChat } from "@/context/ChatContext"
import { usePathname } from "next/navigation"

export default function UserProfileCard() {
  const [message, setMessage] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const { user } = usePrivy()
  const { sendMessage } = useChat()
  const pathname = usePathname()
  
  // Check if we're in a clan space (to show chat input)
  const isInClanSpace = pathname?.includes('/clans/')
  
  // Get wallet address from Privy
  const walletAddress = user?.wallet?.address
  const shortAddress = walletAddress 
    ? `0x...${walletAddress.slice(-4)}`
    : '0x...????'

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2
      const y = e.clientY - window.innerHeight / 2

      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(message.trim())
      setMessage("")
    }
  }

  return (
    <div
      id="chatWindow"
      ref={cardRef}
      className="fixed bottom-8 left-0 right-0 mx-auto w-[95%] md:w-[500px] transition-transform duration-300 ease-in-out pointer-events-auto"
      style={{
        transform: `translateY(${mousePosition.y / 80}px)`,
        zIndex: 9999
      }}
    >
      {/* Glass card - modern clean glassmorphism */}
      <div className="relative h-auto w-full rounded-[20px] overflow-hidden backdrop-blur-[12px] border border-white/20 shadow-lg bg-black/20">
        {/* Input area - only show in clan spaces */}
        {isInClanSpace && (
          <form onSubmit={handleSubmit} className="p-3 md:p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 rounded-[10px] px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white/30 border-none text-sm md:text-base font-greed"
              />
              <button
                type="submit"
                className="bg-white/10 hover:bg-white/20 transition-colors rounded-[10px] w-[40px] md:w-[50px] flex items-center justify-center text-white"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        )}

        {/* Info area */}
        <div className={`flex justify-between items-center px-3 ${isInClanSpace ? 'pb-3' : 'py-3'} md:px-4 ${isInClanSpace ? 'md:pb-4' : 'md:py-4'} text-white/70 text-xs md:text-sm`}>
          <div className="font-mono">{shortAddress}</div>
          <div className="flex gap-[5px]">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

