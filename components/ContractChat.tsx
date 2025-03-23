"use client";

import React from "react";
import ContractChatMessages from "./chat/ContractChatMessages";
import ContractChatInput from "./chat/ContractChatInput";

interface ContractChatProps {
  clanId: string;
}

/**
 * A complete chat component that combines messages and input
 * that interact with the on-chain smart contracts
 */
export default function ContractChat({ clanId }: ContractChatProps) {
  return (
    <>
      {/* Messages display */}
      <ContractChatMessages clanId={clanId} />

      {/* Input for sending new messages */}
      <ContractChatInput clanId={clanId} />
    </>
  );
}
