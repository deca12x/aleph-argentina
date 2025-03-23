import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic" // Disable caching

// In-memory storage for chat messages (would use a database in production)
interface Sender {
  address: string;
  displayName?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

// Store messages in memory (for demo purposes)
const messages: ChatMessage[] = []

// Add some initial messages for demonstration
if (messages.length === 0) {
  [
    "Welcome to the Aleph Argentina chat!",
    "This is a demo of the chat system",
    "You can send messages and they will appear here",
    "In a real app, these would be stored in a database"
  ].forEach((text, index) => {
    messages.push({
      id: `demo-${index}`,
      text,
      sender: {
        address: "0x1234567890123456789012345678901234567890",
        displayName: "System"
      },
      timestamp: new Date(Date.now() - (messages.length - index) * 60000)
    });
  });
}

export async function GET() {
  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate message
    if (!data.text || !data.sender) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    
    // Create message
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: data.text,
      sender: data.sender,
      timestamp: new Date()
    }
    
    // Add to in-memory store
    messages.push(message)
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.shift()
    }
    
    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
} 