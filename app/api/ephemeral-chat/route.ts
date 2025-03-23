import { NextRequest, NextResponse } from "next/server";

// In-memory storage for chat messages (would be replaced with a real database in production)
let messages: any[] = [];

// GET handler for fetching messages
export async function GET(req: NextRequest) {
  try {
    // Simple filtering based on expiry time
    const now = new Date();
    messages = messages.filter((msg) => new Date(msg.expiresAt) > now);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching ephemeral chat messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST handler for adding a new message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sender, paymentAmount, expiryMinutes = 30 } = body;

    if (!text || !sender?.address) {
      return NextResponse.json(
        { error: "Message text and sender address are required" },
        { status: 400 }
      );
    }

    // Create new message with expiry time
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiryMinutes * 60000);

    const newMessage = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      paymentAmount: paymentAmount || "0",
    };

    messages.push(newMessage);

    // In production, this would be stored in a database

    return NextResponse.json(
      { success: true, message: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding ephemeral chat message:", error);
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}
