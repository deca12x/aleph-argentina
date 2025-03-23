import { useEffect, useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseAbiItem, encodeAbiParameters, parseAbiParameters } from "viem";
import { MessageStorageABI } from "./MessageStorageABI";
import { contractAddresses } from "./contractAddresses";
import { mantleMainnet, zksyncMainnet } from "@/components/providers";
import {
  formatMessage,
  bytesToString,
  utf8StringToBytes,
} from "./messageUtils";

// Define the type of a message from the contract
export interface ContractMessage {
  id: string;
  text: string;
  sender: {
    address: string;
    displayName?: string;
  };
  timestamp: Date;
}

export function useMessageStorage(clanId: string) {
  const [messages, setMessages] = useState<ContractMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();

  // Determine which contract address to use based on the clan
  const getContractAddress = () => {
    // Default to zksync for safety
    let network: "mantle" | "zksync" = "zksync";

    // For Mantle and Urbe clans, use Mantle network
    if (clanId === "mantle" || clanId === "urbe") {
      network = "mantle";
    }
    // For Crecimiento and zkSync clans, use zkSync network
    else if (clanId === "crecimiento" || clanId === "zksync") {
      network = "zksync";
    }

    return contractAddresses[network].messageStorage;
  };

  // Get all messages from the contract
  const { data: contractData, refetch } = useReadContract({
    address: getContractAddress(),
    abi: MessageStorageABI,
    functionName: "getAllMessages",
  });

  // Set up mutation for writing messages
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Get the transaction receipt when a message is sent
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Convert contract data to our message format
  useEffect(() => {
    if (contractData) {
      try {
        const [messageBytes, timestamps] = contractData as [
          readonly `0x${string}`[],
          readonly number[]
        ];

        // Process messages
        const processedMessages: ContractMessage[] = [];

        for (let i = 0; i < messageBytes.length; i++) {
          const hexBytes = messageBytes[i];
          // Skip empty messages (checking if hex string is all zeros)
          if (
            hexBytes === "0x" ||
            hexBytes ===
              "0x0000000000000000000000000000000000000000000000000000000000000000"
          ) {
            continue;
          }

          // Convert hex to string - remove the '0x' prefix and convert
          const hexString = hexBytes.slice(2); // Remove '0x' prefix
          const bytes = new Uint8Array(
            hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
          );

          // Parse message from bytes
          const text = new TextDecoder()
            .decode(bytes)
            .trim()
            .replace(/\0/g, "");
          const timestamp = new Date(Number(timestamps[i]) * 1000);

          processedMessages.push({
            id: `${i}`,
            text,
            sender: {
              address: "Contract", // We don't have sender info from the contract
              displayName: undefined,
            },
            timestamp,
          });
        }

        setMessages(processedMessages);
        setIsLoading(false);
      } catch (err) {
        console.error("Error processing contract data:", err);
        setError("Error processing messages");
        setIsLoading(false);
      }
    }
  }, [contractData]);

  // Function to send a message to the contract
  const sendMessage = async (
    text: string,
    senderAddress: string,
    displayName?: string
  ) => {
    if (!text.trim()) return;

    try {
      // We need to pad/truncate the message to exactly 60 characters
      const paddedText = formatMessage(text);

      // Convert to bytes for the contract
      const messageBytes = utf8StringToBytes(paddedText);

      // Convert Uint8Array to hex string for the contract
      const hexBytes = ("0x" +
        Array.from(messageBytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")) as `0x${string}`;

      // Write to the contract
      writeContract({
        address: getContractAddress(),
        abi: MessageStorageABI,
        functionName: "storeMessage",
        args: [hexBytes],
      });

      // Add to local state immediately for responsiveness
      // This will be updated once the transaction is confirmed
      const optimisticMessage: ContractMessage = {
        id: `optimistic-${Date.now()}`,
        text,
        sender: {
          address: senderAddress,
          displayName,
        },
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending message");
    }
  };

  // Refresh messages periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  return {
    messages,
    sendMessage,
    isLoading,
    isConfirming,
    error,
  };
}
