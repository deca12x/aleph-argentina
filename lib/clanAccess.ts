"use client";

import { useChainId } from "wagmi";
import { mantleMainnet, zksyncMainnet } from "@/components/providers";
import { useCitizensOfMantleNFT } from "@/lib/nft";
import { clans } from "@/lib/poapData";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

// Interface for the result of clan access check
export interface ClanAccessResult {
  canWrite: boolean;
  isLoading: boolean;
  reason?: string;
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

// Hook to check if a user can write in a specific clan
export function useClanAccess(clanId: string | undefined) {
  const [result, setResult] = useState<ClanAccessResult>({
    canWrite: false,
    isLoading: true,
  });
  const chainId = useChainId();
  const mantleNftCheck = useCitizensOfMantleNFT();
  const [isCheckingPoap, setIsCheckingPoap] = useState(false);
  const { user } = usePrivy(); // Get the user from Privy

  useEffect(() => {
    const checkAccess = async () => {
      if (!clanId) {
        setResult({
          canWrite: false,
          isLoading: false,
          reason: "Invalid clan ID",
        });
        return;
      }

      const clan = clans.find((c) => c.id === clanId);
      if (!clan) {
        setResult({
          canWrite: false,
          isLoading: false,
          reason: "Clan not found",
        });
        return;
      }

      // Handle Urbe (clan2) - requires Mantle NFT on Mantle chain
      if (clan.id === "clan2") {
        if (chainId !== mantleMainnet.id) {
          setResult({
            canWrite: false,
            isLoading: false,
            reason: "Must be on Mantle network",
          });
          return;
        }

        setResult({
          canWrite: mantleNftCheck.hasNFT,
          isLoading: mantleNftCheck.isLoading,
          reason: mantleNftCheck.hasNFT ? undefined : "Must own a Mantle NFT",
        });
        return;
      }

      // Handle Crecimiento (clan1) - on zkSync, anyone can write
      if (clan.id === "clan1") {
        if (chainId !== zksyncMainnet.id) {
          setResult({
            canWrite: false,
            isLoading: false,
            reason: "Must be on zkSync network",
          });
          return;
        }

        setResult({
          canWrite: true,
          isLoading: false,
        });
        return;
      }

      // Handle Mantle (clan4) - requires Mantle POAP on Mantle chain
      if (clan.id === "clan4") {
        if (chainId !== mantleMainnet.id) {
          setResult({
            canWrite: false,
            isLoading: false,
            reason: "Must be on Mantle network",
          });
          return;
        }

        // Check if user has any of the required POAPs
        setIsCheckingPoap(true);
        try {
          // Get the user's wallet address from Privy
          const address = user?.wallet?.address;
          const hasPoap = await checkPoapOwnership(address, clan.poapIds);

          setResult({
            canWrite: hasPoap,
            isLoading: false,
            reason: hasPoap ? undefined : "Must own a Mantle POAP",
          });
        } catch (error) {
          console.error("Error checking POAP ownership:", error);
          setResult({
            canWrite: false,
            isLoading: false,
            reason: "Error checking POAP ownership",
          });
        } finally {
          setIsCheckingPoap(false);
        }
        return;
      }

      // Handle zkSync (clan3) - on zkSync, anyone can write
      if (clan.id === "clan3") {
        if (chainId !== zksyncMainnet.id) {
          setResult({
            canWrite: false,
            isLoading: false,
            reason: "Must be on zkSync network",
          });
          return;
        }

        setResult({
          canWrite: true,
          isLoading: false,
        });
        return;
      }

      // Default case
      setResult({
        canWrite: false,
        isLoading: false,
        reason: "Unknown clan access requirements",
      });
    };

    checkAccess();
  }, [clanId, chainId, mantleNftCheck.hasNFT, mantleNftCheck.isLoading, user]);

  return result;
}
