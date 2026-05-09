import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tap & Trap",
  description: "Vind een café bij jou in de buurt om de WK-wedstrijden te kijken.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`h-full dark ${barlow.variable}`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
