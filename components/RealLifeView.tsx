"use client";

import React from 'react';
import Image from 'next/image';

export default function RealLifeView() {
  return (
    <section className="h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/boys-nft-collection/image.webp"
          alt="Real Life View"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 pt-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-megazoid">Real Life</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            This is reality - everything you see here is actually happening.
          </p>
        </div>

        <div className="flex justify-center items-center h-[50vh]">
          <div className="p-8 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Welcome to Reality</h3>
            <p className="text-gray-300 mb-4">
              In this view, you're seeing things as they truly are. No illusions, no digital constructs - just pure reality.
            </p>
            <p className="text-gray-300">
              Connect with other real beings and experience the authentic world around you. The choices you make here have real consequences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 