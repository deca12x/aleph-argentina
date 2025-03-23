import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable caching for this route

interface POAPEvent {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  // other fields...
}

interface POAPToken {
  tokenId: string;
  owner: string;
  event: POAPEvent;
}

// Mock POAP data for development - using existing images from the public directory
const mockPoapTokens: POAPToken[] = [
  {
    tokenId: "1234567",
    owner: "0xE22dd580EAAd07f4e5fecE17c0A3B60e14DF58F2",
    event: {
      id: 186431, // Matches a Mantle POAP ID
      fancy_id: "mantle-demo-day",
      name: "Mantle Demo Day",
      event_url: "https://mantle.xyz",
      // Use existing images to avoid 404s
      image_url: "/events/asado-mantle.png",
      country: "Argentina",
      city: "Buenos Aires",
      description: "Mantle Demo Day in Buenos Aires",
      year: 2025,
      start_date: "2025-03-15",
      end_date: "2025-03-15"
    }
  },
  {
    tokenId: "7654321",
    owner: "0xE22dd580EAAd07f4e5fecE17c0A3B60e14DF58F2",
    event: {
      id: 185622, // Matches a Mantle POAP ID
      fancy_id: "mantle-hackathon",
      name: "Mantle Hackathon",
      event_url: "https://mantle.xyz",
      // Use existing images to avoid 404s
      image_url: "/events/dmeoday1.png",
      country: "Argentina",
      city: "Buenos Aires",
      description: "Mantle Hackathon in Buenos Aires",
      year: 2025,
      start_date: "2025-03-20",
      end_date: "2025-03-22"
    }
  }
];

export async function GET(request: Request) {
  // Get the wallet address from the URL
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    console.error("POAP API: Missing address parameter");
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  console.log(`POAP API: Checking POAPs for address ${address}`);

  // Check if we're in development and missing API keys
  const isDev = process.env.NODE_ENV === "development";
  const missingEnvVars = !process.env.POAP_API_KEY || !process.env.POAP_AUTH_TOKEN;

  // If in development and missing env vars, return mock data
  if (isDev && missingEnvVars) {
    console.log("POAP API: Using mock data in development mode");
    
    // Return mock data that matches the expected format
    return NextResponse.json(mockPoapTokens);
  }

  // For production, verify we have the required environment variables
  if (missingEnvVars) {
    console.error("POAP API: Missing required environment variables");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    // Call the POAP API from the server side
    const poapUrl = `https://api.poap.tech/actions/scan/${address}`;
    console.log(`POAP API: Calling ${poapUrl}`);

    const response = await fetch(poapUrl, {
      headers: {
        "x-api-key": process.env.POAP_API_KEY as string,
        Authorization: `Bearer ${process.env.POAP_AUTH_TOKEN as string}`,
        Accept: "application/json",
      },
      // Adding cache control
      cache: "no-store",
    });

    // Log the full response for debugging
    console.log(
      `POAP API response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `POAP API error: ${response.status} ${response.statusText}`,
        `Response body: ${errorText}`
      );

      // In development, fall back to mock data if the API call fails
      if (isDev) {
        console.log("POAP API: Falling back to mock data after API error");
        return NextResponse.json(mockPoapTokens);
      }

      return NextResponse.json(
        { error: `Failed to retrieve POAP data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(
      `POAP API: Successfully retrieved ${
        Array.isArray(data) ? data.length : 0
      } tokens`
    );

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("POAP API error:", errorMessage);
    
    // In development, fall back to mock data if there's an exception
    if (isDev) {
      console.log("POAP API: Falling back to mock data after exception");
      return NextResponse.json(mockPoapTokens);
    }
    
    return NextResponse.json(
      { error: `Failed to fetch POAP data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
