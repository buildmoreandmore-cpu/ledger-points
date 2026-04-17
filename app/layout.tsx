import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Ledger/Points — award search filtered to your wallet",
  description:
    "Tell us the cards in your wallet. Tell us the flight. We'll show you the cash fare, the best transfer partner, and the award redemption Google Flights will never surface.",
  metadataBase: new URL("https://ledger-points.vercel.app"),
  openGraph: {
    title: "Ledger/Points",
    description:
      "A points-to-travel engine filtered to the cards in your wallet.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
