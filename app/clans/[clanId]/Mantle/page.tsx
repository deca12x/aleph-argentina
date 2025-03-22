"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavButton from "@/components/NavButton";
import ChatMessages from "@/components/chat/ChatMessages";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import MatrixView from '@/components/MatrixView';
import RealLifeView from '@/components/RealLifeView';

interface Collection {
  id: number;
  title: string;
  subtitle: string;
  imageSrc: string;
  bgColor: string;
  link: string;
}

const collections: Collection[] = [
  {
    id: 1,
    title: 'Asado Mantle',
    subtitle: 'IRL Event',
    imageSrc: '/events/asado-mantle.png',
    bgColor: 'bg-blue-500/20',
    link: 'https://lu.ma/7kti91wl?tk=WNJEca'
  },
  {
    id: 2,
    title: 'Demo Day 1',
    subtitle: 'IRL Event',
    imageSrc: '/events/dmeoday1.png',
    bgColor: 'bg-purple-500/20',
    link: 'https://lu.ma/7kti91wl?tk=WNJEca'
  },
  {
    id: 3,
    title: 'Founder Mode',
    subtitle: 'IRL Event',
    imageSrc: '/events/foundermode.png',
    bgColor: 'bg-green-500/20',
    link: 'https://lu.ma/7kti91wl?tk=WNJEca'
  },
  {
    id: 4,
    title: 'Sozu BBQ',
    subtitle: 'IRL Event',
    imageSrc: '/events/sozubbq.png',
    bgColor: 'bg-yellow-500/20',
    link: 'https://lu.ma/7kti91wl?tk=WNJEca'
  }
];

// Mantle Network configuration
const MANTLE_NETWORK = {
  chainId: '0x1388', // 5000 in hex
  chainName: 'Mantle',
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.mantle.xyz'],
  blockExplorerUrls: ['https://explorer.mantle.xyz'],
};

export default function MantleClanPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'matrix' | 'reallife'>('matrix');
  const [walletConnected, setWalletConnected] = useState(false);

  // Function to dispatch events for chat visibility
  const dispatchChatEvent = (show: boolean) => {
    if (typeof window !== 'undefined') {
      const eventName = show ? 'showChat' : 'hideChat';
      window.dispatchEvent(new Event(eventName));
    }
  };

  // Toggle demo mode and dispatch appropriate event
  const toggleDemo = (show: boolean) => {
    setShowDemo(show);
    // Small delay to ensure the event happens after state update
    setTimeout(() => {
      dispatchChatEvent(show);
    }, 100);
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
    // Check wallet connection when component mounts
    checkWalletConnection();
    
    // When component mounts, ensure chat is hidden
    dispatchChatEvent(false);
    
    // When component unmounts, restore chat
    return () => {
      dispatchChatEvent(true);
    };
  }, [ready, authenticated, router]);

  // Function to check if wallet is connected
  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && 'ethereum' in window && window.ethereum) {
      try {
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setWalletConnected(true);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  // Function to connect wallet and switch to Mantle network
  const connectWalletAndSwitchNetwork = async () => {
    if (typeof window !== 'undefined' && 'ethereum' in window && window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        
        // Try to switch to Mantle network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: MANTLE_NETWORK.chainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [MANTLE_NETWORK],
              });
            } catch (addError) {
              console.error("Error adding Mantle network:", addError);
            }
          } else {
            console.error("Error switching to Mantle network:", switchError);
          }
        }
        
        // Show demo after wallet connection
        toggleDemo(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install a Web3 wallet like MetaMask to continue!");
    }
  };

  // Handle Enter Space button click
  const handleEnterSpace = () => {
    // Add transition effect
    document.body.classList.add('page-transitioning');
    setTimeout(() => {
      connectWalletAndSwitchNetwork();
      // This will be called after wallet connection, but also trigger here just in case
      toggleDemo(true);
      document.body.classList.remove('page-transitioning');
    }, 500);
  };

  // Toggle between Matrix and RealLife views
  const toggleDemoView = (view: 'matrix' | 'reallife') => {
    // Add transition effect
    document.body.classList.add('page-transitioning');
    setTimeout(() => {
      setActiveDemo(view);
      document.body.classList.remove('page-transitioning');
    }, 500);
  };

  // Handle back button click
  const handleBackClick = () => {
    // Add transition effect
    document.body.classList.add('page-transitioning');
    
    // Set timeout to navigate after transition effect starts
    setTimeout(() => {
      // Remove transitioning class before navigation
      document.body.classList.remove('page-transitioning');
      // Navigate to homepage
      router.push('/');
    }, 500);
  };

  if (!ready) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black cursor-ethereum">
      {/* Mantle logo button - always visible */}
      <a 
        href="https://mantle.xyz/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-8 right-4 md:top-22 md:right-10 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center hover:border-white/40 transition-all duration-300 shadow-lg hover:scale-105"
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
              A place where you can explore both IRL and digital experiences curated by Mantle.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map(collection => (
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
                <div className={`absolute inset-0 opacity-0 ${collection.bgColor} group-hover:opacity-30 transition-opacity duration-300`}></div>
                <div className="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h2 className="text-2xl font-bold text-white font-greed">{collection.title}</h2>
                  <p className="text-gray-300 text-sm mb-4">{collection.subtitle}</p>
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
              onClick={() => toggleDemoView('matrix')}
              className={`px-4 py-2 text-sm ${
                activeDemo === 'matrix' ? 'bg-white/20 text-white' : 'text-white/70'
              } transition-all`}
            >
              Matrix
            </button>
            <button
              onClick={() => toggleDemoView('reallife')}
              className={`px-4 py-2 text-sm ${
                activeDemo === 'reallife' ? 'bg-white/20 text-white' : 'text-white/70'
              } transition-all`}
            >
              Real Life
            </button>
          </div>

          {/* Display active demo view */}
          {activeDemo === 'matrix' ? <MatrixView /> : <RealLifeView />}
          
          {/* Only show chat messages when demo is shown */}
          <ChatMessages />
        </div>
      )}
    </main>
  );
}
