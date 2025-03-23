import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable caching for this route

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

  // Verify we have the required environment variables
  if (!process.env.POAP_API_KEY || !process.env.POAP_AUTH_TOKEN) {
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
        "x-api-key": process.env.POAP_API_KEY,
        Authorization: `Bearer ${process.env.POAP_AUTH_TOKEN}`,
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
    return NextResponse.json(
      { error: `Failed to fetch POAP data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
