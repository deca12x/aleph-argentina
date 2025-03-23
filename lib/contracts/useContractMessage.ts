import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MessageStorageABI } from "./MessageStorageABI";
import { contractAddresses } from "./contractAddresses";

/**
 * Utility function to convert a string to bytes
 */
function textToHex(text: string): `0x${string}` {
  // Ensure message is exactly 60 characters (pad or truncate)
  const paddedText = text.padEnd(60, " ").substring(0, 60);

  // Convert to UTF-8 bytes
  const bytes = new TextEncoder().encode(paddedText);

  // Convert to hex string
  const hex = ("0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")) as `0x${string}`;

  return hex;
}

/**
 * Hook to send a message to the appropriate contract based on clan
 */
export function useContractMessage(clanId: string) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // Determine which contract address to use
  const getContractForClan = (): {
    address: `0x${string}`;
    network: "mantle" | "zksync";
  } => {
    // Default to zksync
    let network: "mantle" | "zksync" = "zksync";

    // Use Mantle network for these clans
    if (clanId === "mantle" || clanId === "urbe") {
      network = "mantle";
    }

    return {
      address: contractAddresses[network].messageStorage,
      network,
    };
  };

  // Set up mutation for writing to contract
  const { writeContract, data: hash } = useWriteContract();

  // Watch for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Update status based on transaction state
  if (isConfirming && status === "sending") {
    setStatus("sending");
  } else if (isSuccess && status === "sending") {
    setStatus("success");
  }

  /**
   * Send a message to the contract
   */
  const sendMessage = async (message: string) => {
    try {
      setStatus("sending");
      setError(null);

      // Get the contract for this clan
      const { address } = getContractForClan();

      // Convert message to hex format
      const messageHex = textToHex(message);

      // Send the transaction
      writeContract({
        address,
        abi: MessageStorageABI,
        functionName: "storeMessage",
        args: [messageHex],
      });
    } catch (err) {
      console.error("Error sending message to contract:", err);
      setStatus("error");
      setError(typeof err === "string" ? err : "Failed to send message");
    }
  };

  return {
    sendMessage,
    status,
    isConfirming,
    error,
  };
}
