"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NftCard from './NftCard';
import '../styles/cursor.css'; // Import the cursor styles
import '../styles/matrixCards.css';

// Card data
const cards = [
  {
    id: 'card-1',
    title: 'Mantle Alien Race #1',
    subtitle: 'Mantle NFT Collection',
    imageSrc: '/mantle-alien-races-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlOYjlKMUtRM3M3eUtNUkRxQTRXUjlCVFpNTWFTcHI1VkZSYjR3UU1OUmd3Lzg4LndlYnA=.webp',
    href: 'https://mintle.app/section/art_projects',
    color: 'text-white border-white',
    position: { x: 0, y: 0 }
  },
  {
    id: 'card-2',
    title: 'Mantle Crystal #1',
    subtitle: 'Mantle NFT Collection',
    imageSrc: '/mantle-crystals-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlBZ3RNRGtMeXh6RWc3bld2a0dIYzVIVkpMSG83TUg4OXVpZDdFSDhrb1drLzc2LmpwZw==.webp',
    href: 'https://mintle.app/section/art_projects',
    color: 'text-white border-white',
    position: { x: 0, y: 0 }
  },
  {
    id: 'card-3',
    title: 'Mantle Jelly Army #1',
    subtitle: 'Mantle NFT Collection',
    imageSrc: '/mantle-jelly-army-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlYVUVRb1czMW9mZUNqdkQxSE1GS3hzbmNRS0pSWnZyNGM5ZWM2b25NWjl1LzM3LndlYnA=.webp',
    href: 'https://mintle.app/section/art_projects',
    color: 'text-white border-white',
    position: { x: 0, y: 0 }
  }
];

// Left side cards
const leftCards = [
  {
    id: 'left-card-1',
    title: 'Mantle Alien Race #2',
    subtitle: 'Mantle Collection',
    imageSrc: '/mantle-alien-races-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlOYjlKMUtRM3M3eUtNUkRxQTRXUjlCVFpNTWFTcHI1VkZSYjR3UU1OUmd3LzkxLndlYnA=.webp',
    href: 'https://mintle.app/section/art_projects',
    color: 'text-white border-white',
    position: { x: 0, y: 0 }
  },
  {
    id: 'left-card-2',
    title: 'Mantle Jelly Army #2',
    subtitle: 'Mantle Collection',
    imageSrc: '/mantle-jelly-army-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlYVUVRb1czMW9mZUNqdkQxSE1GS3hzbmNRS0pSWnZyNGM5ZWM2b25NWjl1LzIwLndlYnA=.webp',
    href: 'https://mintle.app/section/art_projects',
    color: 'text-white border-white',
    position: { x: 0, y: 0 }
  },
  {
    id: 'left-card-3',
    title: 'Mantle Crystal #2',
    subtitle: 'Mantle Collection',
    imageSrc: '/mantle-crystals-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlBZ3RNRGtMeXh6RWc3bld2a0dIYzVIVkpMSG83TUg4OXVpZDdFSDhrb1drLzc2LmpwZw==.webp',
    href: 'https://mintle.app/section/art_projects',
    color: 'text-white border-white',
    position: { x: 0, y: 0 }
  }
];

