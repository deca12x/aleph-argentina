"use client";

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import NftCard from '@/components/NftCard';
import TraitsFilter from '@/components/TraitsFilter';
import { bakcDescription, bakcTraitCategories, bakcNfts } from '@/data/bakc';

export default function BakcPage() {
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string[]>>({});

  const handleTraitSelect = (category: string, trait: string) => {
    setSelectedTraits((prev) => {
      const currentCategoryTraits = prev[category] || [];

      // If trait is already selected, remove it
      if (currentCategoryTraits.includes(trait)) {
        return {
          ...prev,
          [category]: currentCategoryTraits.filter(t => t !== trait)
        };
      }

      // Otherwise add it
      return {
        ...prev,
        [category]: [...currentCategoryTraits, trait]
      };
    });
  };

  // Filter NFTs based on selected traits (for demo, we're not actually filtering since we don't have trait data for each NFT)
  const filteredNfts = bakcNfts;

  return (
    <div className="min-h-screen custom-cursor">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <aside className="w-full md:w-80">
            <h1 className="text-4xl mb-4 font-megazoid text-bakc-cream">BAKC</h1>
            <p className="text-white text-sm mb-6">{bakcDescription}</p>

            <TraitsFilter
              traitCategories={bakcTraitCategories}
              onTraitSelect={handleTraitSelect}
              selectedTraits={selectedTraits}
            />
          </aside>

          {/* NFT grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNfts.map((nft) => (
                <NftCard
                  key={nft.id}
                  id={nft.id}
                  collection="bakc"
                  imageUrl={nft.imageUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
