"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"

export default function UserProfileCard() {
  const [message, setMessage] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const { user } = usePrivy()

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
      console.log("Message sent:", message)
      setMessage("")
      // Here you would handle sending the message
    }
  }

  return (
    <div
      id="chatWindow"
      ref={cardRef}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[500px] transition-transform duration-300 ease-in-out pointer-events-auto"
      style={{
        transform: `translateX(calc(-50% + ${mousePosition.x / 80}px)) translateY(${mousePosition.y / 80}px)`,
        zIndex: 9999
      }}
    >
      {/* Glass card - modern clean glassmorphism */}
      <div className="relative h-[120px] w-full rounded-[20px] overflow-hidden backdrop-blur-[12px] border border-white/20 shadow-lg bg-black/20">
        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 rounded-[10px] px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white/30 border-none text-base"
            />
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 transition-colors rounded-[10px] w-[50px] flex items-center justify-center text-white"
            >
              <Send size={20} />
            </button>
          </div>
        </form>

        {/* Info area */}
        <div className="flex justify-between items-center px-4 pb-4 text-white/70 text-sm">
          <div className="font-mono">{shortAddress}</div>
          <div className="flex gap-[5px]">
            <div className="w-5 h-5 rounded-full border border-white/30"></div>
            <div className="w-5 h-5 rounded-full border border-white/30"></div>
            <div className="w-5 h-5 rounded-full border border-white/30"></div>
            <div className="w-5 h-5 rounded-full border border-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

