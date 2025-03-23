import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"; // Disable caching for this route

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
  paymentAmount: string
}

let messages: EphemeralMessage[] = []

// Add initial messages for testing
if (messages.length === 0) {
  const now = new Date();
  messages = [
    {
      id: '1',
      text: 'Welcome to the on-chain wall!',
      sender: { address: '0x1234567890abcdef1234567890abcdef12345678', displayName: 'Admin' },
      timestamp: new Date(now.getTime() - 60000 * 2),
      expiresAt: new Date(now.getTime() + 60000 * 28),
      paymentAmount: '5.0'
    },
    {
      id: '2',
      text: 'You can pay to keep msgs longer',
      sender: { address: '0x2345678901abcdef2345678901abcdef23456789' },
      timestamp: new Date(now.getTime() - 60000),
      expiresAt: new Date(now.getTime() + 60000 * 4),
      paymentAmount: '0'
    },
    {
      id: '3',
      text: 'Premium placement for high bids!',
      sender: { address: '0x3456789012abcdef3456789012abcdef34567890' },
      timestamp: new Date(now.getTime()),
      expiresAt: new Date(now.getTime() + 60000 * 29),
      paymentAmount: '2.5'
    }
  ];
}

// Clean up expired messages every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = new Date()
    messages = messages.filter(msg => msg.expiresAt > now)
  }, 60000)
}

// GET handler to fetch messages
export async function GET(request: NextRequest) {
  try {
    // Clean expired messages before returning
    const now = new Date()
    messages = messages.filter(msg => msg.expiresAt > now)
    
    return NextResponse.json({
      success: true,
      count: messages.length,
      messages: messages
    })
  } catch (error) {
    console.error("Error fetching ephemeral messages:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch messages",
      messages: []
    }, { status: 500 });
  }
}

// POST handler to add a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, sender, paymentAmount, expiryMinutes } = body
    
    // Validate required fields
    if (!text || !sender || !sender.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate text length
    if (text.length > 280) {
      return NextResponse.json(
        { success: false, error: 'Message text too long (max 280 characters)' },
        { status: 400 }
      )
    }
    
    // Create a new message
    const now = new Date()
    const expiry = expiryMinutes || 30 // Default to 30 minutes if not specified
    
    const newMessage: EphemeralMessage = {
      id: crypto.randomUUID(),
      text: text.trim(),
      sender,
      timestamp: now,
      expiresAt: new Date(now.getTime() + expiry * 60000),
      paymentAmount: paymentAmount || '0'
    }
    
    // Add to messages array
    messages.push(newMessage)
    
    // Return success and the created message
    return NextResponse.json({
      success: true,
      message: newMessage
    })
  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
} 