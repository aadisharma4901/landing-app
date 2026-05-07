'use client';

import { useState, useEffect, useMemo } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { supabase } from '@/lib/supabase';
import { normalizeProducts, type ProductRow } from '@/lib/products';
import type { Product, Category } from '@/types/product';
import Link from 'next/link';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(normalizeProducts(data as ProductRow[]));
      }

      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const categories: Category[] = useMemo(() => [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'watches', name: 'Watches', count: products.filter((p) => p.category === 'watches').length },
    { id: 'phones', name: 'Smartphones', count: products.filter((p) => p.category === 'phones').length },
    { id: 'laptops', name: 'Laptops', count: products.filter((p) => p.category === 'laptops').length },
    { id: 'cpu', name: 'Processors', count: products.filter((p) => p.category === 'cpu').length },
    { id: 'gpu', name: 'Graphics Cards', count: products.filter((p) => p.category === 'gpu').length },
    { id: 'pcs', name: 'Desktop PCs', count: products.filter((p) => p.category === 'pcs').length },
  ], [products]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-zinc-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-zinc-500 ml-2">({rating})</span>
    </div>
  );

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-zinc-100" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-zinc-100 rounded w-3/4" />
        <div className="h-4 bg-zinc-100 rounded w-1/2" />
        <div className="h-6 bg-zinc-100 rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            All Products
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Browse our complete collection of premium electronics and accessories
          </p>
        </ScrollReveal>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setIsLoading(true);
                    setSelectedCategory(cat.id);
                    setTimeout(() => setIsLoading(false), 300);
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>
          <div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border border-zinc-200 bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            sortedProducts.map(product => (
              <ScrollReveal key={product.id} delay={100}>
                <Link href={`/products/${product.id}`}>
                  <div className="card-hover bg-white rounded-2xl border border-zinc-100 overflow-hidden h-full">
                    {/* Product Image Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center relative">
                      <div className="text-6xl opacity-20">📦</div>
                      {product.badge && (
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          product.badge === 'bestseller' ? 'bg-green-500 text-white' :
                          product.badge === 'new' ? 'bg-blue-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {product.badge.toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-zinc-900 mb-2 line-clamp-2">{product.name}</h3>
                      <RatingStars rating={product.rating} />
                      <p className="text-xs text-zinc-500 mb-3">{product.reviews.toLocaleString()} reviews</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-zinc-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-zinc-400 line-through">${product.originalPrice}</span>
                        )}
                      </div>

                      <div className={`text-xs font-medium px-2 py-1 inline-block rounded-full ${
                        product.stock === 'in_stock' ? 'bg-green-100 text-green-700' :
                        product.stock === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stock.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
