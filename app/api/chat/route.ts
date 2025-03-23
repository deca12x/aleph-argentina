import { Server } from 'socket.io'
import { NextResponse } from 'next/server'

// Store connected clients and messages in memory (for demo purposes)
let io: any

// In a production app, you would use a database to store messages
const messages: any[] = []

export async function GET() {
  // Note: In a real implementation, this would be properly set up with Socket.IO
  // For now, we'll just return the current messages
  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Validate message
  if (!data.text || !data.sender) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }
  
  // Create message
  const message = {
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
} 