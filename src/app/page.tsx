import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Products3DShowcase from "@/components/Products3DShowcase";
import React from 'react';

export default function Home(): React.JSX.Element {
  return (
    <>
      <Hero />
      <StatsSection />
      <Products3DShowcase />
      <FeaturedProducts />
      <Features />
      <CTA />
    </>
  );
}
