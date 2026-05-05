import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import FloatingChatBubble from '@/components/FloatingChatBubble';
import { ThemeProvider } from '@/context/ThemeContext';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollToTop from '@/components/ScrollToTop';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Banazon | Premium Electronics & Accessories",
  description: "Shop the latest electronics at Banazon. Discover laptops, smartphones, watches, and accessories with competitive pricing and fast delivery.",
  keywords: "e-commerce, electronics, laptops, smartphones, watches, accessories, online shopping",
  authors: [{ name: "Banazon Team" }],
  creator: "Banazon",
  publisher: "Banazon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://banazon.example.com",
    title: "Banazon | Premium Electronics & Accessories",
    description: "Shop the latest electronics at Banazon. Discover laptops, smartphones, watches, and accessories.",
    siteName: "Banazon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banazon | Premium Electronics & Accessories",
    description: "Shop the latest electronics at Banazon. Discover laptops, smartphones, watches, and accessories.",
    creator: "@banazon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300">
        <ThemeProvider>
          <CartProvider>
            <ScrollProgress />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <FloatingChatBubble />
            <ScrollToTop />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
