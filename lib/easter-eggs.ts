// Types for Easter egg locations
export interface EasterEggLocation {
  id: number;
  name: string;
  address: string;
  description: string;
  image: string;
  qrCodeImage?: string;
  googleMapsUrl: string;
  tags: string[];
  specialFeature?: {
    title: string;
    description: string;
    cta: string;
  };
}

export interface ClanWelcomeMessage {
  title: string;
  message1: string;
  message2: string;
}

// Clan-specific location data
export const clanLocations: Record<string, EasterEggLocation[]> = {
  // Mantle clan (clan4) locations
  clan4: [
    {
      id: 1,
      name: "Aleph Hub",
      address: "Concepción Arenal 2989, C1426DGG, Cdad. Autónoma de Buenos Aires",
      description: "Home to our flagship 3D NFT Easter egg. Discover this digital collectible anchored to a real-world coordinate, visible only through your phone.",
      image: "/locations/aleph-hub-location.webp",
      qrCodeImage: "/locations/aleph-hub-8code.png",
      googleMapsUrl: "https://www.google.com/maps/place/Aleph+Hub/data=!4m2!3m1!1s0x0:0x3a22d7994f3ff7ec?sa=X&ved=1t:2428&ictx=111",
      tags: ["3D NFT", "Collectible", "AR Experience"],
      specialFeature: {
        title: "3D Easter Egg Collectible",
        description: "Step into the world of 3D NFT collectibles at Aleph Hub powered by Mantle! Scan the QR code when you arrive to reveal a unique 3D NFT anchored to this exact location. This exclusive digital art piece exists only in this physical space and can be collected and owned only by those who visit in person!",
        cta: "Visit to collect this 3D NFT"
      }
    },
    {
      id: 2,
      name: "Mantle Blockchain Hub",
      address: "San Martín 344, Buenos Aires, Argentina",
      description: "Find the hidden Mantle Alien Race NFT anchored to this location. Scan the QR code on site to reveal and claim this exclusive 3D digital asset.",
      image: "/boys-nft-collection/image (1).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6037,-58.3816",
      tags: ["Alien Race NFT", "Limited Edition", "GPS-Locked"]
    },
    {
      id: 3,
      name: "Crypto Art Gallery",
      address: "Defensa 791, San Telmo, Buenos Aires, Argentina",
      description: "Home to a mysterious Mantle Crystal 3D NFT. Visit this location to discover a rare digital collectible that can only be seen and claimed at these coordinates.",
      image: "/boys-nft-collection/image (2).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6173,-58.3722",
      tags: ["Crystal NFT", "Rare Find", "Location-Based"]
    },
    {
      id: 4,
      name: "Web3 Palermo Social Club",
      address: "Guatemala 4699, Buenos Aires, Argentina",
      description: "A special Jelly Army 3D NFT is hiding at this location. Visit in person and use your phone's camera to reveal this exclusive digital treasure.",
      image: "/boys-nft-collection/image (3).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5862,-58.4241",
      tags: ["Jelly Army", "Digital Treasure", "AR Collectible"]
    },
    {
      id: 5,
      name: "DeFi Conference Center",
      address: "Av. Corrientes 1234, Buenos Aires, Argentina",
      description: "Seek out the legendary Mantle Boy 3D NFT anchored to this physical location. This digital asset only reveals itself to visitors who scan the QR code on site.",
      image: "/boys-nft-collection/image.webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6037,-58.3917",
      tags: ["Mantle Boy", "Legendary NFT", "Location-Based"]
    }
  ],
  
  // Urbe clan (clan2) locations
  clan2: [
    {
      id: 1,
      name: "Urbe Digital Hub",
      address: "Av. Rivadavia 1234, Buenos Aires, Argentina",
      description: "Discover the urban-themed 3D NFT anchored to this downtown location. A digital representation of city architecture that evolves with time.",
      image: "/locations/urbe-hub.webp",
      qrCodeImage: "/locations/urbe-qrcode.png",
      googleMapsUrl: "https://maps.google.com/?q=-34.6037,-58.3816",
      tags: ["Urban NFT", "Architecture", "Evolution"],
      specialFeature: {
        title: "Urban Evolution NFT",
        description: "Capture the Urbe Digital Hub NFT that changes as the city around it transforms. This location-based digital asset represents the urban development of Buenos Aires and evolves with real-world construction and changes!",
        cta: "Visit to claim this Urban NFT"
      }
    },
    {
      id: 2,
      name: "City Garden Gallery",
      address: "Plaza Serrano, Palermo, Buenos Aires",
      description: "Find a hidden Urban Garden NFT in this popular plaza. Each digital plant in this collection responds to real weather data.",
      image: "/boys-nft-collection/image (2).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5862,-58.4235",
      tags: ["Garden NFT", "Weather-Reactive", "Green Spaces"]
    },
    {
      id: 3,
      name: "Transit Hub Connection",
      address: "Retiro Station, Buenos Aires, Argentina",
      description: "Capture a Transit NFT at this transportation center. This 3D asset tracks real-time transit data and changes appearance based on congestion.",
      image: "/boys-nft-collection/image (3).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5912,-58.3733",
      tags: ["Transit NFT", "Data-Driven", "Digital Twin"]
    },
    {
      id: 4,
      name: "Urban Soundscape Point",
      address: "Teatro Colón, Buenos Aires, Argentina",
      description: "Experience a reactive Soundscape NFT that captures the acoustic fingerprint of this iconic venue. Visitors receive a unique audio-visual NFT.",
      image: "/boys-nft-collection/image.webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6011,-58.3833",
      tags: ["Audio NFT", "Performance", "Acoustic Art"]
    },
    {
      id: 5,
      name: "Street Art Collective",
      address: "Barrio La Boca, Buenos Aires, Argentina",
      description: "Hunt for the Street Art NFT in this colorful neighborhood. Augmented reality murals come to life when viewed through your camera.",
      image: "/boys-nft-collection/image (1).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6345,-58.3631",
      tags: ["Street Art", "AR Experience", "Digital Murals"]
    }
  ],
  
  // zkSync clan (clan3) locations
  clan3: [
    {
      id: 1,
      name: "zkSync Innovation Lab",
      address: "Av. Libertador 4980, Buenos Aires, Argentina",
      description: "Discover an exclusive zkSync NFT that utilizes zero-knowledge proofs for unique verification. Only available at this physical location.",
      image: "/locations/aleph-hub-location.webp",
      qrCodeImage: "/locations/zksync-qrcode.png",
      googleMapsUrl: "https://maps.google.com/?q=-34.5755,-58.4229",
      tags: ["zkProof NFT", "Cryptography", "Innovation"],
      specialFeature: {
        title: "Zero-Knowledge Easter Egg",
        description: "Unlock a cryptographically secure NFT that incorporates actual zero-knowledge proof technology! This digital asset proves you were physically present without revealing any other personal data. A perfect demonstration of privacy-preserving technology in action!",
        cta: "Visit to unlock this zkNFT"
      }
    },
    {
      id: 2,
      name: "Tech University Campus",
      address: "Ciudad Universitaria, Buenos Aires, Argentina",
      description: "Find the Academic zkNFT hidden on campus. This digital asset contains actual mathematical proofs as part of its metadata.",
      image: "/boys-nft-collection/image.webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5423,-58.4372",
      tags: ["Academic", "Mathematics", "Recursive Proofs"]
    },
    {
      id: 3,
      name: "Privacy Park Node",
      address: "Parque 3 de Febrero, Buenos Aires, Argentina",
      description: "Seek out the Nature Protocol NFT in this park. Each collected NFT contributes to a larger shared computation network.",
      image: "/boys-nft-collection/image (3).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5746,-58.4153",
      tags: ["Nature Protocol", "Collective Computing", "Private Data"]
    },
    {
      id: 4,
      name: "Financial District Portal",
      address: "Catalinas Norte, Buenos Aires, Argentina",
      description: "Capture the Financial zkNFT that demonstrates the power of confidential transactions using zero-knowledge technology.",
      image: "/boys-nft-collection/image (2).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5968,-58.3722",
      tags: ["Financial Tech", "Transactions", "Privacy"]
    },
    {
      id: 5,
      name: "Data Security Vault",
      address: "Puerto Madero, Buenos Aires, Argentina",
      description: "Access the Secure Data NFT that can only be unlocked by solving a zero-knowledge puzzle at this location.",
      image: "/boys-nft-collection/image (1).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6156,-58.3635",
      tags: ["Security", "Puzzles", "Interactive NFT"]
    }
  ],
  
  // Crecimiento clan (clan1) locations
  clan1: [
    {
      id: 1,
      name: "Growth Innovation Center",
      address: "Av. Córdoba 5355, Buenos Aires, Argentina",
      description: "Discover the Growth Seed NFT that visually evolves over time, representing sustainable development initiatives. Scan to claim your own evolving digital asset.",
      image: "/locations/aleph-hub-location.webp",
      qrCodeImage: "/locations/growth-qrcode.png",
      googleMapsUrl: "https://maps.google.com/?q=-34.5986,-58.4342",
      tags: ["Growth NFT", "Evolution", "Sustainability"],
      specialFeature: {
        title: "Growing Digital Asset",
        description: "Unlock the Growth Seed NFT that literally grows and evolves over time! This digital asset changes appearance based on real-world sustainability metrics and your own actions. The more sustainable actions you take, the more your digital asset flourishes!",
        cta: "Visit to plant your digital seed"
      }
    },
    {
      id: 2,
      name: "Botanic Gardens Lab",
      address: "Jardín Botánico, Buenos Aires, Argentina",
      description: "Find the Biodiversity NFT hidden in the gardens. This collection contains digital twins of rare plant species with educational metadata.",
      image: "/boys-nft-collection/image (1).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5828,-58.4142",
      tags: ["Biodiversity", "Education", "Digital Twins"]
    },
    {
      id: 3,
      name: "Sustainable Energy Hub",
      address: "Parque de la Ciudad, Buenos Aires, Argentina",
      description: "Capture the Energy Flow NFT that visualizes renewable energy data. This 3D asset changes based on actual solar and wind conditions.",
      image: "/boys-nft-collection/image (2).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6757,-58.4472",
      tags: ["Renewable Energy", "Data Visualization", "Climate"]
    },
    {
      id: 4,
      name: "Agricultural Tech Center",
      address: "Parque Centenario, Buenos Aires, Argentina",
      description: "Access the AgTech NFT that connects digital assets to real-world agricultural data. Scan to receive a unique crop growth simulation.",
      image: "/boys-nft-collection/image.webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6064,-58.4324",
      tags: ["Agriculture", "Food Tech", "Simulations"]
    },
    {
      id: 5,
      name: "Community Development Space",
      address: "Centro Cultural Recoleta, Buenos Aires, Argentina",
      description: "Join the Community NFT project where your digital asset grows stronger as more community members participate in local initiatives.",
      image: "/boys-nft-collection/image (3).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5838,-58.3930",
      tags: ["Community", "Collective Growth", "Social Impact"]
    }
  ],
  
  // Aleph clan (clan5) locations
  clan5: [
    {
      id: 1,
      name: "Aleph Zero Point",
      address: "Planetario Galileo Galilei, Buenos Aires, Argentina",
      description: "Experience the Cosmic Data NFT that connects to real astronomical data. This 3D asset visualizes the cosmos in an interactive digital experience.",
      image: "/locations/aleph-hub-location.webp",
      qrCodeImage: "/locations/aleph-qrcode.png",
      googleMapsUrl: "https://maps.google.com/?q=-34.5683,-58.4138",
      tags: ["Cosmic NFT", "Data Visualization", "Interactive"],
      specialFeature: {
        title: "Cosmic Data Collector",
        description: "Access the Aleph Zero Point NFT that connects to actual astronomical data sources! This unique digital asset changes its appearance based on cosmic events and can be used to track celestial phenomena. Owning this NFT grants you special access to Aleph's data network!",
        cta: "Visit to connect with the cosmos"
      }
    },
    {
      id: 2,
      name: "Data Nexus Hub",
      address: "Biblioteca Nacional, Buenos Aires, Argentina",
      description: "Find the Knowledge NFT that contains a fragment of Aleph's distributed computing network. Each fragment connects to a larger data ecosystem.",
      image: "/boys-nft-collection/image (3).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5825,-58.3975",
      tags: ["Knowledge", "Distributed Computing", "Networks"]
    },
    {
      id: 3,
      name: "Quantum Information Center",
      address: "Centro Cultural de la Ciencia, Buenos Aires, Argentina",
      description: "Discover the Quantum NFT that utilizes quantum-inspired algorithms to generate unique patterns. Each NFT is mathematically unique.",
      image: "/boys-nft-collection/image (2).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5746,-58.4354",
      tags: ["Quantum", "Algorithms", "Unique Patterns"]
    },
    {
      id: 4,
      name: "Network Node Access Point",
      address: "Parque Lezama, Buenos Aires, Argentina",
      description: "Access the Node NFT that functions as an actual access point to Aleph's decentralized network. Holders gain premium bandwidth to the network.",
      image: "/boys-nft-collection/image (1).webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.6277,-58.3692",
      tags: ["Network Node", "Access", "Bandwidth"]
    },
    {
      id: 5,
      name: "Infinity Processing Center",
      address: "MALBA, Buenos Aires, Argentina",
      description: "Capture the Computation NFT that contributes actual computing power to distributed applications on the Aleph network.",
      image: "/boys-nft-collection/image.webp",
      googleMapsUrl: "https://maps.google.com/?q=-34.5761,-58.4022",
      tags: ["Computation", "Processing Power", "Distributed Apps"]
    }
  ]
};

