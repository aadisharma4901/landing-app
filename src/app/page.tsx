import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import React from 'react';

export default function Home(): React.JSX.Element {
  return (
    <>
      <Hero />
      <Features />
      <CTA />
    </>
  );
}
