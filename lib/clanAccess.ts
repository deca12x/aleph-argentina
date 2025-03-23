"use client";

import { useChainId } from "wagmi";
import { mantleMainnet, zksyncMainnet } from "@/components/providers";
import { useCitizensOfMantleNFT } from "@/lib/nft";
import { clans } from "@/lib/poapData";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

// Define type for the return value of the hook
interface ClanAccessResult {
  canWrite: boolean;
  isLoading: boolean;
  reason: string | null;
}

// Interface for POAP token
interface POAPToken {
  id: string;
  event: {
    id: number;
    [key: string]: any;
  };
  [key: string]: any;
}

// API error response
interface ApiError {
  error: string;
}

// Function to check if an address owns a specific POAP
export async function checkPoapOwnership(
  address: string | undefined,
  poapIds: string[]
): Promise<boolean> {
  if (!address || poapIds.length === 0) {
    console.log("Missing address or POAP IDs", { address, poapIds });
    return false;
  }

  console.log(
    `Checking POAP ownership for address ${address} against POAPs:`,
    poapIds
  );

  try {
    console.log(`Calling API route: /api/poap?address=${address}`);

    // Call our backend API route instead of the POAP API directly
    const response = await fetch(`/api/poap?address=${address}`, {
      // Adding cache control to prevent caching issues
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    // Log full response info for debugging
    console.log(
      `API Response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `POAP API error: ${response.status} ${response.statusText}`,
        `Response body: ${errorText}`
      );

      // Fallback to dev mode check if API fails
      if (process.env.NODE_ENV === "development") {
        console.log("DEV MODE FALLBACK: Simulating POAP ownership check");
        return true;
      }
      return false;
    }

    // Parse the response
    const data = await response.json();

    // Check if the response is an error message
    if ("error" in data) {
      const errorData = data as ApiError;
      console.error("POAP API returned error:", errorData.error);

      // Fallback to dev mode
      if (process.env.NODE_ENV === "development") {
        console.log(
          "DEV MODE FALLBACK: Simulating POAP ownership check due to API error"
        );
        return true;
      }
      return false;
    }

    // Process as normal POAP tokens
    const tokens = data as POAPToken[];

    // Log the response for debugging
    console.log(`POAP API response received ${tokens.length} tokens`);

    if (tokens.length === 0) {
      console.log(`No POAPs found for address ${address}`);
      return false;
    }

    // Check if the user owns any of the required POAPs
    const matchingPoapIds = tokens
      .filter((token) => poapIds.includes(token.event.id.toString()))
      .map((token) => token.event.id.toString());

    const hasRequiredPoap = matchingPoapIds.length > 0;

    console.log(
      `User ${hasRequiredPoap ? "has" : "does not have"} required POAP`,
      hasRequiredPoap ? `Matching POAPs: ${matchingPoapIds.join(", ")}` : ""
    );
    return hasRequiredPoap;
  } catch (error) {
    console.error("Error checking POAP ownership:", error);

    // Fallback to dev mode check if API call fails
    if (process.env.NODE_ENV === "development") {
      console.log(
        "DEV MODE FALLBACK: Simulating POAP ownership check after error"
      );
      return true;
    }
    return false;
  }
}

/**
 * Hook to check if a user has access to write in a specific clan.
 * This is currently a mock implementation that will simulate access control.
 *
 * In a real implementation, this would check for POAPs, NFTs, or other credentials.
 */
export function useClanAccess(clanId?: string): ClanAccessResult {
  const [canWrite, setCanWrite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reason, setReason] = useState<string | null>(null);
  const { user, authenticated, ready } = usePrivy();

  useEffect(() => {
    const checkAccess = async () => {
      // Start with loading state
      setIsLoading(true);

      // Default to false if no clan ID or not authenticated
      if (!clanId || !authenticated || !ready || !user?.wallet?.address) {
        setCanWrite(false);
        setReason("Not connected or no clan specified");
        setIsLoading(false);
        return;
      }

      try {
        // In a real implementation, we would check for POAPs, NFTs, or other credentials here
        // For now, we're using a mock implementation with hardcoded values

        // Get wallet address
        const address = user.wallet.address.toLowerCase();

        // Mock POAP/NFT checks based on last character of address and clan
        // This is just for demo purposes
        const lastChar = address.slice(-1);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mantle clan (clan4) - allow addresses ending with odd numbers
        if (clanId === "clan4" || clanId === "mantle") {
          const hasAccess = parseInt(lastChar, 16) % 2 === 1;
          setCanWrite(hasAccess);
          setReason(
            hasAccess ? null : "Need a Mantle POAP to write in this clan"
          );
        }
        // ZKSync clan (clan3) - allow addresses ending with even numbers
        else if (clanId === "clan3" || clanId === "zksync") {
          const hasAccess = parseInt(lastChar, 16) % 2 === 0;
          setCanWrite(hasAccess);
          setReason(
            hasAccess ? null : "Need a zkSync POAP to write in this clan"
          );
        }
        // Urbe clan (clan2) - allow addresses ending with 0-7
        else if (clanId === "clan2" || clanId === "urbe") {
          const hasAccess = parseInt(lastChar, 16) < 8;
          setCanWrite(hasAccess);
          setReason(
            hasAccess ? null : "Need an Urbe POAP to write in this clan"
          );
        }
        // Crecimiento clan (clan1) - allow addresses ending with 8-F
        else if (clanId === "clan1" || clanId === "crecimiento") {
          const hasAccess = parseInt(lastChar, 16) >= 8;
          setCanWrite(hasAccess);
          setReason(
            hasAccess ? null : "Need a Crecimiento POAP to write in this clan"
          );
        }
        // Aleph clan (clan5) - allow any authenticated user
        else if (clanId === "clan5" || clanId === "aleph") {
          setCanWrite(true);
          setReason(null);
        }
        // Default for unknown clans
        else {
          setCanWrite(false);
          setReason("Unknown clan");
        }
      } catch (error) {
        console.error("Error checking clan access:", error);
        setCanWrite(false);
        setReason("Error checking access");
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [clanId, authenticated, ready, user?.wallet?.address]);

  return { canWrite, isLoading, reason };
}
