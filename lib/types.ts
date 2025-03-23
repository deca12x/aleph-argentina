// Auth related types
export interface User {
  // Add user properties as needed
}

export interface Clan {
  id: string;
  name: string;
  poapIds: string[];
  websiteUrl?: string;
  visualProperties?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundImage?: string;
    cardBackgroundImage?: string;
    logoImage?: string;
    hasEphemeralChat?: boolean;
  };
}

// Message sender type for ephemeral chat
export interface MessageSender {
  address: string;
  displayName?: string;
}

// Message type for ephemeral chat
export interface EphemeralMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  expiresAt: Date;
  paymentAmount: string;
}
