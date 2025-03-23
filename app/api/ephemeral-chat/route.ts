import { NextRequest, NextResponse } from 'next/server'

// In-memory message store (this would normally be in a database or smart contract)
// This is only for development purposes and will reset when the server restarts
interface MessageSender {
  address: string
  displayName?: string
}

interface EphemeralMessage {
  id: string
  text: string
  sender: MessageSender
  timestamp: Date
  expiresAt: Date
  tier: 'basic' | 'standard' | 'premium'
}

let messages: EphemeralMessage[] = []

// Clean up expired messages every minute
const cleanupInterval = setInterval(() => {
  const now = new Date()
  messages = messages.filter(msg => new Date(msg.expiresAt) > now)
}, 60000)

// GET handler to fetch messages
export async function GET(request: NextRequest) {
  // Clean expired messages before returning
  const now = new Date()
  messages = messages.filter(msg => new Date(msg.expiresAt) > now)
  
  return NextResponse.json({ 
    messages,
    count: messages.length 
  })
}

// POST handler to add a new message
export async function POST(request: NextRequest) {
  try {
    const { text, sender, tier = 'basic' } = await request.json()
    
    // Validate required fields
    if (!text || !sender?.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate text length
    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      )
    }
    
    // Calculate expiration time based on tier
    const tierDurations = {
      basic: 5, // 5 minutes
      standard: 30, // 30 minutes
      premium: 120 // 2 hours
    }
    
    // Create new message
    const newMessage: EphemeralMessage = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + tierDurations[tier as keyof typeof tierDurations] * 60000),
      tier: tier as 'basic' | 'standard' | 'premium'
    }
    
    // In a real implementation, this would:
    // 1. Verify payment transaction from wallet
    // 2. Store message in database or smart contract
    // 3. Return success or failure
    
    // Add to in-memory storage
    messages.push(newMessage)
    
    // Return the created message
    return NextResponse.json({
      success: true,
      message: newMessage
    })
  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
} 