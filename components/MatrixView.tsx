"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Card data
const cards = [
  {
    id: 'card-1',
    title: 'Boys NFT #1',
    subtitle: 'Mantle Collection',
    imageSrc: '/boys-nft-collection/image.webp',
    href: 'https://lu.ma/7kti91wl?tk=WNJEca',
    color: 'text-blue-400 border-blue-400',
    position: { x: 0, y: 0 }
  },
  {
    id: 'card-2',
    title: 'Boys NFT #2',
    subtitle: 'Mantle Collection',
    imageSrc: '/boys-nft-collection/image (1).webp',
    href: 'https://lu.ma/7kti91wl?tk=WNJEca',
    color: 'text-yellow-400 border-yellow-400',
    position: { x: 0, y: 0 }
  },
  {
    id: 'card-3',
    title: 'Boys NFT #3',
    subtitle: 'Mantle Collection',
    imageSrc: '/boys-nft-collection/image (2).webp',
    href: 'https://lu.ma/7kti91wl?tk=WNJEca',
    color: 'text-green-400 border-green-400',
    position: { x: 0, y: 0 }
  }
];

// Left side cards
const leftCards = [
  {
    id: 'left-card-1',
    title: 'Event #1',
    subtitle: 'Luma Event',
    imageSrc: '/boys-nft-collection/image (3).webp',
    href: 'https://lu.ma/7kti91wl?tk=WNJEca',
    color: 'text-purple-400 border-purple-400',
    position: { x: 0, y: 0 }
  },
  {
    id: 'left-card-2',
    title: 'Event #2',
    subtitle: 'Luma Event',
    imageSrc: '/boys-nft-collection/image (4).webp',
    href: 'https://lu.ma/7kti91wl?tk=WNJEca',
    color: 'text-pink-400 border-pink-400',
    position: { x: 0, y: 0 }
  },
  {
    id: 'left-card-3',
    title: 'Event #3',
    subtitle: 'Luma Event',
    imageSrc: '/boys-nft-collection/image (5).webp',
    href: 'https://lu.ma/7kti91wl?tk=WNJEca',
    color: 'text-indigo-400 border-indigo-400',
    position: { x: 0, y: 0 }
  }
];

// Decorative cards
const decorativeCards = [
  { id: 'deco-1', imageSrc: '/boys-nft-collection/image (6).webp', position: { x: 0, y: 0 } },
  { id: 'deco-2', imageSrc: '/boys-nft-collection/image (7).webp', position: { x: 0, y: 0 } },
  { id: 'deco-3', imageSrc: '/boys-nft-collection/image (8).webp', position: { x: 0, y: 0 } },
  { id: 'deco-4', imageSrc: '/boys-nft-collection/image (9).webp', position: { x: 0, y: 0 } },
  { id: 'deco-5', imageSrc: '/boys-nft-collection/image (10).webp', position: { x: 0, y: 0 } },
  { id: 'deco-6', imageSrc: '/boys-nft-collection/image (11).webp', position: { x: 0, y: 0 } }
];

