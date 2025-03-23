"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';
import { baycNfts } from '@/data/bayc';
import { maycNfts } from '@/data/mayc';
import { bakcNfts } from '@/data/bakc';

export default function NftDetailPage() {
  const params = useParams();
  const collection = params.collection as string;
  const id = Number(params.id);

  // Get the correct NFT data based on collection
  let nftImageUrl = '';
  let collectionTitle = '';
  let textColor = '';

  if (collection === 'bayc') {
    nftImageUrl = baycNfts.find(nft => nft.id === id)?.imageUrl || '';
    collectionTitle = 'BAYC';
    textColor = 'text-bayc-cream';
  } else if (collection === 'mayc') {
    nftImageUrl = maycNfts.find(nft => nft.id === id)?.imageUrl || '';
    collectionTitle = 'MAYC';
    textColor = 'text-mayc-yellow';
  } else if (collection === 'bakc') {
    nftImageUrl = bakcNfts.find(nft => nft.id === id)?.imageUrl || '';
    collectionTitle = 'BAKC';
    textColor = 'text-bakc-cream';
  }

  return (
    <div className="min-h-screen custom-cursor">
      <Navigation />

      <main className="container mx-auto px-4 py-10">
        <Link
          href={`/collections/${collection}`}
          className="flex items-center text-white hover:text-gray-300 mb-6 custom-cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to collection</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* NFT Image */}
          <div className="overflow-hidden rounded-lg">
            {nftImageUrl && (
              <Image
                src={nftImageUrl}
                alt={`${collectionTitle} #${id}`}
                width={500}
                height={500}
                className="w-full"
              />
            )}
          </div>

          {/* NFT Details */}
          <div>
            <h1 className={`text-4xl mb-4 font-megazoid ${textColor}`}>
              {collectionTitle} #{id}
            </h1>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-black bg-opacity-30 rounded-lg">
                <h2 className="text-xl font-medium mb-4">Traits</h2>
                <p className="text-gray-400 italic">Traits for this demo NFT are not implemented.</p>
              </div>

              <div className="p-4 bg-black bg-opacity-30 rounded-lg">
                <h2 className="text-xl font-medium mb-4">Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Collection</span>
                    <span className="text-white">{collectionTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token ID</span>
                    <span className="text-white">#{id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
