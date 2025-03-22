"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin } from 'lucide-react';

// Location data
const locations = [
  {
    id: 1,
    name: "Aleph Hub",
    address: "Concepción Arenal 2989, C1426DGG, Cdad. Autónoma de Buenos Aires",
    description: "Main gathering point for Web3 enthusiasts in Buenos Aires. Features coworking spaces, event areas, and networking lounges.",
    image: "/locations/aleph-hub-location.webp",
    qrCodeImage: "/locations/aleph-hub-8code.png",
    googleMapsUrl: "https://www.google.com/maps/place/Aleph+Hub/data=!4m2!3m1!1s0x0:0x3a22d7994f3ff7ec?sa=X&ved=1t:2428&ictx=111",
    tags: ["Coworking", "Events", "Cafe"]
  },
  {
    id: 2,
    name: "Mantle Blockchain Hub",
    address: "San Martín 344, Buenos Aires, Argentina",
    description: "Technology center focused on Mantle blockchain development, with workshops, hackathons, and technical talks.",
    image: "/boys-nft-collection/image (1).webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.6037,-58.3816",
    tags: ["Development", "Education", "Networking"]
  },
  {
    id: 3,
    name: "Crypto Art Gallery",
    address: "Defensa 791, San Telmo, Buenos Aires, Argentina",
    description: "An exclusive gallery showcasing NFT art with physical representations and immersive digital experiences.",
    image: "/boys-nft-collection/image (2).webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.6173,-58.3722",
    tags: ["Art", "NFTs", "Culture"]
  },
  {
    id: 4,
    name: "Web3 Palermo Social Club",
    address: "Guatemala 4699, Buenos Aires, Argentina",
    description: "A social space for crypto enthusiasts to connect, collaborate, and share ideas in a relaxed environment.",
    image: "/boys-nft-collection/image (3).webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.5862,-58.4241",
    tags: ["Social", "Networking", "Bar"]
  },
  {
    id: 5,
    name: "DeFi Conference Center",
    address: "Av. Corrientes 1234, Buenos Aires, Argentina",
    description: "Dedicated venue for decentralized finance discussions, hosting regular meetups and international conferences.",
    image: "/boys-nft-collection/image.webp",
    googleMapsUrl: "https://maps.google.com/?q=-34.6037,-58.3917",
    tags: ["Conference", "Finance", "Education"]
  }
];

export default function RealLifeView() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleCardFlip = (locationId: number) => {
    setFlippedCard(flippedCard === locationId ? null : locationId);
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
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-megazoid">Real Life</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-greed">
            This is reality - everything you see here is actually happening.
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
                In this view, you're seeing things as they truly are. No illusions, no digital constructs - just pure reality.
              </p>
              <p className="text-gray-300 font-greed">
                Connect with other real beings and experience the authentic world around you. The choices you make here have real consequences.
              </p>
            </div>
          </div>

          {/* Locations card */}
          <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 flex flex-col overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 font-greed">Locations</h3>
              <p className="text-gray-300 text-sm mb-4">
                Discover real-world locations where the community gathers.
              </p>
            </div>
            
            {/* Scrollable locations list */}
            <div className="overflow-y-auto flex-grow px-6 pb-6 location-scrollbar">
              <div className="space-y-5">
                {locations.map((location) => (
                  <div 
                    key={location.id} 
                    className={`flex bg-black/30 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-lg ${location.id === 1 ? 'cursor-pointer' : ''}`}
                    onClick={location.id === 1 ? () => handleCardFlip(location.id) : undefined}
                  >
                    {/* Location image or QR code for Aleph Hub */}
                    <div className={`w-1/3 relative h-[140px] ${location.id === 1 ? 'flip-card-container' : ''}`}>
                      <div className={`flip-card ${flippedCard === location.id ? 'flipped' : ''} h-full w-full relative`}>
                        <div className="flip-card-front absolute inset-0">
                          <Image
                            src={location.image}
                            alt={location.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {location.id === 1 && (
                          <div className="flip-card-back absolute inset-0 bg-white flex items-center justify-center">
                            {location.qrCodeImage && (
                              <Image
                                src={location.qrCodeImage}
                                alt={`${location.name} QR Code`}
                                fill
                                className="object-contain p-2"
                              />
                            )}
                          </div>
                        )}
                      </div>
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
      
      {/* Custom scrollbar and card flip styles */}
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

        .flip-card {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        
        .flip-card-front,
        .flip-card-back {
          backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
} 