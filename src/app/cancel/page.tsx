'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function CancelPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
              Payment Canceled
            </h1>

            <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
              Your payment was canceled. No charges were made. Your cart items are still saved.
            </p>
          </div>

          {/* Help Box */}
          <div className="bg-zinc-50 rounded-2xl p-8 mb-8">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Need Help?</h2>

            <div className="space-y-4 text-left">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-zinc-700">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Check your payment method</h3>
                  <p className="text-sm text-zinc-600">Make sure your card is valid and has sufficient funds.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-zinc-700">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Try a different payment method</h3>
                  <p className="text-sm text-zinc-600">We accept all major credit and debit cards.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-zinc-700">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Contact support</h3>
                  <p className="text-sm text-zinc-600">Our team is here to help 24/7.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Card Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Card (Sandbox)</h3>
            <p className="text-blue-800 mb-3">Use these test card details for successful payments:</p>
            <div className="bg-white rounded-lg p-4 font-mono text-sm text-zinc-800 border border-blue-200">
              <div><strong>Card Number:</strong> 4242 4242 4242 4242</div>
              <div><strong>Expiry:</strong> Any future date (e.g., 12/30)</div>
              <div><strong>CVC:</strong> Any 3 digits (e.g., 123)</div>
              <div><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/cart"
              className="btn-interactive inline-block px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg"
            >
              Return to Cart
            </Link>

            <Link
              href="/products"
              className="inline-block px-8 py-4 border border-zinc-300 rounded-xl font-semibold text-lg hover:bg-zinc-50 transition-colors"
            >
              Browse Products
            </Link>
          </div>

          {/* Support Link */}
          <p className="mt-8 text-sm text-zinc-500">
            Still having issues?{' '}
            <Link href="/contact" className="text-zinc-900 underline hover:no-underline">
              Contact Support
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </main>
  );
}