// Clan-specific welcome messages
export const clanWelcomeMessages: Record<string, ClanWelcomeMessage> = {
  clan1: {
    title: "GROWTH AWAITS YOU",
    message1: "GM GROWTH SEEKERS! Welcome to a world where digital assets grow alongside real sustainability initiatives. We've planted 3D NFTs across the city that evolve based on real-world data.",
    message2: "Level up your collection by finding these sustainability-powered digital assets. Each location houses a unique NFT that responds to environmental changes and collective actions. The future is growing right here!"
  },
  clan2: {
    title: "URBAN DISCOVERY MODE",
    message1: "YO URBAN EXPLORERS! The city grid now has digital layers waiting to be discovered. We've mapped 3D NFTs to specific urban hotspots that react to the pulse of city life.",
    message2: "Hit the streets and uncover these architectural marvels in digital form. Each piece responds to real-time urban data - traffic flows, building usage, and human activity. The city speaks through these tokens!"
  },
  clan3: {
    title: "ENTER THE zkREALM",
    message1: "ATTENTION PRIVACY PIONEERS! We've hidden cryptographically secure 3D NFTs throughout the city. Each one utilizes actual zero-knowledge technology to verify your discovery without compromising privacy.",
    message2: "These aren't just collectibles - they're functional demonstrations of zkSync technology in action. Prove your presence, verify your knowledge, and join the zero-knowledge revolution with these location-based digital assets!"
  },
  clan4: {
    title: "ENTER THE MANTLE ZONE",
    message1: "GM MANTLERS! This is where reality meets the fkn chain. We've dropped sick 3D NFTs at physical coordinates around the city. Not for normies - only for the real ones.",
    message2: "Based AF treasure hunt for the degen explorers. Pull up IRL, scan the codes, and stack these exclusive collectibles while the rest are still sleeping. WAGMI but only if you're actually here."
  },
  clan5: {
    title: "ACCESS THE ALEPH DIMENSION",
    message1: "GREETINGS DATA VOYAGERS! We've anchored computational 3D NFTs across the city. Each one is a functional node in our distributed network, giving holders actual utility and network access.",
    message2: "These aren't just collectibles - they're access points to the Aleph ecosystem. Discover these digital anomalies to gain special privileges, computational resources, and exclusive access to our decentralized data network!"
  }
};

// Clan-specific background images
export const clanBackgrounds: Record<string, string> = {
  clan1: "/mantle1.webp", // Placeholder - replace with actual images when available
  clan2: "/mantle1.webp", 
  clan3: "/mantle1.webp", 
  clan4: "/mantle1.webp",
  clan5: "/mantle1.webp"
};

// Clan-specific card background images
export const clanCardBackgrounds: Record<string, string> = {
  clan1: "/mantle2.webp", // Placeholder - replace with actual images when available
  clan2: "/mantle2.webp",
  clan3: "/mantle2.webp",
  clan4: "/mantle2.webp",
  clan5: "/mantle2.webp"
}; 