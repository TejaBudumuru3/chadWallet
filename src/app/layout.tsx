import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
