"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevPath, setPrevPath] = useState('');

  // Clear any lingering classes when the component mounts or pathname changes
  useEffect(() => {
    // Give a small delay to ensure proper DOM updates
    const clearTimer = setTimeout(() => {
      // If we're on the homepage, ensure all transition classes are cleared
      if (pathname === '/') {
        document.body.classList.remove('page-transitioning');
        document.body.classList.remove('page-entered');
        // Add back page-entered with a slight delay for a smooth fade-in
        setTimeout(() => {
          document.body.classList.add('page-entered');
        }, 10);
      }
    }, 50);
    
    return () => {
      clearTimeout(clearTimer);
    };
  }, [pathname]);

  useEffect(() => {
    // Remove any existing page-entered class when component mounts
    document.body.classList.remove('page-entered');
    
    // Add page-entered class after component mounts to trigger fade-in
    const pageEnteredTimer = setTimeout(() => {
      document.body.classList.add('page-entered');
    }, 10);
    
    return () => {
      clearTimeout(pageEnteredTimer);
      document.body.classList.remove('page-entered');
    };
  }, []);

  useEffect(() => {
    // Only trigger transition when pathname actually changes
    if (prevPath && prevPath !== pathname) {
      // Add transitioning class to trigger fade-out
      document.body.classList.add('page-transitioning');
      setIsTransitioning(true);
      
      // Remove transitioning class and add entered class after transition completes
      const timer = setTimeout(() => {
        document.body.classList.remove('page-transitioning');
        document.body.classList.add('page-entered');
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