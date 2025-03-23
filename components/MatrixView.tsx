"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NftCard from './NftCard';
import { clans } from '@/lib/poapData';
import '../styles/cursor.css'; // Import the cursor styles
import '../styles/matrixCards.css';

// Define functions to get card data based on clan
const getCardData = (clanId: string) => {
  // Default to mantle if no clan ID or invalid clan ID
  if (!clanId || !['aleph', 'urbe', 'zksync', 'mantle', 'crecimiento'].includes(clanId)) {
    clanId = 'mantle';
  }
  
  if (clanId === 'aleph') {
    return {
      mainCards: [
        {
          id: 'card-1',
          title: 'Aleph Image 1',
          subtitle: 'Aleph Collection',
          imageSrc: '/aleph/a2d2c4c5-4f0c-4269-bf1b-d134fcddaee3.webp',
          href: 'https://aleph.im',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'card-2',
          title: 'Aleph Image 2',
          subtitle: 'Aleph Collection',
          imageSrc: '/aleph/9d016266-9d4d-4dbd-996f-26d60b0d5712.webp',
          href: 'https://aleph.im',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'card-3',
          title: 'Aleph Image 3',
          subtitle: 'Aleph Collection',
          imageSrc: '/aleph/377adb8b-ef95-4620-b657-0abab5cae618.webp',
          href: 'https://aleph.im',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        }
      ],
      leftCards: [
        {
          id: 'left-card-1',
          title: 'Aleph Image 4',
          subtitle: 'Aleph Collection',
          imageSrc: '/aleph/0f17355c-c5ce-49f0-86b6-bc2109e1ee5d.webp',
          href: 'https://aleph.im',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'left-card-2',
          title: 'Aleph Image 1',
          subtitle: 'Aleph Collection',
          imageSrc: '/aleph/a2d2c4c5-4f0c-4269-bf1b-d134fcddaee3.webp',
          href: 'https://aleph.im',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'left-card-3',
          title: 'Aleph Image 2',
          subtitle: 'Aleph Collection',
          imageSrc: '/aleph/9d016266-9d4d-4dbd-996f-26d60b0d5712.webp',
          href: 'https://aleph.im',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        }
      ],
      decorativeCards: Array(12).fill(null).map((_, index) => {
        const images = [
          '/aleph/a2d2c4c5-4f0c-4269-bf1b-d134fcddaee3.webp',
          '/aleph/9d016266-9d4d-4dbd-996f-26d60b0d5712.webp',
          '/aleph/377adb8b-ef95-4620-b657-0abab5cae618.webp',
          '/aleph/0f17355c-c5ce-49f0-86b6-bc2109e1ee5d.webp'
        ];
        return {
          id: `deco-${index+1}`,
          title: `Aleph Decorative ${index+1}`,
          imageSrc: images[index % images.length],
          href: 'https://aleph.im',
          position: { x: 0, y: 0 }
        };
      })
    };
  } else if (clanId === 'urbe') {
    return {
      mainCards: [
        {
          id: 'card-1',
          title: 'Urbe Image 1',
          subtitle: 'Urbe Collection',
          imageSrc: '/urbe/ethrome.webp',
          href: 'https://urbe.eth.limo',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'card-2',
          title: 'Urbe Image 2',
          subtitle: 'Urbe Collection',
          imageSrc: '/urbe/beefy.webp',
          href: 'https://urbe.eth.limo',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'card-3',
          title: 'Urbe Image 3',
          subtitle: 'Urbe Collection',
          imageSrc: '/urbe/village.webp',
          href: 'https://urbe.eth.limo',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        }
      ],
      leftCards: [
        {
          id: 'left-card-1',
          title: 'Urbe Image 4',
          subtitle: 'Urbe Collection',
          imageSrc: '/urbe/walrus.webp',
          href: 'https://urbe.eth.limo',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'left-card-2',
          title: 'Urbe Image 5',
          subtitle: 'Urbe Collection',
          imageSrc: '/urbe/7cd4bf0c-5e30-4fb8-8789-4d7c13d35829.webp',
          href: 'https://urbe.eth.limo',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'left-card-3',
          title: 'Urbe Image 6',
          subtitle: 'Urbe Collection',
          imageSrc: '/urbe/b53177b1-7f33-419a-a39a-53ff87865b91.webp',
          href: 'https://urbe.eth.limo',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        }
      ],
      decorativeCards: Array(12).fill(null).map((_, index) => {
        const images = [
          '/urbe/ethrome.webp',
          '/urbe/beefy.webp',
          '/urbe/village.webp',
          '/urbe/walrus.webp',
          '/urbe/7cd4bf0c-5e30-4fb8-8789-4d7c13d35829.webp',
          '/urbe/b53177b1-7f33-419a-a39a-53ff87865b91.webp',
          '/urbe/97f4465f-a784-4a3d-a73d-52e044c40210.webp',
          '/urbe/GmRdbVFXgAAXZzx.webp',
          '/urbe/UVmemePowerRangers.webp'
        ];
        return {
          id: `deco-${index+1}`,
          title: `Urbe Decorative ${index+1}`,
          imageSrc: images[index % images.length],
          href: 'https://urbe.eth.limo',
          position: { x: 0, y: 0 }
        };
      })
    };
  } else if (clanId === 'zksync') {
    return {
      mainCards: [
        {
          id: 'card-1',
          title: 'zkSync Image 1',
          subtitle: 'zkSync Collection',
          imageSrc: '/zksync/ec64396d-34d1-44ac-8de5-8dffff05013a.webp',
          href: 'https://zksync.io',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'card-2',
          title: 'zkSync Image 2',
          subtitle: 'zkSync Collection',
          imageSrc: '/zksync/b5462957-8306-46d3-acc8-320bdf21cfc6.webp',
          href: 'https://zksync.io',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'card-3',
          title: 'zkSync Image 3',
          subtitle: 'zkSync Collection',
          imageSrc: '/zksync/3b579d3b-3027-4f61-82b9-016bb1890385.webp',
          href: 'https://zksync.io',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        }
      ],
      leftCards: [
        {
          id: 'left-card-1',
          title: 'zkSync Image 4',
          subtitle: 'zkSync Collection',
          imageSrc: '/zksync/ec64396d-34d1-44ac-8de5-8dffff05013a.webp',
          href: 'https://zksync.io',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'left-card-2',
          title: 'zkSync Image 5',
          subtitle: 'zkSync Collection',
          imageSrc: '/zksync/b5462957-8306-46d3-acc8-320bdf21cfc6.webp',
          href: 'https://zksync.io',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        },
        {
          id: 'left-card-3',
          title: 'zkSync Image 6',
          subtitle: 'zkSync Collection',
          imageSrc: '/zksync/3b579d3b-3027-4f61-82b9-016bb1890385.webp',
          href: 'https://zksync.io',
          color: 'text-white border-white',
          position: { x: 0, y: 0 }
        }
      ],
      decorativeCards: Array(12).fill(null).map((_, index) => {
        const images = [
          '/zksync/ec64396d-34d1-44ac-8de5-8dffff05013a.webp',
          '/zksync/b5462957-8306-46d3-acc8-320bdf21cfc6.webp',
          '/zksync/3b579d3b-3027-4f61-82b9-016bb1890385.webp'
        ];
        return {
          id: `deco-${index+1}`,
          title: `zkSync Decorative ${index+1}`,
          imageSrc: images[index % images.length],
          href: 'https://zksync.io',
          position: { x: 0, y: 0 }
        };
      })
    };
  } else {
    // Default (mantle) cards
    return {
      mainCards: cards,
      leftCards: leftCards,
      decorativeCards: decorativeCards
    };
  }
};

