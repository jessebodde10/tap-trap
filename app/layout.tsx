import type { Metadata, Viewport } from "next";
import { Lora, Inter, Anybody, Lexend } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const anybody = Anybody({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-anybody",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lexend",
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
    <html lang="nl" className={`h-full ${lora.variable} ${inter.variable} ${anybody.variable} ${lexend.variable}`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
