import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
