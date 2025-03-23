"use client";

import { useRouter } from "next/navigation";
import { clans } from "@/lib/poapData";
import type { Clan } from "@/lib/types";
import { use, useEffect, useState } from "react";
import Canvas3D, { SceneType } from "@/components/3d/Canvas";
import Image from "next/image";
import { useCitizensOfMantleNFT } from "@/lib/nft";
import { useSwitchChain, useChainId } from "wagmi";
import { mantleMainnet, zksyncMainnet } from "@/components/providers";
import MatrixView from "@/components/MatrixView";
import RealLifeView from "@/components/RealLifeView";
import NavButton from "@/components/NavButton";
import ChatMessages from "@/components/chat/ChatMessages";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useClanAccess } from "@/lib/clanAccess";

interface ClanPageProps {
  params: Promise<{
    clanId: string;
  }>;
}

interface Collection {
  id: number;
  title: string;
  subtitle: string;
  imageSrc: string;
  bgColor: string;
  link: string;
}

// Mantle specific collections
const mantleCollections: Collection[] = [
  {
    id: 1,
    title: "Asado Mantle",
    subtitle: "IRL Event",
    imageSrc: "/events/asado-mantle.png",
    bgColor: "bg-blue-500/20",
    link: "https://lu.ma/7kti91wl?tk=WNJEca",
  },
  {
    id: 2,
    title: "Demo Day 1",
    subtitle: "IRL Event",
    imageSrc: "/events/dmeoday1.png",
    bgColor: "bg-purple-500/20",
    link: "https://lu.ma/7kti91wl?tk=WNJEca",
  },
  {
    id: 3,
    title: "Founder Mode",
    subtitle: "IRL Event",
    imageSrc: "/events/foundermode.png",
    bgColor: "bg-green-500/20",
    link: "https://lu.ma/7kti91wl?tk=WNJEca",
  },
  {
    id: 4,
    title: "Sozu BBQ",
    subtitle: "IRL Event",
    imageSrc: "/events/sozubbq.png",
    bgColor: "bg-yellow-500/20",
    link: "https://lu.ma/7kti91wl?tk=WNJEca",
  },
];

// Mantle Network configuration
const MANTLE_NETWORK = {
  chainId: "0x1388", // 5000 in hex
  chainName: "Mantle",
  nativeCurrency: {
    name: "MNT",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.mantle.xyz"],
  blockExplorerUrls: ["https://explorer.mantle.xyz"],
};

// Remove the UI debug component and add a logging function instead
function logClanAccessInfo(clanId: string) {
  const { user } = usePrivy();
  const mantleNftCheck = useCitizensOfMantleNFT();
  const clanAccess = useClanAccess(clanId);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Clan Access Debug Info:", {
        clanId,
        canWrite: clanAccess.canWrite,
        isLoading: clanAccess.isLoading,
        reason: clanAccess.reason,
        userAddress: user?.wallet?.address || "Not connected",
        nftInfo:
          clanId === "clan2" || clanId === "clan4"
            ? {
                hasNFT: mantleNftCheck?.hasNFT,
                isLoading: mantleNftCheck?.isLoading,
                isError: mantleNftCheck?.isError,
              }
            : "Not applicable",
      });
    }
  }, [
    clanId,
    clanAccess,
    mantleNftCheck?.hasNFT,
    mantleNftCheck?.isLoading,
    mantleNftCheck?.isError,
    user?.wallet?.address,
  ]);

  return null;
}

