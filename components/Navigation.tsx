"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 w-full">
      <Link href="/" className="back-button custom-cursor-pointer">
        <ArrowLeft size={18} />
        <span className="ml-2 text-sm hidden md:inline-block">BACK TO THE CLUB</span>
      </Link>

      <div className="nav-tabs mx-auto">
        <Link
          href="/collections/bayc"
          className={`nav-tab custom-cursor-pointer ${isActive('/collections/bayc') ? 'active' : ''}`}
        >
          BAYC
        </Link>
        <Link
          href="/collections/mayc"
          className={`nav-tab custom-cursor-pointer ${isActive('/collections/mayc') ? 'active' : ''}`}
        >
          MAYC
        </Link>
        <Link
          href="/collections/bakc"
          className={`nav-tab custom-cursor-pointer ${isActive('/collections/bakc') ? 'active' : ''}`}
        >
          BAKC
        </Link>
      </div>

      <div className="w-10 h-10 relative">
        <Image
          src="https://ext.same-assets.com/1608563563/849522504.jpeg"
          alt="BAYC Logo"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover"
        />
      </div>
    </nav>
  );
}
