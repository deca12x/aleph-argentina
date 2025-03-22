"use client";

import { useState } from 'react';
import ParallaxCardGrid from './ParallaxCardGrid';
import FloatingCardCanvas from './FloatingCardCanvas';

export default function Demo() {
  const [activeTab, setActiveTab] = useState<'grid' | 'floating'>('grid');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation/Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-megazoid">Mantle Space</h1>
          
          {/* Tabs */}
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('grid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Card Grid
            </button>
            <button 
              onClick={() => setActiveTab('floating')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'floating' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Floating Cards
            </button>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <main className="pt-16">
        {activeTab === 'grid' && <ParallaxCardGrid />}
        {activeTab === 'floating' && <FloatingCardCanvas />}
      </main>
    </div>
  );
} 