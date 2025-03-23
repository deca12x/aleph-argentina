// Auth related types
export interface User {
  // Add user properties as needed
}

export interface Clan {
  id: string;
  name: string;
  poapIds: string[];
  visualProperties?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundImage?: string;
    cardBackgroundImage?: string;
    logoImage?: string;
  };
}
