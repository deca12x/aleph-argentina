# How to Use the Smart Contract Integration

This document explains how to integrate the on-chain message storage with your clan pages.

## Quick Integration

For the easiest integration, use the `ContractChat` component which combines both the messages display and input:

```tsx
import ContractChat from "@/components/ContractChat";

export default function YourClanPage() {
  // Get the clan ID (example: from route params)
  const clanId = "mantle"; // or 'zksync', 'urbe', 'crecimiento'

  return (
    <div>
      {/* Your existing page layout */}

      {/* Add the contract chat */}
      <ContractChat clanId={clanId} />
    </div>
  );
}
```

## Separate Components

If you need more control, you can use the individual components:

```tsx
import ContractChatMessages from "@/components/chat/ContractChatMessages";
import ContractChatInput from "@/components/chat/ContractChatInput";

export default function YourClanPage() {
  const clanId = "mantle";

  return (
    <div>
      {/* Display messages */}
      <ContractChatMessages clanId={clanId} />

      {/* Add input at the position you want */}
      <ContractChatInput clanId={clanId} />
    </div>
  );
}
```

## Direct Hook Usage

For completely custom UI, you can use the hooks directly:

```tsx
import { useContractMessages, useContractMessage } from "@/lib/contracts";

export default function YourCustomChatUI() {
  const clanId = "zksync";
  const [input, setInput] = useState("");

  // Get messages from the contract
  const { messages, loading, error } = useContractMessages(clanId);

  // Set up ability to send messages
  const { sendMessage, status, isConfirming } = useContractMessage(clanId);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div>
      {/* Custom messages UI */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {messages.map((msg) => (
            <div key={msg.id}>
              <p>{msg.text}</p>
              <span>{new Date(msg.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Custom input UI */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        maxLength={60}
      />
      <button
        onClick={handleSend}
        disabled={status === "sending" || isConfirming}
      >
        Send
      </button>
    </div>
  );
}
```

## Network Details

The contract integration automatically uses the correct contract based on the clan:

- **Mantle Network** (chainId: 5000)

  - Used for: 'mantle' and 'urbe' clans
  - Contract: `0xec47d072d6adb995c1e561621be4d2a1bddff106`

- **zkSync Era** (chainId: 324)
  - Used for: 'zksync' and 'crecimiento' clans
  - Contract: `0xb8224e470DAA3DFCA13481556F49fFf810948105`