export default function ClanPage({ params }: ClanPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { authenticated, ready, connectWallet, user } = usePrivy();

  // For Mantle-specific UI
  const [showDemo, setShowDemo] = useState(false);
  const [activeDemo, setActiveDemo] = useState<"matrix" | "reallife">("matrix");
  const [walletConnected, setWalletConnected] = useState(false);

  const clanId = resolvedParams.clanId;
  const clan = clans.find((c) => c.id === clanId);

  // Determine if this is the Mantle clan
  const isMantleClan = clan?.id === "mantle";

  // Only check NFT ownership for Mantle clan
  const nftCheck = isMantleClan ? useCitizensOfMantleNFT() : null;

  // Function to ensure wallet is connected
  const ensureWalletConnected = async () => {
    if (authenticated && ready && user) {
      const hasWallet = user.wallet && user.wallet.address;
      console.log("User wallet status:", { hasWallet, wallet: user.wallet });

      if (!hasWallet) {
        try {
          console.log("Attempting to connect wallet...");
          await connectWallet();
          return true;
        } catch (error) {
          console.error("Error connecting wallet:", error);
          return false;
        }
      }
      return true;
    }
    return false;
  };

  // Auto-switch to appropriate network based on clan
  useEffect(() => {
    console.log(
      "Switch chain effect running. switchChain exists?",
      !!switchChain,
      "current chainId:",
      chainId,
      "authenticated:",
      authenticated,
      "ready:",
      ready
    );

    const initializeWallet = async () => {
      if (!switchChain || !authenticated || !ready) return;

      const isWalletConnected = await ensureWalletConnected();
      if (!isWalletConnected) return;

      // For Mantle Clan and Urbe -> use Mantle Mainnet
      if (
        (clan?.id === "mantle" || clan?.id === "urbe") &&
        chainId !== mantleMainnet.id
      ) {
        console.log(`Switching to Mantle for clan ${clan?.id}`);
        try {
          await switchChain({ chainId: mantleMainnet.id });
        } catch (error) {
          console.error("Error switching to Mantle:", error);
          // Optionally show a user-friendly message
          if (typeof window !== "undefined") {
            // Only show in production, dev has the debug button
            if (process.env.NODE_ENV !== "development") {
              window.alert(
                "Please manually switch to Mantle network to interact with this clan"
              );
            }
          }
        }
      }
      // For zkSync Clan and Crecimiento -> use zkSync Mainnet
      else if (
        (clan?.id === "zksync" || clan?.id === "crecimiento") &&
        chainId !== zksyncMainnet.id
      ) {
        console.log(`Switching to zkSync for clan ${clan?.id}`);
        try {
          await switchChain({ chainId: zksyncMainnet.id });
        } catch (error) {
          console.error("Error switching to zkSync:", error);
          // Optionally show a user-friendly message
          if (typeof window !== "undefined") {
            // Only show in production, dev has the debug button
            if (process.env.NODE_ENV !== "development") {
              window.alert(
                "Please manually switch to zkSync network to interact with this clan"
              );
            }
          }
        }
      }
    };

    initializeWallet();
  }, [clan?.id, chainId, switchChain, authenticated, ready, user]);

  // Function to dispatch events for chat visibility (Mantle specific)
  const dispatchChatEvent = (show: boolean) => {
    if (typeof window !== "undefined") {
      const eventName = show ? "showChat" : "hideChat";
      window.dispatchEvent(new Event(eventName));
    }
  };

  // Toggle demo mode and dispatch appropriate event (Mantle specific)
  const toggleDemo = (show: boolean) => {
    setShowDemo(show);
    // Small delay to ensure the event happens after state update
    setTimeout(() => {
      dispatchChatEvent(show);
    }, 100);
  };

  // For Mantle clan UI when component mounts
  useEffect(() => {
    if (isMantleClan) {
      checkWalletConnection();
      dispatchChatEvent(false);

      return () => {
        dispatchChatEvent(true);
      };
    }
  }, [isMantleClan]);

  // Function to check if wallet is connected (Mantle specific)
  const checkWalletConnection = async () => {
    if (
      typeof window !== "undefined" &&
      "ethereum" in window &&
      window.ethereum
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts && accounts.length > 0) {
          setWalletConnected(true);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  // Function to connect wallet and switch to Mantle network (Mantle specific)
  const connectWalletAndSwitchNetwork = async () => {
    if (
      typeof window !== "undefined" &&
      "ethereum" in window &&
      window.ethereum
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);

        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: MANTLE_NETWORK.chainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [MANTLE_NETWORK],
              });
            } catch (addError) {
              console.error("Error adding Mantle network:", addError);
            }
          } else {
            console.error("Error switching to Mantle network:", switchError);
          }
        }

        toggleDemo(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install a Web3 wallet like MetaMask to continue!");
    }
  };

  // Handle Enter Space button click (Mantle specific)
  const handleEnterSpace = () => {
    document.body.classList.add("page-transitioning");
    setTimeout(() => {
      connectWalletAndSwitchNetwork();
      toggleDemo(true);
      document.body.classList.remove("page-transitioning");
    }, 500);
  };

  // Toggle between Matrix and RealLife views (Mantle specific)
  const toggleDemoView = (view: "matrix" | "reallife") => {
    document.body.classList.add("page-transitioning");
    setTimeout(() => {
      setActiveDemo(view);
      document.body.classList.remove("page-transitioning");
    }, 500);
  };

  // Handle back button click (Mantle specific)
  const handleBackClick = () => {
    document.body.classList.add("page-transitioning");
    setTimeout(() => {
      document.body.classList.remove("page-transitioning");
      router.push("/");
    }, 500);
  };

  if (!clan) {
    return (
      <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
        <h1 className="text-white text-3xl z-10">Clan not found</h1>
        <div className="absolute inset-0 bg-black/60 z-0"></div>
      </div>
    );
  }

  // Mantle clan specific UI
  if (isMantleClan) {
    return (
      <main className="min-h-screen bg-black cursor-ethereum">
        {/* Mantle logo button - always visible */}
        <a
          href="https://mantle.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-20 right-4 md:top-20 md:right-30 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center hover:border-white/40 transition-all duration-300 shadow-lg hover:scale-105"
          title="Visit Mantle Website"
        >
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <Image
              src="/icons/mantle-mnt-logo (1).png"
              alt="Mantle Logo"
              fill
              className="object-contain"
            />
          </div>
        </a>

        {!showDemo ? (
          <div className="container mx-auto px-4 py-16">
            {/* Return to home navigation */}
            <NavButton href="/" label="Back to Home" position="top-left" />

            <header className="flex flex-col items-center justify-center text-center mb-16">
              <h1 className="text-5xl md:text-7xl text-white font-bold mb-6 font-megazoid">
                Mantle Space
              </h1>
              <p className="text-gray-400 max-w-2xl font-greed">
                A place where you can explore both IRL and digital experiences
                curated by Mantle.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mantleCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={collection.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl aspect-square shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={collection.imageSrc}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div
                    className={`absolute inset-0 opacity-0 ${collection.bgColor} group-hover:opacity-30 transition-opacity duration-300`}
                  ></div>
                  <div className="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-2xl font-bold text-white font-greed">
                      {collection.title}
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                      {collection.subtitle}
                    </p>
                    <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-xs text-white font-medium">
                      Join Event
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-24 text-center">
              <button
                onClick={handleEnterSpace}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-greed"
              >
                <span>Enter Space</span>
                <div className="ml-3 w-6 h-6 relative transform group-hover:translate-x-1 transition-transform duration-300">
                  <Image
                    src="/icons/mantle-mnt-logo (1).png"
                    alt="Mantle Logo"
                    width={24}
                    height={24}
                    className="w-full h-full object-contain"
                  />
                </div>
              </button>
            </div>

            {/* NFT Debug Info - only show in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 w-full max-w-md mx-auto">
                {nftCheck?.isLoading ? (
                  <div className="mt-4 text-white text-center">
                    Checking NFT ownership...
                  </div>
                ) : (
                  <>
                    <div className="mt-4 p-4 bg-gray-900/80 backdrop-blur-sm rounded-lg text-white">
                      <h2 className="font-bold">Debug Info:</h2>
                      <pre className="mt-2 text-xs overflow-auto">
                        {JSON.stringify(
                          {
                            hasNFT: nftCheck?.hasNFT,
                            isCheckingNFT: nftCheck?.isLoading,
                            isError: nftCheck?.isError,
                            isWrongNetwork: nftCheck?.isWrongNetwork,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    {!nftCheck?.hasNFT && (
                      <div className="mt-4 p-4 bg-yellow-600/80 backdrop-blur-sm rounded-lg text-white">
                        To post in this clan, you need to own a Citizens of
                        Mantle NFT.
                        <a
                          href="https://mintle.app/explore/MANTLE:0x7cf4ac414c94e03ecb2a7d6ea8f79087453caef0"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:underline ml-1"
                        >
                          Get one here
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-screen relative overflow-hidden">
            {/* Back button */}
            <button
              onClick={handleBackClick}
              className="absolute top-4 left-4 md:top-6 md:left-6 z-50 px-4 py-2 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center gap-2 hover:bg-black/70 transition-all"
            >
              <span>← Back to BA</span>
            </button>

            {/* View toggle buttons */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 bg-black/50 backdrop-blur-md rounded-full flex overflow-hidden">
              <button
                onClick={() => toggleDemoView("matrix")}
                className={`px-4 py-2 text-sm ${
                  activeDemo === "matrix"
                    ? "bg-white/20 text-white"
                    : "text-white/70"
                } transition-all`}
              >
                Matrix
              </button>
              <button
                onClick={() => toggleDemoView("reallife")}
                className={`px-4 py-2 text-sm ${
                  activeDemo === "reallife"
                    ? "bg-white/20 text-white"
                    : "text-white/70"
                } transition-all`}
              >
                Real Life
              </button>
            </div>

            {/* Display active demo view */}
            {activeDemo === "matrix" ? <MatrixView /> : <RealLifeView />}

            {/* Only show chat messages when demo is shown */}
            <ChatMessages />
          </div>
        )}
      </main>
    );
  }

  // Default UI for other clans - improved from main but kept simpler than Mantle UI
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/devconnect-background.webp"
          alt="Devconnect Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Clan Name Display */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold z-10">
        Clan: {clan.name}
      </div>

      {/* Home button */}
      <NavButton href="/" label="Back to Home" position="top-left" />

      {/* Show chat messages for all clans */}
      <ChatMessages />

      {/* Log debug info to console only */}
      {process.env.NODE_ENV === "development" && logClanAccessInfo(clan.id)}
    </div>
  );
}
