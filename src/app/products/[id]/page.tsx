'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('description');
  const { id } = use(params);
  const productId = parseInt(id);
  const product = products.find(p => p.id === productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate 2 second load time
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [productId]);

  if (!product) notFound();

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <svg key={star} className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-zinc-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="aspect-square bg-zinc-100 rounded-3xl" />
            </div>
            <div className="space-y-6 animate-pulse">
              <div className="h-10 bg-zinc-100 rounded w-3/4" />
              <div className="h-6 bg-zinc-100 rounded w-1/4" />
              <div className="h-4 bg-zinc-100 rounded w-full" />
              <div className="h-4 bg-zinc-100 rounded w-full" />
              <div className="h-12 bg-zinc-100 rounded w-40" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image Placeholder */}
          <ScrollReveal>
            <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-3xl aspect-square flex items-center justify-center">
              <div className="text-9xl opacity-20">📦</div>
            </div>
          </ScrollReveal>

          {/* Product Details */}
          <ScrollReveal delay={100}>
            <div>
              {product.badge && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  product.badge === 'bestseller' ? 'bg-green-500 text-white' :
                  product.badge === 'new' ? 'bg-blue-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {product.badge.toUpperCase()}
                </div>
              )}

              <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <RatingStars rating={product.rating} />
                <span className="text-zinc-500">{product.reviews.toLocaleString()} reviews</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-zinc-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-zinc-400 line-through">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className={`text-sm font-medium px-3 py-1.5 inline-block rounded-full mb-8 ${
                product.stock === 'in_stock' ? 'bg-green-100 text-green-700' :
                product.stock === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {product.stock.replace('_', ' ')}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-zinc-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-zinc-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-zinc-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button className="btn-interactive flex-1 bg-zinc-900 text-white py-4 rounded-xl font-semibold text-lg">
                  Buy Now
                </button>
                <button 
                  onClick={() => {
                    for(let i = 0; i < quantity; i++) addToCart(product!);
                  }}
                  className="btn-interactive flex-1 bg-white text-zinc-900 border border-zinc-200 py-4 rounded-xl font-semibold text-lg"
                >
                  Add to Cart
                </button>
              </div>

              {/* Tabs */}
              <div>
                <div className="flex gap-4 border-b border-zinc-200 mb-6">
                  {['description', 'specifications', 'features'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`pb-3 font-medium capitalize ${
                        selectedTab === tab
                          ? 'text-zinc-900 border-b-2 border-zinc-900'
                          : 'text-zinc-500 hover:text-zinc-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {selectedTab === 'description' && (
                  <p className="text-zinc-600 leading-relaxed">{product.description}</p>
                )}

                {selectedTab === 'specifications' && (
                  <div className="space-y-3">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-600">{spec.label}</span>
                        <span className="font-medium text-zinc-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'features' && (
                  <ul className="space-y-3">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-700">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}