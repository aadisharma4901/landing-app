'use client';

import Link from 'next/link';

export default function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-24 h-24 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3 text-center">
        No Orders Yet
      </h2>

      {/* Description */}
      <p className="text-zinc-600 mb-8 max-w-md text-center leading-relaxed">
        You haven't placed any orders yet. Browse our products and start shopping to see your order history here.
      </p>

      {/* CTA */}
      <Link
        href="/products"
        className="btn-interactive inline-flex items-center space-x-2 px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-zinc-800 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span>Browse Products</span>
      </Link>

      {/* Decorative element */}
      <div className="mt-12 text-sm text-zinc-400 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Your order history will appear here once you make a purchase.</span>
      </div>
    </div>
  );
}