// Decorative cards - adding titles for all cards
const decorativeCards = [
  { 
    id: 'deco-1', 
    title: 'Mantle Crystal #87',
    imageSrc: '/mantle-crystals-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVJlSkpiMW1CcWZWZU5LQUROZkJyQkZ3aXRGMzRSdUxFanVxM0hEdThoOEhiLzg3LmpwZw==.webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-2', 
    title: 'Mantle Alien Race #9',
    imageSrc: '/mantle-alien-races-nft-collection/9.webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-3', 
    title: 'Mantle Jelly Army #5',
    imageSrc: '/mantle-jelly-army-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlYVUVRb1czMW9mZUNqdkQxSE1GS3hzbmNRS0pSWnZyNGM5ZWM2b25NWjl1LzUud2VicA==.webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-4', 
    title: 'Mantle Crystal #79',
    imageSrc: '/mantle-crystals-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVpwUXJBOHM3ZU1GajFXMkt4WkhtMlE2RTdkaTFMWEhvVlVMdmFLNzhEaUxXLzc5LmpwZw==.webp', 
    href: 'https://mintle.app/section/art_projects', 
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-5', 
    title: 'Mantle Alien Race #88',
    imageSrc: '/mantle-alien-races-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlOYjlKMUtRM3M3eUtNUkRxQTRXUjlCVFpNTWFTcHI1VkZSYjR3UU1OUmd3Lzg4LndlYnA=.webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-6', 
    title: 'Mantle Jelly Army #20',
    imageSrc: '/mantle-jelly-army-nft-collection/aHR0cHM6Ly9pcGZzLnJhcmlibGV1c2VyZGF0YS5jb20vaXBmcy9RbVlYVUVRb1czMW9mZUNqdkQxSE1GS3hzbmNRS0pSWnZyNGM5ZWM2b25NWjl1LzIwLndlYnA=.webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  // New cards from available collections with titles
  { 
    id: 'deco-7', 
    title: 'Mantle Boy #1',
    imageSrc: '/mantle-boys-nft-collection/image.webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-8', 
    title: 'Mantle Boy #2',
    imageSrc: '/mantle-boys-nft-collection/image (1).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-9', 
    title: 'Mantle Boy #3',
    imageSrc: '/mantle-boys-nft-collection/image (2).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-10', 
    title: 'Mantle Boy #4',
    imageSrc: '/mantle-boys-nft-collection/image (3).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-11', 
    title: 'Mantle Boy #5',
    imageSrc: '/mantle-boys-nft-collection/image (4).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-12', 
    title: 'Mantle Boy #6',
    imageSrc: '/mantle-boys-nft-collection/image (5).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  // Adding more cards from Mantle Boys collection with titles
  { 
    id: 'deco-13', 
    title: 'Mantle Boy #7',
    imageSrc: '/mantle-boys-nft-collection/image (6).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-14', 
    title: 'Mantle Boy #8',
    imageSrc: '/mantle-boys-nft-collection/image (7).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-15', 
    title: 'Mantle Boy #9',
    imageSrc: '/mantle-boys-nft-collection/image (8).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-16', 
    title: 'Mantle Boy #10',
    imageSrc: '/mantle-boys-nft-collection/image (9).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-17', 
    title: 'Mantle Boy #11',
    imageSrc: '/mantle-boys-nft-collection/image (10).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  },
  { 
    id: 'deco-18', 
    title: 'Mantle Boy #12',
    imageSrc: '/mantle-boys-nft-collection/image (11).webp', 
    href: 'https://mintle.app/section/art_projects',
    position: { x: 0, y: 0 } 
  }
];

export default function MatrixView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [cardsPositioned, setCardsPositioned] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<{[key: string]: boolean}>({});

  // Position cards when component mounts
  useEffect(() => {
    if (!containerRef.current || cardsPositioned) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    setContainerSize({ width, height });

    // Increase space factors to further spread cards apart
    const mainCardsSpaceFactor = 0.55; // Increased from 0.45
    const leftCardsSpaceFactor = 0.65; // Increased from 0.55
    const decorativeCardsBaseFactor = 0.85; // Increased from 0.75

    // Define a circular pattern for main cards with more distance from center
    const centerX = 0;
    const centerY = 0;
    const radius = Math.min(width, height) * mainCardsSpaceFactor;
    const angleStep = (2 * Math.PI) / cards.length;

    // Position main cards in a circular pattern around the center
    const positionedCards = cards.map((card, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { ...card, position: { x, y } };
    });

    // Position left side cards at specific angles (left side of the circle)
    const leftRadius = Math.min(width, height) * leftCardsSpaceFactor;  
    const leftCardsPositioned = leftCards.map((card, index) => {
      // Further spread the left cards
      const angleRangeStart = 110 * (Math.PI / 180); // Adjusted from 120
      const angleRangeEnd = 250 * (Math.PI / 180); // Adjusted from 240
      const angleRange = angleRangeEnd - angleRangeStart;
      const angle = angleRangeStart + (angleRange / (leftCards.length - 1)) * index;
      
      const x = centerX + leftRadius * Math.cos(angle);
      const y = centerY + leftRadius * Math.sin(angle);
      return { ...card, position: { x, y } };
    });

    // Define types for card positions tracking
    interface CardPosition {
      x: number;
      y: number;
    }

    interface PositionedCard {
      id: string;
      imageSrc: string;
      href: string;
      position: CardPosition;
      [key: string]: any; // Allow for other properties
    }

    // Generate positions for decorative cards that prevent complete overlapping
    const decoCardsPositioned: PositionedCard[] = [];
    const occupiedSpaces: CardPosition[] = [];
    const minDistanceBetweenCards = 150; // Minimum pixel distance between card centers
    
    // First pass: position cards with the Fibonacci spiral
    for (let i = 0; i < decorativeCards.length; i++) {
      const card = { ...decorativeCards[i] };
      let attempts = 0;
      let validPosition = false;
      
      while (!validPosition && attempts < 20) {
        // Use Fibonacci spiral with increased spread
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const angle = i * goldenAngle;
        
        // Vary the layer and add randomization
        const layerIndex = i % 8; // More layers (was 6)
        const baseRadius = Math.min(width, height) * decorativeCardsBaseFactor;
        const variance = 0.3 * (Math.random() - 0.5); // More variance (was 0.25)
        const layerMultiplier = 0.6 + (layerIndex * 0.35); 
        const cardRadius = baseRadius * layerMultiplier * (1 + variance);
        
        // Calculate position
        const x = centerX + cardRadius * Math.cos(angle);
        const y = centerY + cardRadius * Math.sin(angle);
        
        // Check for overlap with existing cards
        validPosition = true;
        for (const existingPos of occupiedSpaces) {
          const dx = x - existingPos.x;
          const dy = y - existingPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < minDistanceBetweenCards) {
            validPosition = false;
            break;
          }
        }
        
        if (validPosition) {
          card.position = { x, y };
          decoCardsPositioned.push(card);
          occupiedSpaces.push({ x, y });
          break;
        }
        
        attempts++;
      }
      
      // If we couldn't find a valid position after max attempts,
      // just place the card with an increased distance
      if (!validPosition) {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const angle = i * goldenAngle;
        const layerIndex = (i % 4) + 4; // Use outer layers
        const baseRadius = Math.min(width, height) * decorativeCardsBaseFactor;
        const cardRadius = baseRadius * (1 + layerIndex * 0.2);
        
        const x = centerX + cardRadius * Math.cos(angle);
        const y = centerY + cardRadius * Math.sin(angle);
        
        card.position = { x, y };
        decoCardsPositioned.push(card);
        occupiedSpaces.push({ x, y });
      }
    }

    // Update all card positions
    cards.length > 0 && (cards.forEach((card, i) => {
      card.position = positionedCards[i].position;
    }));

    leftCards.length > 0 && (leftCards.forEach((card, i) => {
      card.position = leftCardsPositioned[i].position;
    }));

    decorativeCards.length > 0 && (decorativeCards.forEach((card, i) => {
      if (decoCardsPositioned[i]) {
        card.position = decoCardsPositioned[i].position;
      }
    }));

    setCardsPositioned(true);

    // Center the canvas initially
    handleMouseMove({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2
    } as React.MouseEvent<HTMLDivElement>);
  }, [cardsPositioned]);

  // Animate cards entrance with a staggered effect
  useEffect(() => {
    if (!cardsPositioned) return;

    // Create a staggered entrance for all cards
    const allCards = [...cards, ...leftCards, ...decorativeCards];
    
    allCards.forEach((card, index) => {
      // Stagger the appearance of cards
      setTimeout(() => {
        setCardsVisible(prev => ({
          ...prev,
          [card.id]: true
        }));
      }, 100 + index * 80); // 80ms delay between each card
    });
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
      className="matrix-container cursor-ethereum"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image with overlay */}
      <div className="matrix-background">
        <Image
          src="/mantle1.webp"
          alt="Matrix View Background"
          fill
          className="matrix-background-image"
          sizes="100vw"
        />
        <div className="matrix-gradient-overlay"></div>
      </div>
      
      {/* Title */}
      <div className="matrix-title">
        <h1 className="font-megazoid">
          Matrix
        </h1>
      </div>

      {/* Virtual canvas that moves with mouse position */}
      <div
        className="matrix-canvas"
        style={{
          transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0) scale(${isMouseInside ? 1.05 : 1})`,
          transition: isMouseInside ? 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)' : 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'center center'
        }}
      >
        {/* Main Cards */}
        {cards.map((card) => (
          <NftCard
            key={card.id}
            id={card.id}
            title={card.title}
            subtitle={card.subtitle}
            imageSrc={card.imageSrc}
            href={card.href}
            color={card.color}
            position={card.position}
            isHovered={hoveredCardId === card.id}
            isVisible={!!cardsVisible[card.id]}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
            variant="main"
          />
        ))}

        {/* Left Side Cards */}
        {cardsPositioned && leftCards.map((card) => (
          <NftCard
            key={card.id}
            id={card.id}
            title={card.title}
            subtitle={card.subtitle}
            imageSrc={card.imageSrc}
            href={card.href}
            color={card.color}
            position={card.position}
            isHovered={hoveredCardId === card.id}
            isVisible={!!cardsVisible[card.id]}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
            variant="left"
          />
        ))}

        {/* Decorative Cards */}
        {cardsPositioned && decorativeCards.map((card) => {
          // Calculate custom sizes for decorative cards - vary sizes more
          const isSpecialCard = card.id.includes('deco-1') || 
                                card.id.includes('deco-5') ||
                                card.id.includes('deco-7') || 
                                card.id.includes('deco-3');
                                
          // Create more variation in card sizes
          const cardIndex = parseInt(card.id.split('-')[1]);
          const sizeVariation = (cardIndex % 3 === 0) ? '190px' :
                                (cardIndex % 3 === 1) ? '160px' : 
                                '140px';
          
          const heightVariation = (cardIndex % 3 === 0) ? '190px' :
                                  (cardIndex % 3 === 1) ? '160px' : 
                                  '140px';
                               
          const offsetVariation = (cardIndex % 3 === 0) ? '-95px' :
                                  (cardIndex % 3 === 1) ? '-80px' : 
                                  '-70px';
          
          const customSize = {
            width: isSpecialCard ? '220px' : sizeVariation,
            height: isSpecialCard ? '220px' : heightVariation,
            top: isSpecialCard ? '-110px' : offsetVariation,
            left: isSpecialCard ? '-110px' : offsetVariation,
          };
          
          return (
            <NftCard
              key={card.id}
              id={card.id}
              imageSrc={card.imageSrc}
              href={card.href}
              position={card.position}
              isHovered={hoveredCardId === card.id}
              isVisible={!!cardsVisible[card.id]}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
              variant="decorative"
              customSize={customSize}
            />
          );
        })}
      </div>

      {/* Instructions overlay - only visible initially */}
      <div
        className="matrix-instructions"
        style={{
          opacity: isMouseInside ? 0 : 0.7
        }}
      >
        <p>Move your mouse to explore the cards</p>
      </div>
    </div>
  );
} 