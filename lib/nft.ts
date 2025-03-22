import { useAccount, useReadContract } from "wagmi";
import { parseAbiItem } from "viem";

// NFT Collection Addresses
export const NFT_ADDRESSES = {
  CITIZENS_OF_MANTLE: "0x7cf4ac414c94e03ecb2a7d6ea8f79087453caef0",
} as const;

// Basic ERC721 ABI with just the balanceOf function
const erc721Abi = [
  parseAbiItem("function balanceOf(address owner) view returns (uint256)"),
] as const;

// Hook to check if user owns NFTs from a specific collection
export const useNFTOwnership = (collectionAddress: `0x${string}`) => {
  const { address } = useAccount();

  const { data: balance, isLoading } = useReadContract({
    address: collectionAddress,
    abi: erc721Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return {
    hasNFT: balance ? Number(balance) > 0 : false,
    isLoading,
  };
};

// Specific hook for Citizens of Mantle NFT
export const useCitizensOfMantleNFT = () => {
  return useNFTOwnership(NFT_ADDRESSES.CITIZENS_OF_MANTLE as `0x${string}`);
};
