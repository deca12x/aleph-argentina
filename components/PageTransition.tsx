"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevPath, setPrevPath] = useState('');

  useEffect(() => {
    // Only trigger transition when pathname actually changes
    if (prevPath && prevPath !== pathname) {
      setIsTransitioning(true);
      
      // Hide after a short duration
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    // Update prevPath for next comparison
    setPrevPath(pathname);
  }, [pathname, prevPath]);

  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] pointer-events-none transition-opacity duration-300 ease-in-out ${
        isTransitioning ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
} 