// Original card data (mantle)
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
  
  const pathname = usePathname();
  
  // Extract clan ID from the URL path - expected format: /clans/[clanId]/*
  const clanIdMatch = pathname.match(/\/clans\/([^/]+)/);
  const clanId = clanIdMatch ? clanIdMatch[1] : 'mantle';
  
  // Get clan data and card data based on clan ID
  const clan = clans.find(c => c.id === clanId) || clans.find(c => c.id === 'mantle')!;
  const { mainCards, leftCards: sideCards, decorativeCards: decoCards } = getCardData(clanId);

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
    const angleStep = (2 * Math.PI) / mainCards.length;

    // Position main cards in a circular pattern around the center
    const positionedCards = mainCards.map((card, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { ...card, position: { x, y } };
    });

    // Position left side cards at specific angles (left side of the circle)
    const leftRadius = Math.min(width, height) * leftCardsSpaceFactor;  
    const leftCardsPositioned = sideCards.map((card, index) => {
      // Further spread the left cards
      const angleRangeStart = 110 * (Math.PI / 180); // Adjusted from 120
      const angleRangeEnd = 250 * (Math.PI / 180); // Adjusted from 240
      const angleRange = angleRangeEnd - angleRangeStart;
      const angle = angleRangeStart + (angleRange / (sideCards.length - 1)) * index;
      
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
    for (let i = 0; i < decoCards.length; i++) {
      const card = { ...decoCards[i] };
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
    mainCards.length > 0 && (mainCards.forEach((card, i) => {
      card.position = positionedCards[i].position;
    }));

    sideCards.length > 0 && (sideCards.forEach((card, i) => {
      card.position = leftCardsPositioned[i].position;
    }));

    decoCards.length > 0 && (decoCards.forEach((card, i) => {
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
  }, [cardsPositioned, mainCards, sideCards, decoCards]);

  // Animate cards entrance with a staggered effect
  useEffect(() => {
    if (!cardsPositioned) return;

    // Create a staggered entrance for all cards
    const allCards = [...mainCards, ...sideCards, ...decoCards];
    
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
      {/* Background image with overlay - use clan-specific background */}
      <div className="matrix-background">
        <Image
          src={clan.visualProperties?.backgroundImage || "/devconnect-background.webp"}
          alt={`${clan.name} Background`}
          fill
          className="matrix-background-image"
          sizes="100vw"
        />
        <div className="matrix-gradient-overlay"></div>
      </div>
      
      {/* Title */}
      <div className="matrix-title">
        <h1 className="font-megazoid">
          {clan.name} Matrix
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
        {mainCards.map((card) => (
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
        {cardsPositioned && sideCards.map((card) => (
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
        {cardsPositioned && decoCards.map((card) => {
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