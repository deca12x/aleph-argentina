"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin, X, Gift, QrCode } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { 
  clanLocations, 
  clanWelcomeMessages, 
  EasterEggLocation,
  ClanWelcomeMessage
} from '@/lib/easter-eggs';
import { clans } from '@/lib/poapData';
import { Clan } from '@/lib/types';

export default function RealLifeView() {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const pathname = usePathname();
  const [currentClan, setCurrentClan] = useState<Clan | null>(clans.find(c => c.id === "clan4") || null);
  const [locations, setLocations] = useState<EasterEggLocation[]>(clanLocations.clan4);
  const [welcomeMessage, setWelcomeMessage] = useState<ClanWelcomeMessage>(clanWelcomeMessages.clan4);
  const [backgroundImage, setBackgroundImage] = useState<string>("/mantle1.webp");
  const [cardBackgroundImage, setCardBackgroundImage] = useState<string>("/mantle2.webp");

  // Detect current clan from URL
  useEffect(() => {
    if (pathname) {
      // Extract clanId from pathname like "/clans/clan4"
      const match = pathname.match(/\/clans\/(clan\d)/);
      if (match && match[1]) {
        const clanId = match[1];
        const foundClan = clans.find(c => c.id === clanId);
        
        if (foundClan) {
          setCurrentClan(foundClan);
          setLocations(clanLocations[clanId as keyof typeof clanLocations] || clanLocations.clan4);
          setWelcomeMessage(clanWelcomeMessages[clanId as keyof typeof clanWelcomeMessages] || clanWelcomeMessages.clan4);
          
          // Use clan's visual properties for background images
          setBackgroundImage(foundClan.visualProperties?.backgroundImage || "/mantle1.webp");
          setCardBackgroundImage(foundClan.visualProperties?.cardBackgroundImage || "/mantle2.webp");
        }
      }
    }
  }, [pathname]);

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

  // Generate gradient styles based on clan colors
  const getGradientStyle = () => {
    const primaryColor = currentClan?.visualProperties?.primaryColor || "#FF5722";
    const secondaryColor = currentClan?.visualProperties?.secondaryColor || "#FF9800";
    
    return {
      from: `from-${primaryColor}/90`,
      to: `to-${secondaryColor}/90`,
      button: `from-${primaryColor} to-${secondaryColor}`
    };
  };

  return (
    <section className="min-h-screen bg-black text-white relative overflow-y-auto pb-16">
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src={backgroundImage}
          alt="Real Life View Background"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-megazoid">Real Life Easter Eggs</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-greed">
            Discover hidden 3D NFTs anchored to physical GPS coordinates throughout the city. <br></br>
            Each one is a unique digital treasure waiting to be found and claimed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Welcome to Reality card */}
          <div className="p-8 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 flex flex-col justify-center h-full relative overflow-hidden">
            {/* Background image for the card */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src={cardBackgroundImage}
                alt="Card Background"
                fill
                className="object-cover opacity-10"
                sizes="100vw"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 font-greed">{welcomeMessage.title}</h3>
              <p className="text-gray-300 mb-4 font-greed">
                {welcomeMessage.message1}
              </p>
              <p className="text-gray-300 font-greed">
                {welcomeMessage.message2}
              </p>
            </div>
          </div>

          {/* Easter Eggs card */}
          <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 flex flex-col overflow-hidden h-[650px]">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 font-greed">Easter Eggs</h3>
              <p className="text-gray-300 text-sm mb-4">
                Discover 3D NFTs hidden at real-world locations waiting to be claimed.
              </p>
            </div>
            
            {/* Scrollable locations list */}
            <div className="overflow-y-auto flex-grow px-6 pb-6 location-scrollbar max-h-[550px]">
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
                        <div className={`absolute inset-0 bg-gradient-to-tr from-${currentClan?.visualProperties?.primaryColor || 'purple'}-500/40 to-${currentClan?.visualProperties?.secondaryColor || 'blue'}-500/40 flex items-center justify-center`}>
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
          
          <div className={`relative bg-gradient-to-br from-${currentClan?.visualProperties?.primaryColor || 'purple'}-900/90 to-${currentClan?.visualProperties?.secondaryColor || 'blue'}-900/90 backdrop-blur-xl rounded-2xl border border-white/20 max-w-lg w-full overflow-hidden animate-fadeIn`}>
            <button 
              onClick={closeLocationDetail}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${currentClan?.visualProperties?.primaryColor || 'purple'}-500 to-${currentClan?.visualProperties?.secondaryColor || 'blue'}-500 flex items-center justify-center`}>
                  <Gift size={32} className="text-white animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-4 font-greed text-white">
                Hidden 3D Easter Egg Found!
              </h3>
              
              <p className="text-gray-200 mb-6 text-center">
                {locations.find(loc => loc.id === activeLocation)?.specialFeature?.description}
              </p>
              
              <div className="flex justify-center">
                <Link 
                  href={locations.find(loc => loc.id === activeLocation)?.googleMapsUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 bg-gradient-to-r from-${currentClan?.visualProperties?.primaryColor || 'purple'}-500 to-${currentClan?.visualProperties?.secondaryColor || 'blue'}-500 rounded-full text-white font-bold hover:from-${currentClan?.visualProperties?.primaryColor || 'purple'}-600 hover:to-${currentClan?.visualProperties?.secondaryColor || 'blue'}-600 transition-all duration-300 shadow-lg hover:shadow-xl font-greed flex items-center gap-2`}
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