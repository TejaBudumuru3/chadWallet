import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Outfit, Roboto, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const plusJakartaSans = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", weight: ["300", "400", "500", "700"], subsets: ["latin"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChadWallet — Hunt Every Memecoin",
  description:
    "The fastest Solana memecoin trading wallet. Hunt every memecoin. Every chain. One wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} ${outfit.variable} ${roboto.variable} ${geist.variable} ${geistMono.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://public-api.birdeye.so" />
        <link rel="preconnect" href="https://quote-api.jup.ag" />
        <link rel="preconnect" href="https://solana-mainnet.g.alchemy.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
