import { Clan } from "@/lib/types";

export const clans: Clan[] = [
  {
    id: "crecimiento",
    name: "Crecimiento",
    poapIds: [],
    visualProperties: {
      primaryColor: "#4CAF50",
      secondaryColor: "#8BC34A",
      backgroundImage: "/zksync/b5462957-8306-46d3-acc8-320bdf21cfc6.webp", // Use zksync images for crecimiento (growth)
      cardBackgroundImage: "/zksync/ec64396d-34d1-44ac-8de5-8dffff05013a.webp",
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
      backgroundImage: "/urbe/_PLG3709.webp", // Using urbe images
      cardBackgroundImage: "/urbe/UVmemePowerRangers.webp",
      logoImage: "/urbe/urbe-logo.jpg"
    }
  },
  {
    id: "zksync",
    name: "zkSync",
    poapIds: [],
    visualProperties: {
      primaryColor: "#9C27B0",
      secondaryColor: "#E040FB",
      backgroundImage: "/zksync/b5462957-8306-46d3-acc8-320bdf21cfc6.webp", // Using zksync images
      cardBackgroundImage: "/zksync/ec64396d-34d1-44ac-8de5-8dffff05013a.webp",
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
      backgroundImage: "/aleph/0f17355c-c5ce-49f0-86b6-bc2109e1ee5d.webp", // Using aleph images
      cardBackgroundImage: "/aleph/9d016266-9d4d-4dbd-996f-26d60b0d5712.webp",
      logoImage: "/icons/aleph-logo.png"
    }
  },
];
