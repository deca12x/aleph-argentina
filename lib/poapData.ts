import { Clan } from "@/lib/types";

export const clans: Clan[] = [
  {
    id: "crecimiento",
    name: "Crecimiento",
    poapIds: [],
    visualProperties: {
      primaryColor: "#4CAF50",
      secondaryColor: "#8BC34A",
      backgroundImage: "/mantle1.webp", // Using Mantle image as placeholder
      cardBackgroundImage: "/mantle2.webp", // Using Mantle image as placeholder
      logoImage: "/icons/growth-logo.png"
    }
  },
  {
    id: "urbe",
    name: "Urbe",
    poapIds: [
      "185407",
      "178653",
      "175520",
      "175522",
      "175601",
      "175525",
      "175519",
      "175524",
      "175582",
      "175491",
    ],
    visualProperties: {
      primaryColor: "#2196F3",
      secondaryColor: "#03A9F4",
      backgroundImage: "/mantle1.webp", // Using Mantle image as placeholder
      cardBackgroundImage: "/mantle2.webp", // Using Mantle image as placeholder
      logoImage: "/icons/urbe-logo.png"
    }
  },
  {
    id: "zksync",
    name: "zkSync",
    poapIds: [],
    visualProperties: {
      primaryColor: "#9C27B0",
      secondaryColor: "#E040FB",
      backgroundImage: "/mantle1.webp", // Using Mantle image as placeholder
      cardBackgroundImage: "/mantle2.webp", // Using Mantle image as placeholder
      logoImage: "/icons/zksync-logo.png"
    }
  },
  {
    id: "mantle",
    name: "Mantle",
    poapIds: [
      "186431",
      "185622",
      "185623",
      "185620",
      "185621",
      "184951",
      "183425",
      "183020",
    ],
    visualProperties: {
      primaryColor: "#FF5722",
      secondaryColor: "#FF9800",
      backgroundImage: "/mantle1.webp",
      cardBackgroundImage: "/mantle2.webp",
      logoImage: "/icons/mantle-mnt-logo (1).png"
    }
  },
  {
    id: "aleph",
    name: "Aleph",
    poapIds: [],
    visualProperties: {
      primaryColor: "#607D8B",
      secondaryColor: "#90A4AE",
      backgroundImage: "/mantle1.webp", // Using Mantle image as placeholder
      cardBackgroundImage: "/mantle2.webp", // Using Mantle image as placeholder
      logoImage: "/icons/aleph-logo.png"
    }
  },
];
