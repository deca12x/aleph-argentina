"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="bg-black px-6 py-4 w-full">
      <div className="flex justify-between items-center">
        <div className="font-bold text-white text-lg">
          <Link href="/" className="custom-cursor-pointer">
            Aleph Argentina
          </Link>
        </div>

        <div className="flex space-x-6">
          <Link
            href="/explore"
            className={`nav-tab custom-cursor-pointer ${
              isActive("/explore") ? "active" : ""
            }`}
          >
            Explore
          </Link>

          {/* Removed collection links */}
        </div>
      </div>
    </nav>
  );
}
