import { NextRequest, NextResponse } from "next/server";
import { Server } from "socket.io";

// Store connected clients and messages in memory (for demo purposes)
let io: any;

// In-memory storage for chat messages (would be replaced with a real database in production)
let messages: any[] = [];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sender } = body;

    if (!text || !sender?.address) {
      return NextResponse.json(
        { error: "Message text and sender address are required" },
        { status: 400 }
      );
    }

    // Create new message
    const newMessage = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // In production, this would be stored in a database

    return NextResponse.json(
      { success: true, message: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding chat message:", error);
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}
