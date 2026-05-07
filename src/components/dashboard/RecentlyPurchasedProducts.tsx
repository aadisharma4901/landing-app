'use client';

import Link from 'next/link';
import { RecentlyPurchasedItem } from './types';

interface RecentlyPurchasedProductsProps {
  items: RecentlyPurchasedItem[];
  isLoading?: boolean;
}

export default function RecentlyPurchasedProducts({ items, isLoading = false }: RecentlyPurchasedProductsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-zinc-200 shadow-sm animate-pulse">
            <div className="w-full aspect-square bg-zinc-200 rounded-lg mb-3"></div>
            <div className="space-y-2">
              <div className="h-5 bg-zinc-200 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
              <div className="flex justify-between items-center mt-3">
                <div className="h-6 bg-zinc-200 rounded w-16"></div>
                <div className="h-6 bg-zinc-200 rounded-full w-6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show only the last 2-3 purchased items
  const displayItems = items.slice(0, 3);

  if (displayItems.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">No purchases yet</h3>
        <p className="text-zinc-600 mb-4">Items you&apos;ve purchased will appear here.</p>
         <Link
           href="/products"
           className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
         >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
           </svg>
           <span>Start Shopping</span>
         </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayItems.map((item, index) => {
        const imageUrl = item.imageUrl || item.image_url;
        const purchaseDate = new Date(item.orderDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        return (
          <div
            key={`${item.id}-${index}`}
            className="group bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-zinc-100 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
                  📦
                </div>
              )}
              {/* Quantity Badge */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-zinc-900 shadow-sm">
                x{item.quantity}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h4 className="font-semibold text-zinc-900 line-clamp-2 mb-2 text-sm leading-tight">
                {item.name}
              </h4>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-lg font-bold text-zinc-900">${item.price.toFixed(2)}</p>
                  <p className="text-xs text-zinc-500">
                    {purchaseDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
