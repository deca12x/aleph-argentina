import { Providers } from "../components/providers";
import { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Aleph Argentina",
  description: "Aleph Community Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Add a script to handle ethereum provider conflicts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent multiple providers from redefining window.ethereum
              if (window.ethereum) {
                Object.defineProperty(window, 'ethereum', {
                  value: window.ethereum,
                  writable: false,
                  configurable: false
                });
              }
            `
          }}
        />
      </head>
      <body>
        <Providers>
          <PageTransition />
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
