import Image from 'next/image';
import ScrollReveal from './ScrollReveal';
import React from 'react';

export default function Hero(): React.JSX.Element {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-50 to-white pt-16">
      {/* 
        Background decorative blobs - 100% CSS animations
        Uses only transform and opacity - fully GPU accelerated
        No JavaScript running for these effects
      */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow" 
        />
        <div 
          className="absolute -bottom-60 -left-40 w-96 h-96 bg-zinc-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-slow"
          style={{ animationDelay: '6s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <ScrollReveal delay={200}>
              <div className="inline-block px-4 py-2 mb-6 bg-zinc-100 rounded-full text-sm font-medium text-zinc-600">
                🛍️ Welcome to Banazon
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-6 tracking-tight text-balance">
                Premium Electronics,
                <br />
                <span className="text-zinc-600">Best Prices</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="text-lg sm:text-xl text-zinc-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover amazing deals on watches, smartphones, laptops, and more. 
                Shop the latest technology at unbeatable prices with fast delivery.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/products"
                  className="btn-interactive inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-semibold text-lg hover:bg-zinc-800 shadow-lg shadow-zinc-900/25"
                >
                  Shop Now
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>

                <a
                  href="/pricing"
                  className="btn-interactive inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-full font-semibold text-lg hover:bg-zinc-50"
                >
                  View Deals
                </a>
              </div>
            </ScrollReveal>

            {/* Social Proof */}
            <ScrollReveal delay={700}>
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 border-2 border-white flex items-center justify-center text-xs font-bold text-zinc-600"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-900">50,000+</span> happy
                  customers
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Hero Graphic */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto animate-float" style={{ animationDelay: '1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-3xl transform rotate-6 opacity-50" />
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100">
                <div className="p-8">
                  {/* Dashboard mockup */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-zinc-200 rounded" />
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-zinc-100 rounded-lg" />
                        <div className="h-8 w-8 bg-zinc-100 rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-zinc-50 rounded-xl border border-zinc-100" />
                      <div className="h-32 bg-zinc-50 rounded-xl border border-zinc-100" />
                    </div>
                    <div className="h-24 bg-zinc-50 rounded-xl border border-zinc-100" />
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-zinc-50 rounded-lg border border-zinc-100" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}