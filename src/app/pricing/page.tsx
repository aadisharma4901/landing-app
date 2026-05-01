'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { products } from '@/data/products';

export default function DealsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Get products with badges (bestseller, sale, new) and sort by discount
  const deals = products
    .filter(p => p.badge || p.originalPrice)
    .sort((a, b) => {
      const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
      const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
      return discountB - discountA;
    });

  const ProductCard = ({ product, index = 0 }: { product: typeof products[0]; index?: number }) => (
    <ScrollReveal delay={index * 100}>
      <Link href={`/products/${product.id}`} className="group block">
        <div className="card-hover bg-white rounded-2xl border border-zinc-100 overflow-hidden h-full">
          <div className="aspect-square bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center relative">
            <div className="text-8xl opacity-10">📦</div>
            {product.badge && (
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                product.badge === 'bestseller' ? 'bg-green-500 text-white' :
                product.badge === 'new' ? 'bg-blue-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {product.badge.toUpperCase()}
              </div>
            )}
            {product.originalPrice && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="font-bold text-zinc-900 mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-zinc-900">{product.rating}</span>
              <span className="text-xs text-zinc-500">({product.reviews.toLocaleString()} reviews)</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-red-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            {product.stock === 'low_stock' && (
              <div className="text-xs text-amber-600 font-medium">Only a few left!</div>
            )}
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );

  return (
    <main className="pt-24 pb-20 bg-gradient-to-b from-zinc-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-red-100 rounded-full text-red-600 font-semibold text-sm mb-6">
            🔥 HOT DEALS — Limited Time!
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
            Deals & Discounts
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Score big savings on premium electronics. Verified deals updated daily.
          </p>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { num: deals.length, label: 'Active Deals' },
            { num: '50%+', label: 'Max Discount' },
            { num: '24h', label: 'Flash Sales' },
            { num: 'Free', label: 'Shipping over $99' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6 text-center">
              <div className="text-3xl font-bold text-zinc-900 mb-1">{stat.num}</div>
              <div className="text-sm text-zinc-600">{stat.label}</div>
            </div>
          ))}
        </ScrollReveal>

        {/* Deals Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-zinc-100" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-zinc-100 rounded w-3/4" />
                  <div className="h-4 bg-zinc-100 rounded w-1/2" />
                  <div className="h-6 bg-zinc-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {deals.length === 0 && !isLoading && (
          <ScrollReveal className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">No deals right now</h3>
            <p className="text-zinc-600 mb-6">Check back soon — we update deals daily!</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-zinc-900 text-white rounded-full font-semibold hover:bg-zinc-800">
              Browse All Products
            </Link>
          </ScrollReveal>
        )}
      </div>
    </main>
  );
}
