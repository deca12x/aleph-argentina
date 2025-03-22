import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NftCardProps {
  id: number;
  collection: 'bayc' | 'mayc' | 'bakc';
  imageUrl: string;
}

export default function NftCard({ id, collection, imageUrl }: NftCardProps) {
  return (
    <Link href={`/collections/${collection}/${id}`} className="nft-card custom-cursor-pointer">
      <div className="relative overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={`${collection.toUpperCase()} #${id}`}
          width={250}
          height={250}
          className="w-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-60">
          <p className="text-sm font-greedRegular text-white">#{id}</p>
        </div>
      </div>
    </Link>
  );
}