export default function MatrixView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [cardsPositioned, setCardsPositioned] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isMouseInside, setIsMouseInside] = useState(false);

  // Position cards when component mounts
  useEffect(() => {
    if (!containerRef.current || cardsPositioned) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Set container dimensions for calculations
    setContainerSize({ width: rect.width, height: rect.height });

    // Position main cards in a triangle formation
    const radius = Math.min(rect.width, rect.height) * 0.4;

    cards[0].position = {
      x: -radius * 0.9,
      y: -radius * 0.3
    };
    cards[1].position = {
      x: 0,
      y: radius * 0.8
    };
    cards[2].position = {
      x: radius * 0.9,
      y: -radius * 0.3
    };

    // Position left cards on the left side of the viewport
    const leftRadius = radius * 0.8;
    const leftOffset = -rect.width * 0.35; // Position on the left side

    leftCards[0].position = {
      x: leftOffset,
      y: -leftRadius * 0.9
    };
    leftCards[1].position = {
      x: leftOffset - leftRadius * 0.8,
      y: 0
    };
    leftCards[2].position = {
      x: leftOffset,
      y: leftRadius * 0.9
    };

    // Position decorative cards in a wider circle around the main cards
    decorativeCards.forEach((card, index) => {
      const angleStep = (2 * Math.PI) / decorativeCards.length;
      const angle = index * angleStep;
      const decorativeRadius = radius * 1.8;

      card.position = {
        x: Math.cos(angle) * decorativeRadius,
        y: Math.sin(angle) * decorativeRadius
      };
    });

    setCardsPositioned(true);

    // Center the canvas initially
    handleMouseMove({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2
    } as React.MouseEvent<HTMLDivElement>);
  }, [cardsPositioned]);

  // Update canvas positions on window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPositioned(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse movement to create the parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculate mouse position relative to the center of the container
    const mouseX = e.clientX - rect.left - (rect.width / 2);
    const mouseY = e.clientY - rect.top - (rect.height / 2);

    setMousePosition({ x: mouseX, y: mouseY });

    // Move the canvas in the opposite direction with high sensitivity
    // Normalized to container size for consistent effect across screen sizes
    const sensitivityFactor = 2.5;
    const normalizedX = (mouseX / rect.width) * sensitivityFactor * rect.width;
    const normalizedY = (mouseY / rect.height) * sensitivityFactor * rect.height;

    // Apply reversed movement (negative values) and dampen with factor
    const offsetX = -normalizedX;
    const offsetY = -normalizedY;

    setCanvasOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseEnter = () => {
    setIsMouseInside(true);
  };

  const handleMouseLeave = () => {
    setIsMouseInside(false);
    // Smoothly return to center when mouse leaves
    setCanvasOffset({ x: 0, y: 0 });
  };

  // Card hover handlers
  const handleCardHover = (id: string) => {
    setHoveredCardId(id);
  };

  const handleCardLeave = () => {
    setHoveredCardId(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-gray-900 cursor-ethereum"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Title */}
      <div className="absolute top-10 left-0 right-0 z-20 text-center pointer-events-none">
        <h1 className="text-5xl md:text-7xl mb-12 text-white font-bold font-megazoid">
          Matrix
        </h1>
      </div>

      {/* Virtual canvas that moves with mouse position */}
      <div
        className="absolute top-1/2 left-1/2 w-0 h-0"
        style={{
          transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0)`,
          transition: isMouseInside ? 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)' : 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Main Cards */}
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute w-[320px] h-[420px] rounded-lg overflow-hidden group"
            style={{
              transform: `translate3d(${card.position.x}px, ${card.position.y}px, 0) scale(${hoveredCardId === card.id ? 1.08 : 1})`,
              transformOrigin: 'center center',
              top: '-210px',
              left: '-160px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              zIndex: hoveredCardId === card.id ? 10 : 5,
              boxShadow: hoveredCardId === card.id
                ? '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)'
                : 'none'
            }}
            onMouseEnter={() => handleCardHover(card.id)}
            onMouseLeave={handleCardLeave}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={card.imageSrc}
                alt={card.title}
                fill
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 ${hoveredCardId === card.id ? 'opacity-60' : 'opacity-70'}`}></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className={`text-3xl font-bold ${card.color.split(' ')[0]}`}>{card.title}</h2>
                <p className="text-white text-sm mt-2">{card.subtitle}</p>
                <div className={`mt-4 text-xs ${card.color} rounded-full py-1 px-4 inline-block transition-all duration-300 ${hoveredCardId === card.id ? 'bg-opacity-20 bg-white' : ''}`}>
                  Join Event
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Left Side Cards */}
        {cardsPositioned && leftCards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute w-[300px] h-[400px] rounded-lg overflow-hidden group"
            style={{
              transform: `translate3d(${card.position.x}px, ${card.position.y}px, 0) scale(${hoveredCardId === card.id ? 1.08 : 1})`,
              transformOrigin: 'center center',
              top: '-200px',
              left: '-150px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              zIndex: hoveredCardId === card.id ? 10 : 5,
              boxShadow: hoveredCardId === card.id
                ? '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)'
                : 'none'
            }}
            onMouseEnter={() => handleCardHover(card.id)}
            onMouseLeave={handleCardLeave}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={card.imageSrc}
                alt={card.title}
                fill
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 ${hoveredCardId === card.id ? 'opacity-60' : 'opacity-70'}`}></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className={`text-3xl font-bold ${card.color.split(' ')[0]}`}>{card.title}</h2>
                <p className="text-white text-sm mt-2">{card.subtitle}</p>
                <div className={`mt-4 text-xs ${card.color} rounded-full py-1 px-4 inline-block transition-all duration-300 ${hoveredCardId === card.id ? 'bg-opacity-20 bg-white' : ''}`}>
                  Join Event
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Decorative Cards */}
        {cardsPositioned && decorativeCards.map((card) => (
          <div
            key={card.id}
            className="absolute w-[200px] h-[200px] rounded-lg overflow-hidden"
            style={{
              transform: `translate3d(${card.position.x}px, ${card.position.y}px, 0)`,
              top: '-100px',
              left: '-100px',
              transition: 'transform 0.2s ease',
              opacity: hoveredCardId ? 0.5 : 0.7,
              zIndex: 1
            }}
          >
            <Image
              src={card.imageSrc}
              alt="Decorative Card"
              fill
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          </div>
        ))}
      </div>

      {/* Instructions overlay - only visible initially */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60 pointer-events-none"
        style={{
          opacity: isMouseInside ? 0 : 0.7,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <p className="text-white text-lg">Move your mouse to explore the cards</p>
      </div>
    </div>
  );
} 