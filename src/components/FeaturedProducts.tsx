'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { normalizeProducts, type ProductRow } from '@/lib/products';
import type { Product } from '@/types/product';
import ScrollReveal from './ScrollReveal';
import MagneticButton from './MagneticButton';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4);

      if (error) {
        console.error('Error fetching featured products:', error);
        return;
      }

      setProducts(normalizeProducts(data as ProductRow[]));
    };

    fetchProducts();
  }, []);

  return (
    <section id="products" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4 tracking-tight text-balance">
            Featured Products
            <br />
            <span className="text-zinc-600">Handpicked for You</span>
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Discover our most popular items — carefully selected for quality and value.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 100}>
              <Link href={`/products/${product.id}`} className="group block">
                <div className="card-hover bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                    {product.badge && (
                      <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full z-10
                        ${product.badge === 'bestseller' ? 'bg-amber-100 text-amber-700' : ''}
                        ${product.badge === 'new' ? 'bg-blue-100 text-blue-700' : ''}
                        ${product.badge === 'sale' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {product.badge === 'bestseller' ? '🔥 Bestseller' : ''}
                        {product.badge === 'new' ? '✨ New' : ''}
                        {product.badge === 'sale' ? '💰 Sale' : ''}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Mock product preview using colored div with text - will replace with Image once product images are real */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                        {product.category === 'watches' && '⌚'}
                        {product.category === 'phones' && '📱'}
                        {product.category === 'laptops' && '💻'}
                        {product.category === 'pcs' && '🖥️'}
                        {product.category === 'cpu' && '🔲'}
                        {product.category === 'gpu' && '🎮'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-zinc-900 line-clamp-1 mb-1 group-hover:text-zinc-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center text-amber-400">
                        {'★'.repeat(Math.floor(product.rating))}
                        <span className="text-xs text-zinc-400 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-zinc-400">({product.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-zinc-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-zinc-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={500}>
          <div className="text-center mt-12">
            <MagneticButton
              href="/products"
              className="btn-interactive inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-semibold text-lg shadow-lg shadow-zinc-900/25"
            >
              View All Products
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
