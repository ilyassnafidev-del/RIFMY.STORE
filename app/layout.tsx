import type { Metadata } from "next";
import "./globals.css";
import "./premium-pages.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://rifmy-artisan-candles-ilyas.sevenproject244.chatgpt.site'),
  title: {default:'RIFMY — Artisan Candle Cooperative',template:'%s | RIFMY'},
  description: "Six signature scents. Handmade in Morocco. Discover RIFMY artisan candles for your home and thoughtful gifts.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><link rel="preload" href="/fonts/brand-1.d80df8ff.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/brand-2.9fea608a.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
