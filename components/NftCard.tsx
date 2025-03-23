"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NftCardProps {
  id: number;
  collectionName?: string; // Optional collection name
  imageUrl: string;
  href?: string; // Optional link destination
}

export default function NftCard({
  id,
  collectionName,
  imageUrl,
  href,
}: NftCardProps) {
  const card = (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={`NFT #${id}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold">
          {collectionName || "NFT"} #{id}
        </h3>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
