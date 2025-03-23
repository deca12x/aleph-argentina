"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MatrixView from '@/components/MatrixView';
import RealLifeView from '@/components/RealLifeView';

// Define ethereum window interface
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

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
    title: 'Boys NFT #1',
    subtitle: 'Mantle Collection',
    imageSrc: '/boys-nft-collection/image.webp',
    bgColor: 'bg-blue-500/20',
    link: 'https://lu.ma/7kti91wl?tk=WNJEca'
  },
  {
    id: 2,
    title: 'Boys NFT #2',
    subtitle: 'Mantle Collection',
    imageSrc: '/boys-nft-collection/image (1).webp',
    bgColor: 'bg-purple-500/20',
    link: 'https://lu.ma/7kti91wl?tk=WNJEca'
  },
  {
    id: 3,
    title: 'Boys NFT #3',
    subtitle: 'Mantle Collection',
    imageSrc: '/boys-nft-collection/image (2).webp',
    bgColor: 'bg-green-500/20',
    link: 'https://lu.ma/7kti91wl?tk=WNJEca'
  },
  {
    id: 4,
    title: 'Boys NFT #4',
    subtitle: 'Mantle Collection',
    imageSrc: '/boys-nft-collection/image (3).webp',
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

export default function CollectionsPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'matrix' | 'reallife'>('matrix');
  const [walletConnected, setWalletConnected] = useState(false);

  // Function to check if wallet is connected
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Function to connect wallet and switch to Mantle network
  const connectWalletAndSwitchNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
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
        setShowDemo(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install a Web3 wallet like MetaMask to continue!");
    }
  };

  // Handle Enter Space button click
  const handleEnterSpace = () => {
    connectWalletAndSwitchNetwork();
  };

  return (
    <main className="min-h-screen bg-black cursor-ethereum">
      {!showDemo ? (
        <div className="container mx-auto px-4 py-16">
          <header className="flex flex-col items-center justify-center text-center mb-16">
            <h1 className="text-5xl md:text-7xl text-white font-bold mb-6 font-megazoid">
              Mantle Space
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Explore our curated NFT collections featuring exclusive digital artworks on the 
              Mantle blockchain.
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
                  <h2 className="text-2xl font-bold text-white">{collection.title}</h2>
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
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
        <div>
          <div className="absolute top-0 left-0 z-50 p-6">
            <button
              onClick={() => setShowDemo(false)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>Back to BA.</span>
            </button>
          </div>

          <div className="absolute top-0 right-0 z-50 p-6">
            <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm p-2 rounded-full border border-white/10">
              <button
                onClick={() => setActiveDemo('matrix')}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                  activeDemo === 'matrix' 
                    ? 'bg-white/10 text-white' 
                    : 'hover:bg-white/5 text-white/70'
                }`}
              >
                Matrix
              </button>
              <button
                onClick={() => setActiveDemo('reallife')}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                  activeDemo === 'reallife' 
                    ? 'bg-white/10 text-white' 
                    : 'hover:bg-white/5 text-white/70'
                }`}
              >
                Real Life
              </button>
            </div>
          </div>

          {activeDemo === 'matrix' ? (
            <MatrixView />
          ) : (
            <RealLifeView />
          )}
        </div>
      )}
    </main>
  );
}
