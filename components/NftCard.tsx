"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardPosition {
  x: number;
  y: number;
}

interface NFTCardProps {
  id: string;
  title?: string;
  subtitle?: string;
  imageSrc: string;
  href: string;
  color?: string;
  position: CardPosition;
  isHovered: boolean;
  isVisible: boolean;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  variant: 'main' | 'left' | 'decorative';
  customSize?: {
    width: string;
    height: string;
    top: string;
    left: string;
  };
}

const NFTCard: React.FC<NFTCardProps> = ({
  id,
  title,
  subtitle,
  imageSrc,
  href,
  color,
  position,
  isHovered,
  isVisible,
  onMouseEnter,
  onMouseLeave,
  variant,
  customSize
}) => {
  // Use Mintle art projects section as the link destination
  const cardLink = "https://mintle.app/section/art_projects";

  // Generate a title for decorative cards based on ID if not provided
  const cardTitle = title || `Mantle NFT #${id.split('-')[1]}`;

  // Determine CSS classes based on variant
  const cardClass = `matrix-card matrix-${variant}-card group`;

  // Base style for all cards
  const baseStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 1.08 : 1})`,
    boxShadow: isHovered
      ? '0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.1)'
      : 'none',
    opacity: isVisible ? (variant === 'decorative' ? (isHovered ? 1 : 0.7) : 1) : 0,
    zIndex: isHovered ? 10 : (variant === 'main' ? 5 : variant === 'left' ? 4 : 1),
  };

  // Apply custom sizes for decorative cards if provided
  const styleWithSizes = customSize ? {
    ...baseStyle,
    width: customSize.width,
    height: customSize.height,
    top: customSize.top,
    left: customSize.left
  } : baseStyle;

  return (
    <Link
      href={cardLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
      style={styleWithSizes}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
    >
      {/* Card content - same structure for all cards with adjustments for decorative */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <Image
          src={imageSrc}
          alt={cardTitle}
          fill
          className="matrix-card-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="matrix-card-overlay"></div>
        <div className={`matrix-card-content ${variant === 'decorative' ? 'p-3' : ''}`}>
          <h2 className="matrix-card-title text-white">
            {cardTitle}
          </h2>
          {subtitle && variant !== 'decorative' && (
            <p className="matrix-card-subtitle">{subtitle}</p>
          )}
          <div className="matrix-card-button text-white">
            View Art Projects
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;
