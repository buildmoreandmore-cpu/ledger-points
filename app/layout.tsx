import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RedeemMax — Every point. Maximum trip.",
  description:
    "Every point. Maximum trip. An award-search engine filtered to the cards in your wallet — cash, best transfer partner, and the sweet-spot redemption Google Flights will never surface.",
  metadataBase: new URL("https://redeemmax.com"),
  openGraph: {
    title: "RedeemMax — Every point. Maximum trip.",
    description:
      "Award search filtered to the cards in your wallet. One search replaces Seats.aero, AwardFares, AwardWallet, and every other tab.",
    type: "website",
    siteName: "RedeemMax",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
