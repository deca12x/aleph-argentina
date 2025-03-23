import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { mantleMainnet, zksyncMainnet } from "@/components/providers";
import { MessageStorageABI, contractAddresses } from "@/lib/contracts";

// Create public clients for each network
const mantleClient = createPublicClient({
  chain: mantleMainnet,
  transport: http(),
});

const zksyncClient = createPublicClient({
  chain: zksyncMainnet,
  transport: http(),
});

// Simple cache to avoid too many RPC calls
let mantleMessagesCache: any = null;
let zksyncMessagesCache: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 20000; // 20 seconds

async function fetchMessagesFromChain(network: "mantle" | "zksync") {
  try {
    const client = network === "mantle" ? mantleClient : zksyncClient;
    const contractAddress = contractAddresses[network].messageStorage;

    // Call the contract to get all messages
    const data = await client.readContract({
      address: contractAddress,
      abi: MessageStorageABI,
      functionName: "getAllMessages",
    });

    // Process the raw data
    const [messageBytes, timestamps] = data as [
      readonly `0x${string}`[],
      readonly number[]
    ];

    // Format messages for frontend
    const messages = [];
    for (let i = 0; i < messageBytes.length; i++) {
      const hexBytes = messageBytes[i];

      // Skip empty messages
      if (
        hexBytes === "0x" ||
        hexBytes ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        continue;
      }

      // Convert hex to string
      const hexString = hexBytes.slice(2); // Remove '0x' prefix
      const bytes = new Uint8Array(
        hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
      );

      // Parse message from bytes
      const text = new TextDecoder().decode(bytes).trim().replace(/\0/g, "");
      const timestamp = new Date(Number(timestamps[i]) * 1000);

      messages.push({
        id: `${network}-${i}`,
        text,
        sender: {
          address: `${network}-contract`,
          displayName: network.charAt(0).toUpperCase() + network.slice(1),
        },
        timestamp,
      });
    }

    return messages;
  } catch (error) {
    console.error(`Error fetching messages from ${network}:`, error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get("network") as "mantle" | "zksync" | null;
  const now = Date.now();

  // Check if we need to refresh the cache
  const shouldRefetch = now - lastFetchTime > CACHE_TTL;

  // If specific network is requested
  if (network === "mantle") {
    if (!mantleMessagesCache || shouldRefetch) {
      mantleMessagesCache = await fetchMessagesFromChain("mantle");
      lastFetchTime = now;
    }
    return NextResponse.json({ messages: mantleMessagesCache });
  } else if (network === "zksync") {
    if (!zksyncMessagesCache || shouldRefetch) {
      zksyncMessagesCache = await fetchMessagesFromChain("zksync");
      lastFetchTime = now;
    }
    return NextResponse.json({ messages: zksyncMessagesCache });
  }
  // If no network specified, return both
  else {
    if (shouldRefetch || !mantleMessagesCache || !zksyncMessagesCache) {
      [mantleMessagesCache, zksyncMessagesCache] = await Promise.all([
        fetchMessagesFromChain("mantle"),
        fetchMessagesFromChain("zksync"),
      ]);
      lastFetchTime = now;
    }

    return NextResponse.json({
      messages: [...mantleMessagesCache, ...zksyncMessagesCache],
    });
  }
}

// No POST route needed - messages are sent directly from frontend to contract
