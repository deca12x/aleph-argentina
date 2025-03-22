"use client";

import { usePrivy } from "@privy-io/react-auth";
import UserProfileCard from "@/components/chat/UserProfileCard";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated } = usePrivy();

  return (
    <>
      {children}
      {authenticated && <UserProfileCard />}
    </>
  );
} 