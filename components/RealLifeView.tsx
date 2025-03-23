"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin, X, Gift, QrCode } from 'lucide-react';

// Location data
const locations = [
  {
    id: 1,
    name: "Aleph Hub",
    address: "Concepción Arenal 2989, C1426DGG, Cdad. Autónoma de Buenos Aires",
    description: "Home to our flagship 3D NFT Easter egg. Discover this digital collectible anchored to a real-world coordinate, visible only through your phone.",
    image: "/locations/aleph-hub-location.webp",
    qrCodeImage: "/locations/aleph-hub-8code.png",
    googleMapsUrl: "https://www.google.com/maps/place/Aleph+Hub/data=!4m2!3m1!1s0x0:0x3a22d7994f3ff7ec?sa=X&ved=1t:2428&ictx=111",
    tags: ["3D NFT", "Collectible", "AR Experience"],
    specialFeature: {
      title: "3D Easter Egg Collectible",
      description: "Step into the world of 3D NFT collectibles at Aleph Hub powered by Mantle! Scan the QR code when you arrive to reveal a unique 3D NFT anchored to this exact location. This exclusive digital art piece exists only in this physical space and can be collected and owned only by those who visit in person!",
      cta: "Visit to collect this 3D NFT"
    }
  },
  {
    id: 2,
    name: "Mantle Blockchain Hub",
    address: "San Martín 344, Buenos Aires, Argentina",
    description: "Find the hidden Mantle Alien Race NFT anchored to this location. Scan the QR code on site to reveal and claim this exclusive 3D digital asset.",
    image: "/boys-nft-collection/image (1).webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.6037,-58.3816",
    tags: ["Alien Race NFT", "Limited Edition", "GPS-Locked"]
  },
  {
    id: 3,
    name: "Crypto Art Gallery",
    address: "Defensa 791, San Telmo, Buenos Aires, Argentina",
    description: "Home to a mysterious Mantle Crystal 3D NFT. Visit this location to discover a rare digital collectible that can only be seen and claimed at these coordinates.",
    image: "/boys-nft-collection/image (2).webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.6173,-58.3722",
    tags: ["Crystal NFT", "Rare Find", "Location-Based"]
  },
  {
    id: 4,
    name: "Web3 Palermo Social Club",
    address: "Guatemala 4699, Buenos Aires, Argentina",
    description: "A special Jelly Army 3D NFT is hiding at this location. Visit in person and use your phone's camera to reveal this exclusive digital treasure.",
    image: "/boys-nft-collection/image (3).webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.5862,-58.4241",
    tags: ["Jelly Army", "Digital Treasure", "AR Collectible"]
  },
  {
    id: 5,
    name: "DeFi Conference Center",
    address: "Av. Corrientes 1234, Buenos Aires, Argentina",
    description: "Seek out the legendary Mantle Boy 3D NFT anchored to this physical location. This digital asset only reveals itself to visitors who scan the QR code on site.",
    image: "/boys-nft-collection/image.webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.6037,-58.3917",
    tags: ["Mantle Boy", "Legendary NFT", "Location-Based"]
  }
];

export default function RealLifeView() {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  const handleLocationClick = (locationId: number) => {
    // Add transition effect
    document.body.classList.add('page-transitioning');
    setTimeout(() => {
      setActiveLocation(locationId);
      document.body.classList.remove('page-transitioning');
    }, 300);
  };

  const closeLocationDetail = () => {
    // Add transition effect
    document.body.classList.add('page-transitioning');
    setTimeout(() => {
      setActiveLocation(null);
      document.body.classList.remove('page-transitioning');
    }, 300);
  };

  return (
    <section className="h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/mantle1.webp"
          alt="Real Life View"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 pt-24 h-full flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-megazoid">Real Life Easter Eggs</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-greed">
            Discover hidden 3D NFTs anchored to physical GPS coordinates throughout the city. 
            Each one is a unique digital treasure waiting to be found and claimed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden flex-grow">
          {/* Welcome to Reality card */}
          <div className="p-8 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 flex flex-col justify-center h-full relative overflow-hidden">
            {/* Background image for the card */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src="/mantle2.webp"
                alt="Mantle background"
                fill
                className="object-cover opacity-10"
                sizes="100vw"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 font-greed">Welcome to Reality</h3>
              <p className="text-gray-300 mb-4 font-greed">
                In this view, you can discover hidden digital treasures in the real world. We've anchored 3D NFTs to specific GPS locations throughout the city.
              </p>
              <p className="text-gray-300 font-greed">
                Find these Easter eggs to unlock exclusive rewards and experiences. Use your phone's camera to scan the QR codes at each location and claim unique digital collectibles that bridge the virtual and physical worlds.
              </p>
            </div>
          </div>

          {/* Easter Eggs card */}
          <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 font-greed">Easter Eggs</h3>
              <p className="text-gray-300 text-sm mb-4">
                Discover 3D NFTs hidden at real-world locations waiting to be claimed.
              </p>
            </div>
            
            {/* Scrollable locations list */}
            <div className="overflow-y-auto flex-grow px-6 pb-6 location-scrollbar">
              <div className="space-y-5">
                {locations.map((location) => (
                  <div 
                    key={location.id} 
                    className={`flex bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-lg ${location.id === 1 ? 'cursor-pointer' : ''}`}
                    onClick={location.id === 1 ? () => handleLocationClick(location.id) : undefined}
                  >
                    {/* Location image */}
                    <div className="w-1/3 relative h-[140px]">
                      <Image
                        src={location.image}
                        alt={location.name}
                        fill
                        className="object-cover"
                      />
                      {location.id === 1 && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/40 to-blue-500/40 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 animate-pulse">
                            <QrCode size={20} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Location details */}
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white mb-1 font-greed">{location.name}</h4>
                        <div className="flex items-center text-gray-400 text-xs mb-2">
                          <MapPin size={12} className="mr-1" />
                          <span>{location.address}</span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{location.description}</p>
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex gap-2">
                          {location.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/80"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Link 
                          href={location.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white flex items-center text-xs transition-colors"
                          onClick={(e) => {
                            if (location.id === 1) e.stopPropagation();
                          }}
                        >
                          <span className="mr-1">Maps</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Special Feature Modal for selected location */}
      {activeLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={closeLocationDetail}></div>
          
          <div className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl border border-white/20 max-w-lg w-full overflow-hidden animate-fadeIn">
            <button 
              onClick={closeLocationDetail}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Gift size={32} className="text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-4 font-greed text-white">
                {locations.find(loc => loc.id === activeLocation)?.specialFeature?.title}
              </h3>
              
              <p className="text-gray-200 mb-6 text-center">
                {locations.find(loc => loc.id === activeLocation)?.specialFeature?.description}
              </p>
              
              <div className="flex justify-center">
                <Link 
                  href={locations.find(loc => loc.id === activeLocation)?.googleMapsUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl font-greed flex items-center gap-2"
                >
                  <QrCode size={18} />
                  <span>{locations.find(loc => loc.id === activeLocation)?.specialFeature?.cta}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .location-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .location-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .location-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .location-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
} 