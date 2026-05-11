import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import FloatingChatBubble from '@/components/FloatingChatBubble';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollToTop from '@/components/ScrollToTop';
import UserSyncProvider from '@/components/UserSyncProvider';
import GlobalErrorHandler from '@/components/GlobalErrorHandler';
import { ClerkProvider } from "@clerk/nextjs";

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
  // If Clerk environment variables are missing (e.g., during local development
  // without a Clerk account), render the app without the ClerkProvider to avoid
  // network errors caused by the client trying to touch a non‑existent session.
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey) {
    // Render a minimal layout that avoids any Clerk‑dependent components.
    // This prevents the session‑touch network request that fails when the
    // publishable key is absent (common in local development or CI).
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col bg-white text-zinc-900 transition-colors duration-300">
          <CartProvider>
            <GlobalErrorHandler />
            <ScrollProgress />
            {/* Navbar and UserSyncProvider are omitted when Clerk is not configured */}
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <FloatingChatBubble />
            <ScrollToTop />
          </CartProvider>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/sign-in"
    >
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col bg-white text-zinc-900 transition-colors duration-300">
          <CartProvider>
            <GlobalErrorHandler />
            <UserSyncProvider />
            <ScrollProgress />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <FloatingChatBubble />
            <ScrollToTop />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
